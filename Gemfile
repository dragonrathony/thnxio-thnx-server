source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.2'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 3.11'
gem 'figaro'
gem 'aba'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
gem 'devise'                                # Use devise as authentication module
gem 'devise-jwt', '~> 0.5.8'                # Use JWT token authentication with devise
gem 'argon2', '>= 2'                        # Use argon2 encryption algorithm
gem 'bcrypt', '~> 3.1.7'                    # Use ActiveModel has_secure_password
gem 'paranoia'
gem 'acts_as_tenant'
gem 'pundit'
gem "rolify"
gem 'graphql'
gem "rails-settings-cached"
gem 'paper_trail'

gem 'stripe'
gem 'fcm'

#gem 'ruby-transmitsms'
gem 'twilio-ruby'

gem 'geocoder'

gem 'ruby-transmitsms'
gem 'hashids'
# Gems for phone number manipulation
gem 'countries'
gem 'phony'
gem 'obscenity'

gem 'rollbar'

# Job scheduling
gem 'sidekiq'
gem "sidekiq-cron"
gem 'sidekiq-status'
gem 'redis-namespace'
# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors'

# active storage
gem "azure-storage", require: false
gem 'apollo_upload_server', '2.0.0.beta.3'

gem 'faker', '~> 1.8', '>= 1.8.7'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'foreman'
  gem 'rerun'
  gem 'ruby-debug-ide'
  gem 'debase'
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'pry-rails', '~> 0.3.6'
  gem "graphiql-rails"
  gem "capistrano", "~> 3.11", require: false
  gem "capistrano-rails", "~> 1.4", require: false
  gem 'capistrano-bundler', '~> 1.3'
  gem 'capistrano-rbenv', '~> 2.1'
  gem 'capistrano-npm'
  gem 'capistrano-sidekiq'
  gem 'capistrano3-puma', github: 'seuros/capistrano-puma'
  gem 'capistrano-logrotate', :git => 'https://github.com/socialpinpoint/capistrano-logrotate.git', :ref => '89f2028d94aed31510fb63b0d2e031da1e374f21'
  gem 'capistrano-file-permissions' #Added as logrotate doesn't set permissions correctly
  #gem 'capistrano-rpush'
end

group :test do
  gem 'database_cleaner', '~> 1.6', '>= 1.6.2'
  gem 'factory_bot_rails', '~> 4.8', '>= 4.8.2'
  gem 'rspec-rails', '~> 3.7', '>= 3.7.2'
  gem 'shoulda-matchers', '~> 3.1', '>= 3.1.2'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
