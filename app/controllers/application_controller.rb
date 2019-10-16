class ApplicationController < ActionController::API  
  include Pundit
  #after_action :verify_authorized, except: :index
  #after_action :verify_policy_scoped, only: :index

  set_current_tenant_through_filter
  before_action :set_current_user
  before_action :set_paper_trail_whodunnit

  
  before_action do
    ActiveStorage::Current.host = request.base_url
  end
  
  
  def current_user
    @current_user
  end

  private


  
  def set_current_user
    puts "SET CURRENT USER"
    return nil if request.headers['Authorization'].blank?
    
    token = request.headers['Authorization'].split(' ').last
  
    return nil if token.blank?

    result = JWT.decode(token, Rails.application.credentials.fetch(:secret_key_base))
    
    item = result[0]
    user_id = item['id']
    return nil unless result
    @current_user = User.find(user_id)

    custom_set_tenant
  end

  def custom_set_tenant
    if @current_user.present? 
          @current_user.update_attributes!(current_sign_in_at: Time.now)
          access = AccountUser.find_by_user_id(@current_user.id)
          @current_account = Account.find(access.account_id) if access.present?
          set_current_tenant( @current_account) if @current_account.present?
      end
  end

  # def ssl_configured?
  #   Rails.env.production?
  # end

  # def redirect_to_root_domain
  #   domain_to_redirect_to = ENV['DOMAIN']
  #   domain_exceptions = ['0.0.0.0'] # include 0.0.0.0 oder localhost for locale testing
  #   should_redirect = !(domain_exceptions.include? request.host)
  #   new_url = "#{request.protocol}#{domain_to_redirect_to}#{request.fullpath}"
  #   redirect_to new_url, status: :moved_permanently if should_redirect
  # end
end
