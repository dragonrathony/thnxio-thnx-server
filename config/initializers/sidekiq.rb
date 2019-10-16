Sidekiq::Extensions.enable_delay!
#Sidekiq.hook_rails! Not sure if we need this still?

server = ENV['SIDEKIQ_SERVER'] || 'localhost'
port = ENV['SIDEKIQ_PORT'] || 6379
db_num = ENV['SIDEKIQ_DB'] || 5
username_password = ENV['SIDEKIQ_USERNAME_PASSWORD'] || ''

schedule_file = "config/schedule.yml"

Sidekiq.configure_server do |config|
  config.server_middleware do |chain|
    # accepts :expiration (optional)
    chain.add Sidekiq::Status::ServerMiddleware, expiration: 30.minutes # default
  end
  config.client_middleware do |chain|
    # accepts :expiration (optional)
    chain.add Sidekiq::Status::ClientMiddleware, expiration: 30.minutes # default
  end

  config.redis = { url: "redis://#{username_password}#{server}:#{port}/#{db_num}", namespace: "thnx_#{Rails.env}", network_timeout: 5 }

end

Sidekiq.configure_client do |config|
  config.client_middleware do |chain|
    # accepts :expiration (optional)
    chain.add Sidekiq::Status::ClientMiddleware, expiration: 30.minutes # default
  end

  config.redis = { url: "redis://#{username_password}#{server}:#{port}/#{db_num}", namespace: "thnx_#{Rails.env}", network_timeout: 5 }
end

#if File.exists?(schedule_file) && Sidekiq.server?
#  Sidekiq::Cron::Job.load_from_hash! YAML.load_file(schedule_file)
#end
