class OrganisationThnxPolicy < ApplicationPolicy
    def index?
      account_access = @access.has_role? :account_admin if @access.present?
      (super || account_access)
    end
    
    #Only return the one account that the user has access to.
    def show?
      account_access = @access.has_role? :account_admin if @access.present?
      (super || account_access)
    end
   
    private
   
        def thnx
            record
        end
  end