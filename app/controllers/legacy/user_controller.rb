
  require 'stripe'


  module Legacy
  class Legacy::UserController < ApplicationController
    # @POST("/user/login")
    # body {email: string, password: string}
    def login
      error = "Please check you have no typos, we can’t find this login/pwd combo."
      email = params[:email]
      password = params[:password]

      if params[:email].nil?
        render json: {error: "Login with your email", failure: "Login with your email"} 
      else
        email.downcase!

        user = User.find_for_authentication(email: email)
        if user.nil?
          render json: {error: error, failure: "We don’t have an account for this email address. Please check you have no typos"} 
        else
          is_valid_for_auth = user.valid_for_authentication?{
            user.valid_password?(password)
          }
          if is_valid_for_auth
            access = AccountUser.find_by_user_id(user.id)
            role = "user"
            role = "merchant" if access.present? and access.has_role? :merchant_admin

            user.last_sign_in_at = user.current_sign_in_at
            user.current_sign_in_at = Time.now.utc
            user.failed_attempts = 0
            user.locked_at = nil
            user.unlock_token = nil
            user.save
            render json: { email: user.email, success: user.id, role: role, status: "true", loginResponse: "true", token: user.token}
          else
            render json: {error: error, failure: error} 
          end
        end
      end

    end
    def add_payment
      credits = params[:credits]
      token = params[:payment_method]
      amount = params[:amount]
      gateway = params[:gateway]

      if token.present?
        amount = (amount*100).to_i

        charge = Stripe::Charge.create({
          amount: amount,
          currency: "aud",
          source: token,
          description: "#{credits} Thnx purchase"
        })


        payment = Payment.new(user: @current_user, amount: amount, tax: 0, total: amount, qty: credits, gateway: "STRIPE", receipt: charge.id, status: charge.status, failure_code: charge.failure_code, failure_message: charge.failure_message)
            
        if payment.valid?
          payment.save!

          if charge.failure_code.present?
            render json: {error: charge.failure_message}
            return
          else
            # create and assign the thnx to the organisation
            for i in 1..credits
              thnx = Thnx.create!(owner_user: @current_user)
              PaymentItem.create!(payment: payment, thnx:thnx, price: amount)
            end
            render json: {transaction_id: payment.id, success: "Payment successful"}
            return
          end
        else
          Rails.logger.error "ERROR::PAYMENT Payment item was not saved. #{payment.errors.full_messages.first}. User Id: #{current_user&.id} token: #{token} amount: #{amount} credits: #{credits}"
          render json: {error: "Payment was not saved. Please contact us."}
          return
        end
      else
        Rails.logger.error "ERROR::PAYMENT Payment item was not saved. User Id: #{current_user&.id} token: #{token} amount: #{amount} credits: #{credits}"
          
        render json: {error: "Payment token not provided"}
        return
      end
    end

    # @POST("/user/logout")
    def logout
      render json: {success: "Successfully logged out"}
    end

    # @POST("/user/forgot_password")
    # body {email}
    def forgot_password
      email = params[:email]
      user = User.where(email: email).first
      if user.present? 
        user.send_reset_password_instructions
        render json: {success: "Password reset successfully"}
      else
        render json: {error: "Error resetting password"}
      end
    end
    
    # @POST("/user/create")
    # body {email: string, password: string, name: string }
    def create
      email = params[:email]
      password = params[:password]
      name = params[:name]

      user = User.new(
        email: email, 
        password: password, 
        password_confirmation: password, 
        first_name: name
      )

      if user.valid?
        user.save!
        render json: {success: user.id, role: "user", status: "true", loginResponse: "true", token: user.token}
      else
        error_msg = user.errors.full_messages.first
        error_msg = "Error creating user record" unless error_msg.present?
        Rails.logger.error "ERROR::CREATE_USER Cannot create user #{email}. #{error_msg}"
        render json: {error: error_msg, failure: error_msg}
      end
      
    end

    # @POST("/user/get_current")
    def get_current
      user = @current_user
      render json: {error: "User not found", failure: "User not found"} if user.nil?
      render json: {id: user.id,
        name: user.first_name,
        email: user.email,
        phone: user.mobile,
        credits: user.thnx.count,
        received_count: 0,  #ios requires this for some logic
        photo: nil,  
        admin: false,
        created_time: user.created_at,  
        edited_time: user.updated_at,   
        search_index:nil,   
        promo_subscription: nil,   #TODO: Need to see what this is used for
        email_confirmed: "1", # ios requires this as a 1 or a 0 
        need_password_reset: false,
        code:nil} if user.present?
    end

    # @POST("/user/resend_email_confirmation")
    # body {id: string }
    def resend_email_confirmation
      email = params[:email]
      user = User.where(email: email).first
      if user.present? 
        user.send_reset_password_instructions
        render json: {success: "Email confirmation sent successfully"}
      else
        Rails.logger.error "ERROR::USER_PASSWORD Cannot find user #{email}."
        render json: {error: "Error resending email confirmation"}
      end
    end

    # @POST("/user/update")
    def update_user
      #id = params[:id]
      email = params[:email]
      phone = params[:phone]
      name = params[:name]
      
      coffee_type = params[:coffee_type]
      coffee_strength = params[:coffee_strength]
      coffee_milk = params[:coffee_milk]

      current_password = params[:current_password]
      password = params[:password]
      password_confirm = params[:password_confirm]

      user = @current_user
      if user.nil?
        render json: {error: "User details not found"} 
        return
      end

      if current_password.present? and password.present?
        is_valid_for_auth = user.valid_for_authentication?{
          user.valid_password?(current_password)
        }
        if is_valid_for_auth
          user.update_attributes(password: password)

        else
          render json: {error: "Current password is not valid"}
          return 
        end 
      end

      user.update_attributes(first_name: name )

      user.validate
      if user.valid?
        user.save 
        render json: {success: "Profile updated successfully"}
      else
        Rails.logger.error "ERROR::USER_UPDATE Cannot update user #{email}. #{user.errors.full_messages.first}"
        render json: {error: "User has not been updated. #{user.errors.full_messages.first}", failure: user.errors.full_messages.first}
      end
    end
    
    #@POST("/user/notification_token_unregister/{user_id}")
    def notification_token_unregister
      user = @current_user
      user.update_attributes!(notification_device_id: nil) if user.present?

      if user.present? and user.save! 
        render json: {success: "notification token deleted"}
      else
        render json: {error: "error deleting notification token"}
      end
    end

    #@POST("/user/notification_token_registration/{user_id}")
    def notification_token_registration
      user = @current_user
      user.update_attributes(notification_token: params[:notification_token], notification_device_id: params[:notification_device_id])

      if user.present? and user.save! 
        render json: {success: "notification token updated"}
      else
        render json: {error: "error updating notification token"}
      end

    end

    private

    # Only allow a trusted parameter "white list" through.
    def login_params
      params..permit(:email, :password)
    end
  end
end