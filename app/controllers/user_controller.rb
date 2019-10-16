

    
 
  class UserController < Rails::ApplicationController
    
    def confirm
        confirm_token = params[:confirm_token]

        user = User.find_by(confirmation_token: confirm_token)

        if user.present?
            user.confirm
            redirect_to "/account_confirmed"
        else
            redirect_to "/error"
        end
    end

    
  end
