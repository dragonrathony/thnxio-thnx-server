# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Load the SCM plugin appropriate to your project:
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

require "capistrano/rbenv"
require "capistrano/bundler"
#require "capistrano/rails/assets"
require "capistrano/rails/migrations"
require 'capistrano/npm'
require 'capistrano/puma'
require 'capistrano/logrotate'
require 'capistrano/file-permissions'
require 'rollbar/capistrano3'
require 'capistrano/sidekiq'
require 'capistrano/sidekiq/monit' # to require monit tasks
#require 'capistrano/rpush'

install_plugin Capistrano::Puma  # Default puma tasks
install_plugin Capistrano::Puma::Monit  # if you need the monit tasks
#install_plugin Capistrano::Rpush


# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
Dir.glob('lib/capistrano/tasks/*.cap').each { |r| import r }
Dir.glob('lib/capistrano/**/*.rb').each { |r| import r }
