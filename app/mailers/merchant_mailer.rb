class MerchantMailer < ApplicationMailer

   
    def send_redemption_report(resource)
        @resource = resource
        if @resource.present?
            mail(to: @resource[:email], subject: "thnx! Weekly Summary", resource: @resource)
        else
            throw "Email did not send"    
        end
    end
    def send_payment_report(resource)
        @resource = resource

        if @resource.present?
            mail(to: @resource[:email], subject: "thnx! Payment #{@resource[:payment][:id]}", resource: @resource)
        else
            throw "Email did not send"    
        end
    end
 end
