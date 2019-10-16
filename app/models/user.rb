class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  rolify
  acts_as_paranoid

  has_paper_trail :class_name => 'PaperTrail::UserVersion'

  has_many :thnx, -> { where :status => 'ACTIVE' }, foreign_key: "owner_user_id", class_name: "Thnx"
  has_many :account_user
  has_many :sent_gifts, :foreign_key => "sender_user_id", class_name: "Gift"
  has_many :received_gifts, :foreign_key => "receipient_user_id", class_name: "Gift"

  devise :database_authenticatable, 
         :registerable,
         :recoverable, 
         :rememberable, 
         :validatable, 
         :confirmable,
         :trackable,
         :jwt_authenticatable, 
         jwt_revocation_strategy: self

  validates :email, uniqueness: { case_sensitive: false }

  after_save :update_confirmed
  
  before_create do
    self.email.downcase!
  end


  # - VALIDATIONS
  validates :email, uniqueness: { case_sensitive: false }
  validates_presence_of :email, :first_name
  validates_length_of :email, minimum: 4, maximum: 255

  def is_admin
    access = AccountUser.find_by_user_id(self.id)
    if access.present?
      access.has_role? :account_admin
    else
      false  
    end
  end

  def organisation_thnx_credits
    OrganisationThnx.where(owner_user_id: self.id, status: "ACTIVE").count
  end
  
  def thnx_credits
    Thnx.where(owner_user_id: self.id, status: "ACTIVE").count
  end

  def last_7_days_giving_activity
    self.sent_gifts

    gifts_by_day = []
    [*0..6].reverse.each{ |day|
      gift_date = day.days.ago.beginning_of_day
      gift_day_total = self.sent_gifts.select { |gift| gift.created_at.to_date == gift_date}.length
      gifts_by_day << gift_day_total
    }

    gifts_by_day
  end
  
  def update_confirmed
    if self.confirmed_at.present? and !self.confirmed
      self.confirmed = true
      self.save!
    end
  end

  # TODO CHECK
  def token    
    access = AccountUser.find_by_user_id(self.id)
    my_roles = []
    my_roles = self.roles&.pluck(:name)
    my_roles << access.roles&.pluck(:name) if access.present?
    
    JWT.encode({id: self.id,
      exp: 60.days.from_now.to_i,
                roles: my_roles.flatten,
      },
      Rails.application.credentials.fetch(:secret_key_base))
  end 
  
  def reset_password
    self.reset_password_token = SecureRandom.hex(18)
    self.reset_password_sent_at = Time.now.utc
  end

 # def confirmed
 #   self.confirmation_token = nil
 #   self.confirmed_at = Time.now.utc
 #   self.confirmed = true
 #   self.save
 # end

  def send_devise_notification(notification, *args)

    devise_mailer.send(notification, self, *args).deliver_later
  end

end
