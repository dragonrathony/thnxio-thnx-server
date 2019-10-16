class AccountPolicy < ApplicationPolicy
    
    # Allow all to create a merchant - open signup
    def create?
        true
    end
   
    #Only return the one account that the user has access to.
    def show?
      account_access = (@access&.has_role? :account_admin) || (@access&.has_role? :merchant_admin)
      (super || account_access) && @access.account_id == account.id
    end

    #Only allow update to what the user has access to and for the current tenanted account (probably not required to check)
    def update?
      account_access = (@access&.has_role? :account_admin) || (@access&.has_role? :merchant_admin)
      (super || account_access) && @access.account_id == account.id
    end
   
    private
   
        def account
            record
        end
  end