class PaymentItem < ApplicationRecord
    acts_as_paranoid
    after_create :create_transaction
    has_paper_trail :class_name => 'PaperTrail::PaymentVersion'
    
    belongs_to :payment
    belongs_to :thnx

    # If the user is attached to a class then allow the activity to be applied to the class activity.
    def create_transaction
        #PaymentTransaction.create!(thnx: self.thnx, user: @current_user) #need to store the user who created it
    end
end
