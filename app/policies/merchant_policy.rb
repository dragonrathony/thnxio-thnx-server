class MerchantPolicy < ApplicationPolicy
  def create?
    true
  end
 
  #Only return the one account that the user has access to.
  def show?
    account_access = @access.has_role? :merchant_admin if @access.present?
    (super || account_access)
  end

   #Only return the one account that the user has access to.
  def update?
    account_access = @access.has_role? :merchant_admin if @access.present?
    (super || account_access)
  end
   
  private
    def merchant
      record
    end
  end