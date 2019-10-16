class Thnx < ApplicationRecord
    acts_as_paranoid
    before_save :thnx_updated
    has_paper_trail :class_name => 'PaperTrail::ThnxVersion'
    after_initialize :init

    def init
      self.redeemed  ||= false
      self.gifted  ||= false
    end

    belongs_to :owner_user, :class_name => "User", :optional => true
    belongs_to :merchant_account, :class_name => "Account", :optional => true
    belongs_to :account, :optional => true

    validates :owner_user_id, presence: { message: "Must have a user or an account" }, unless: :account_id
    validates :account_id, presence: { message: "Must have a user or an account" }, unless: :owner_user_id

    # If the user is attached to a class then allow the activity to be applied to the class activity.
  

    private


    def thnx_updated
        create_transaction
        if redeemed
            self.status = 'REDEEMED'
        elsif gifted
            self.status = 'GIFTED'
        elsif owner_user_id.nil?
            self.status = 'UNASSIGNED'
        else
            self.status = 'ACTIVE'
        end
    end
    def thnx_before_updated

        if owner_user_id_changed?
            user = User.find(self.owner_user_id)
            user.increment!(:total_thnx_received)
        end

    end
    
    def create_transaction
        #ThnxTransaction.create!(thnx: self, user: @current_user) #need to store the user who created it
    end

end
