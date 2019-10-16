class Account < ApplicationRecord
    acts_as_paranoid
    after_initialize :init

    has_paper_trail :class_name => 'PaperTrail::AccountVersion'

    has_one_attached :image

    #EMAIL_REGEX = /\A[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\z/i
    #validates :primary_email, :format => EMAIL_REGEX
    #validates_length_of :primary_email, minimum: 4, maximum: 255

    def init
      self.active  ||= true
    end

    def image_url
      self.image.service_url if self.image.attached?
    end

    def payable
      self.bsb.present? && self.account_no.present?
    end

    def billing_email
      email = self.primary_email 
      unless email.present?
        self.account_users.each { |access|
          if access.has_role?(:account_admin) || access.has_role?(:merchant_admin)
            email = access.user.email 
          end
        }
      end
      email
    end

    has_many :account_users
    has_many :addresses
    
    validates_presence_of :name
    validates :country_code, inclusion: { in: %w(AU NZ USA),
        message: "%{value} is not a valid country" }
end
