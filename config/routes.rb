require 'sidekiq/web'

Rails.application.routes.draw do

  Sidekiq::Web.set :session_secret, Rails.application.credentials[:secret_key_base]
  mount Sidekiq::Web => '/sidekiq'

  devise_for :users
  post "/graphql", to: "graphql#execute"

  get '/confirm_account/:confirm_token' => 'user#confirm'
  

  # Legacy endpoints 
  scope :module => 'legacy' do
    # User endpoints 
    post '/user/login', to: 'user#login'
    post '/user/logout', to: 'user#logout'# android is logging out on a post
    get '/user/logout', to: 'user#logout' # ios is logging out on a get
    post '/user/forgot_password', to: 'user#forgot_password'
    post '/user/create', to: 'user#create'
    post '/user/get_current', to: 'user#get_current'
    post '/user/get', to: 'user#get_current' #ios hack because it does not exist for android
    post '/user/resend_email_confirmation', to: 'user#resend_email_confirmation'
    post '/user/update', to: 'user#update_user'
    post '/user/notification_token_registration/:user_id', to: 'user#notification_token_registration'
    post '/user/notification_token_unregister/:user_id', to: 'user#notification_token_unregister'
    post '/user/notification_token_registration', to: 'user#notification_token_registration' # ios is not passing any information
    post '/user/notification_token_unregister', to: 'user#notification_token_unregister' # ios is not passing any information
    post "/payment/m_initiate", to: 'user#add_payment'

    ## Gift endpoints
    post '/gift/send', to: 'gift#send_gift'
    post '/gift/get_user', to: 'gift#get_user'
    post '/gift/redeem', to: 'gift#redeem'
    post '/gift/delete_gift/:gift_id', to: 'gift#destroy'
    post '/gift/opened/:gift_id', to: 'gift#opened'
    get '/gift/link_account/:gift_id', to: 'gift#link'

    # Merchant endpoints
    post "/merchant/get_current", to: 'merchant#show'
    post "/merchant/get/:id", to: 'merchant#show'
    post "/merchant/update", to: 'merchant#update_merchant'
    get "/merchant/get_redemptions/:merchant_id", to: 'merchant#get_redemptions'
    get "/merchant/get_redemptions/", to: 'merchant#get_redemptions' # for ios
    post "/merchant/code_checker/", to: 'merchant#validate_code' 
    get "/merchant/logout", to: 'user#logout'
  end

  scope :api, defaults: { format: :json } do
    post "/promotion/:code", to: 'promotion#initialise' 
    get "/promotion/:code", to: 'promotion#show' 
    put "/promotion/:promo_code", to: 'promotion#validate' 

    get "/merchants", to: 'merchant#index'
    get "/export/:batch_id", to: 'merchant#export_aba'

    if Rails.env.development? or Rails.env.staging?
      patch "/promotion/:code", to: 'promotion#temp_reset' 
    end
  end
  
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end


  #get '*other', to: 'static#index', constraints: lambda { |req|
  #  req.path.exclude? 'rails/active_storage' and req.path.exclude? '/sidekiq' and req.path.exclude? '/assets'
  #}
  get '*other', to: 'static#index', constraints: lambda { |req|
    client_route_whitelist = [
      "/team",
      "/leaderboard",
      "/payments",
      "/createaccount",
      "/account",
      "/reset_password",
      "/account_confirmed",
      "/map",
      "/forgotme",
      "/merchants",
      "/merchant",
      "/merchant/login",
      "/merchant/account",
      "/merchant/transactions",
      "/merchant/create",
      "/promotion/",
      "/error",
      "/download-apps",
      "/admin/merchants",
      "/admin/merchant",
      "/ms-teams",
      "/ms-teams/sign-in",
      "/ms-teams/sign-up",
      "/ms-teams/app",
      "/ms-teams/error",
      "/admin/merchant",
      "/admin/remittance"]
      
     client_route_whitelist.any? { |val| req.path.start_with?(val)}
  }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

