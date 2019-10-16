class AccountMailer < Devise::Mailer

 

    def reset_password_instructions(record, token, opts={})
        @resource = record
        @token = token
        mail(:to => @resource.email, :subject => "Thnx! Requested Password Reset", :tag => 'password-reset', :content_type => "text/html") do |format|
            format.html { render "devise/mailer/reset_password_instructions" }
        end
    end

    def confirmation_instructions(record, token, opts={})
        @resource = record
        @token = token
            
        mail(:to => @resource.email, :subject => "thnx! Please confirm your account", :tag => 'confirmation-instructions', :content_type => "text/html") do |format|
            format.html { render "devise/mailer/confirmation_instructions" }
        end
    end
 
 end