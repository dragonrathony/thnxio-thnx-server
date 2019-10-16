require 'faker'

namespace :thnx do
    desc "Change all user emails to something fake and also reset the passwords"
    task :obfuscate_users => :environment  do 
        raise "Not to be run in production!" if Rails.env.production?
        
        User.all.each { |user| 
            domain = user.email.split("@")[1]
            if domain != "thnx.io" && domain != "socialpinpoint.com"
                email = Faker::Internet.unique.username.downcase + "@thnx.io"
                puts "Converting #{user.email} to #{email} password thnx!1234"
                user.update_attributes(
                    first_name: Faker::Name.first_name.to_s,
                    last_name: Faker::Name.last_name.to_s,
                    email: email, password: "thnx!1234", password_confirmation: "thnx!1234")
                user.save
                
            end
        }
    end

    desc "Change all gift messages"
    task :obfuscate_comments => :environment  do 
        raise "Not to be run in production!" if Rails.env.production?
        
        Gift.all.each { |gift| 
            
                gift.update_attributes(
                    message: Faker::Lorem.sentence)
                gift.save
                
        }
    end

    desc 'Obfuscate everything'
    task :obfuscate_all => [:obfuscate_users, :obfuscate_comments]
end