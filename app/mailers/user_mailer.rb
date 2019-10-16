class UserMailer < ApplicationMailer

   
    
    def new_account_instructions
        if params[:user_id].present?
            @resource = User.find(params[:user_id])
            @account = Account.joins(:account_users).where("account_users.user_id = ?", params[:user_id]).first
            if @account.present? and @resource.present?
                mail(to: @resource.email, subject: "Welcome to thnx!", resource: @resource)
            else
                throw "No user or account info found for user id #{params[:user_id]}. Welcome email not sent."
            end
        end
    end
 
 end