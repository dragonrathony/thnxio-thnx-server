class DirectUploadsController < ActiveStorage::DirectUploadsController
    # I'm using JWTSession for auth and have to include it
    # as this doesn't inherit due to `ActiveStorage::BaseController < ActionController::Base`
    # where we are using `ApplicationController < ActionController::API` in API Mode.
 
 
   skip_before_action :verify_authenticity_token
   
   # Calling JWTSession to authorize
   #before_action :authorize_access_request!
 
   def create
    super
   end
 
   private
 
   def blob_params
     params.require(:blob).permit(
     :filename,
     :content-type
     )
   end
 
   # Rescue the Auth Error
   def not_authorized
     render json: { error: 'Not authorized' }, status: :unauthorized
   end
 end