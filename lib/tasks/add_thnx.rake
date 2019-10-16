namespace :thnx do
    desc "Add thnx to a user - requires user_id, account_id and total_thnx"
    task :create_thnx => :environment  do 
        user_id = ENV['user_id'] or raise "No user specified"
        total_thnx = ENV['total_thnx'] or raise "No. of thnx not specified"
        account_id = ENV['account_id'] or raise "No account specified"

        user = User.find(user_id)
        account = Account.find(account_id)

        raise "Account not valid" unless account.present?
        raise "User not valid" unless user.present?

        puts "Generating #{total_thnx.to_i} thnx! for #{user.first_name} #{user.last_name} in account #{account.name} "

        for i in 1..total_thnx.to_i
            thnx = Thnx.create!(owner_user: user, account: account) if account.present?
            puts "Generated thnx #{thnx.id}"
        end
    end


  end