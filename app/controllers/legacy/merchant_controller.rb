
  module Legacy
    
  class Legacy::MerchantController < ApplicationController
    
    #@POST("/merchant/get_current")
    def show
      # for the current user
      # find the merchant it is related to (role of :merchant_admin)
      
      merchant = LegacyMerchant.build(@current_user) 
       
      render json: merchant
    end

    #@POST("/merchant/update")
    def update_merchant
      #id = params[:id]
      
      email = params[:email]
      location = params[:location]
      name = params[:name]
      current_password = params[:current_password]
      password = params[:password]
      password_confirm = params[:password_confirm]

      user = @current_user #User.find(id)
      render json: {error: "Merchant has not been updated"} unless user.present?
      
      if current_password.present? and password.present?
        is_valid_for_auth = user.valid_for_authentication?{
          user.valid_password?(current_password)
        }
        if is_valid_for_auth
          user.update_attributes(password: password)
        end 
      end

      user.update_attributes(first_name: name )

      if user.save! 
        render json: {success: "merchant updated"}
      else
        render json: {error: "merchant has not been updated"}
      end
    end 

    #@GET("/merchant/get_redemptions/{merchant_id}")
    def get_redemptions
      #merchant_account_id = params[:merchant_id]

      access = AccountUser.where(user_id: @current_user.id).pluck(:account_id)
      merchant = Merchant.where(id: access).first

      d = Date.today
      start_date = d.at_beginning_of_week
      end_date = d.at_end_of_week.at_end_of_day

      product = Product.find_by_sku("SMALLTHNX_COFFEE")
      littleCount = Gift.where(product_id: product.id, redeemed: true, merchant_account_id: merchant.id, :redeemed_at => start_date..end_date).count
      product = Product.find_by_sku("BIGTHNX_COFFEE")
      bigCount = Gift.where(product_id: product.id, redeemed: true, merchant_account_id: merchant.id, :redeemed_at => start_date..end_date).count
      total = littleCount + bigCount

      this_week = {LITTLE: littleCount, BIG: bigCount, Total: total, from: start_date.strftime("%d/%m/%Y"), to: end_date.strftime("%d/%m/%Y")}
      
      d = Date.today
      start_date = 30.days.ago
      end_date = d.at_end_of_week.at_end_of_day

      product = Product.find_by_sku("SMALLTHNX_COFFEE")
      littleCount = Gift.where(product_id: product.id, redeemed: true, merchant_account_id: merchant.id, :redeemed_at => start_date..end_date).count
      product = Product.find_by_sku("BIGTHNX_COFFEE")
      bigCount = Gift.where(product_id: product.id, redeemed: true, merchant_account_id: merchant.id, :redeemed_at => start_date..end_date).count
      total = littleCount + bigCount

      past_30_days = {LITTLE: littleCount, BIG: bigCount, Total: total, from: start_date.strftime("%d/%m/%Y"), to: end_date.strftime("%d/%m/%Y")}
      
      render json: {this_week: this_week, past_30_days: past_30_days}
    end

    #@POST("/merchant/code_checker")
    def validate_code
      code = params[:code]

      access = AccountUser.where(user_id: @current_user.id).pluck(:account_id)
      myMerchant = Merchant.where(id: access).first

      # will need to check for https://recieve.thnx.io/here/token and just the token...
      code.sub! /https:\/\/recieve.thnx.io\/here\//,'' if code.present?

      merchant = Merchant.find_by(code: code) if code.present?
      if merchant.present?
        if merchant.id == @current_account.id
          address = merchant.addresses&.first if merchant.present?
          render json: {status: "success", data: {shop_name: merchant&.name, address: address&.full_address, email: @current_user.email}}
        else
          render json: {status: "failure", message: "Code does not belong to your account and is already taken"}
        end
      else
        render json: {status: "failure", message: "Code has not been assigned to your account"}
      end

    end

  end
end