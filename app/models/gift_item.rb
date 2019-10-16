class GiftItem < ApplicationRecord
    acts_as_paranoid
    after_create :create_transaction

    has_paper_trail :class_name => 'PaperTrail::GiftVersion'

    belongs_to :gift
    belongs_to :thnx
    #has_one :thnx

    # If the user is attached to a class then allow the activity to be applied to the class activity.
    def create_transaction
        user = User.find(self.gift.sender_user.id)
        user.increment!(:total_thnx_gifted)
        #GiftTransaction.create!(thnx: self.thnx,user: @current_user ) #need to store the user who created it
    end
end
