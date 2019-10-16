class UserPolicy < ApplicationPolicy
    
    def show?
      return true if (@user.present? && @user == user) || super
    end
    
    def create?
        true
    end
   
    def update?
      return true if @user.present? && @user == user
    end
   
    private
   
        def user
            record
        end
  end