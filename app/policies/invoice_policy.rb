class InvoicePolicy < ApplicationPolicy
    def index?
      account_access = @access.has_role? :merchant_admin if @access.present?
      (super || account_access)
    end
   
    def create?
      account_access = @access.has_role? :merchant_admin if @access.present?
      (super || account_access)
    end
   
   #Only return the one account that the user has access to.
   def show?
    account_access = @access.has_role? :merchant_admin if @access.present?
    (super || account_access)
    end
   
    private
   
        def invoice
            record
        end
  end