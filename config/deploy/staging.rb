set :stage, :staging
set :rails_env, :staging

#set :branch, 'deploy/staging'
set :branch, 'feature/THUB-98-MS-Teams-Integration'

# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary
# server in each group is considered to be the first
# unless any hosts have the primary property set.
role :app, %w{52.175.251.97}

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server
# definition into the server list. The second argument
# something that quacks like a hash can be used to set
# extended properties on the server.
server '52.175.251.97', user: 'appuser', roles: %w{web app db}
set :domain, 'staging2.thnx.io'
set :server_name, fetch(:domain)
set :full_app_name, "#{fetch(:application)}_#{fetch(:stage)}"

set :bundle_flags, '--deployment'

set :deploy_to, "/opt/#{fetch(:application)}/staging"

# Web Server Settings
set :puma_worker_count, 4
set :puma_max_threads, 8
set :puma_conf, "#{fetch(:deploy_to)}/shared/config/puma.rb"
set :puma_monit_conf_dir, '/etc/monit.d/puma_monit.conf' #Set a file name so it doesn't save it as monit.conf
