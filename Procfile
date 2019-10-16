web: env PORT=3000 REACT_APP_RAILS_ENV=development npm start
sidekiq: bundle exec rerun --background --dir app,db,lib --pattern '{**/*.rb}' -- bundle exec sidekiq --verbose
api: bundle exec rails s -p 3001
