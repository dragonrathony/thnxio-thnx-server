# Based off a staging environment
require Rails.root.join('config/environments/staging')

ThnxApi::Application.configure do

  config.action_mailer.default_url_options = { :host => ENV['BASE_HOST'], :protocol => 'https' }

end
