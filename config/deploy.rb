# config valid for current version and patch releases of Capistrano
lock "~> 3.11.0"

set :application, "thnx-server"
set :user, 'appuser'
set :deploy_via, :remote_cache

# Source control
set :repo_url, "git@bitbucket.org:thnxio/thnx-server.git"
set :git_shallow_clone, 1

# Rbenv default environment
set :rbenv_ruby, File.read('.ruby-version').strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
set :rbenv_map_bins, %w{rake gem bundle ruby rails sidekiq sidekiqctl puma pumactl}
set :rbenv_roles, :all # default value
set :rbenv_type, :user # or :system, depends on your rbenv setup
set :rbenv_ruby, '2.5.1'

set :sidekiq_config, 'config/sidekiq.yml'
set :sidekiq_monit_conf_dir, '/etc/monit.d' # for CentOS folder
set :sidekiq_monit_use_sudo, true
set :sidekiq_timeout, 40

set :rails_env, fetch(:stage)
set :deploy_to, "/opt/#{fetch(:application)}"

# Some log set up
set :format, :pretty
set :log_level, :debug
set :pty, true

set :npm_flags, '--no-progress' # Set to non production so devDependencies are set up
set :npm_env_variables, {'RAILS_ENV' => "#{fetch :rails_env}", 'NPM_ENV' => 'production'}

# Rollbar Reporting
set :rollbar_token, 'e208442c4e674c7eabaa8739d001a96d'
set :rollbar_env, Proc.new { fetch :stage }
set :rollbar_role, Proc.new { :app }

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/application.yml", "config/master.key"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", ".bundle"

# Default value for keep_releases is 5
set :keep_releases, 5

# which config files should be copied by deploy:setup_config
# see documentation in lib/capistrano/tasks/setup_config.cap
# for details of operations
set(:config_files, %w(
  nginx.aws.conf
  application.tmpl.yml
  database.tmpl.yml
  sidekiq_init.sh
  sidekiq_monit
  puma.rb
))

  # which config files should be made executable after copying
# by deploy:setup_config
set(:executable_config_files, %w(

))

# files which need to be symlinked to other parts of the
# filesystem. For example nginx virtualhosts, log rotation
# init scripts etc.
set(:symlinks, [
  {
    source: "nginx.aws.conf",
    link: "/etc/nginx/sites-enabled/#{fetch(:full_app_name)}"
  },
  {
    source: "sidekiq_monit",
    link: "/etc/monit.d/sidekiq_{{full_app_name}}"
  }
])

# Log rotate options
set :logrotate_role, :app
set :logrotate_conf_path, -> { File.join('/etc', 'logrotate.d', "#{fetch(:application)}_#{fetch(:stage)}") }
set :logrotate_log_path, -> { File.join(shared_path, 'log') }
set :logrotate_logs_keep, -> { 12 }
set :file_permissions_paths, ["/etc/logrotate.d/#{fetch(:application)}_#{fetch(:stage)}"]
set :file_permissions_users, ["root"]

# this:
# http://www.capistranorb.com/documentation/getting-started/flow/
# is worth reading for a quick overview of what tasks are called
# and when for `cap stage deploy`
namespace :deploy do
  # make sure we're deploying what we think we're deploying
  # before :deploy, "deploy:check_revision"
  # only allow a deploy with passing tests to deployed
  # before :deploy, "deploy:run_tests"
  # compile assets locally then rsync
  after 'deploy:updated', 'deploy:compile_webpack_locally'
  after :finishing, 'deploy:cleanup'

  # Before we precompile assets we need to compile webpack
  # before 'deploy:updated', 'deploy:webpack_compile'

  # remove the default nginx configuration as it will tend
  # to conflict with our configs.
  before 'deploy:setup_config', 'nginx:remove_default_vhost'

  # Deploy puma files
  #after 'deploy:setup_config', 'puma:config'
  after 'deploy:setup_config', 'puma:monit:config'

  # reload nginx to it will pick up any modified vhosts from
  # setup_config
  after 'deploy:setup_config', 'nginx:reload'

  # Restart monit so it will pick up any monit configurations
  # we've added
  after 'deploy:setup_config', 'monit:restart'

  # As of Capistrano 3.1, the `deploy:restart` task is not called
  # automatically.
  after 'deploy:publishing', 'deploy:restart'

  # Restart rpush service
  #after 'deploy:restart', 'rpush:restart'

  # Copies logrotate files and sets permissions
  after 'deploy:setup_config', 'logrotate:config'
  after "deploy:setup_config", "deploy:set_permissions:chown"
end
