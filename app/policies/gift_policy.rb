class GiftPolicy < ApplicationPolicy
    def index?
      super || gift.sender_user == @user || gift.recipient_user == @user
    end
   
    # Allow all to create a merchant - open signup
    def create?
      true
    end
 
    #Only return the one account that the user has access to.
    def show?
      super || gift.sender_user == @user || gift.recipient_user == @user
    end
   
    private
      def gift
          record
      end
  end