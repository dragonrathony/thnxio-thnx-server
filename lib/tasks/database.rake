namespace 'database' do

    task :merchants => :environment do
        desc 'Migrating merchants from legacy database'
        merchants_sql = "SELECT * FROM merchants_legacy"
        records_array = ActiveRecord::Base.connection.execute(merchants_sql)
        records_array.each do |legacy_merchant|
            location = Geocoder.search(legacy_merchant["location"]).first
            account = Merchant.find_or_create_by(
                name: legacy_merchant["shop_name"],
                country_code: location.country_code,
                active: true,
                code: legacy_merchant["code"],
                unit_thnx_price: legacy_merchant["coffee_price"]
            )
            address = Address.find_or_create_by(
                account: account,
                address1: "#{location.street_number} #{location.route}",
                city: location.city,
                state: location.state,
                postcode: location.postal_code,
                country_code: location.country_code,
                latitude: location.latitude,
                longitude: location.longitude
            )

            name = legacy_merchant["name"]
            email = legacy_merchant["email"]

            user = User.find_or_initialize_by(
                email: email.downcase,
                first_name: name.nil? ? "TBA" : name&.split.first, #default the name of the user to TBA and we'll come back and check it
                last_name: name&.split.count > 1 ? name.split[1..-1]&.join(' ') : '',
                encrypted_password: legacy_merchant["password"],
                confirmed: true,
                mobile: nil
            )
            user.skip_confirmation!
            user.save(validate: false)
            account_user = AccountUser.find_or_create_by(
                user: user,
                account: account
            )
            account_user.add_role(:merchant_admin)
        end
    end

    task :organisations => :environment do
        desc 'Migrating organisations from legacy database'
        org_sql = "SELECT * FROM organization_legacy"
        org_array = ActiveRecord::Base.connection.execute(org_sql)
        org_array.each do |legacy_org|
            location = Geocoder.search([legacy_org["address"], legacy_org["address_2"], legacy_org["region"], legacy_org["postal_code"], legacy_org["country"]].join(" ")).first
            org = Organisation.find_or_create_by(
                name: legacy_org["name"],
                country_code: location.country_code,
                active: true
            )
            address = Address.find_or_create_by(
                account: org,
                address1: "#{location.street_number} #{location.route}",
                city: location.city,
                state: location.state,
                postcode: location.postal_code,
                country_code: location.country_code,
                latitude: location.latitude,
                longitude: location.longitude
            )
            org_user_sql = "SELECT * FROM users_legacy WHERE org_id=#{legacy_org["id"]}"
            org_users = ActiveRecord::Base.connection.execute(org_user_sql)
            org_users.each do |org_user_legacy|

                name = org_user_legacy["name"]
                email = org_user_legacy["email"]

                user = User.find_or_create_by(
                    email: email.downcase,
                    first_name: name.nil? || name.empty?  ? "TBA" : name&.split.first, #default the name of the user to TBA and we'll come back and check it
                    last_name: name&.split.count > 1 ? name.split[1..-1]&.join(' ') : '',
                    encrypted_password: org_user_legacy["password"],
                    confirmed: true,
                    mobile: org_user_legacy["phone"]
                )
                user.skip_confirmation!
                user.save(validate: false)
                account_user = AccountUser.find_or_create_by(
                    user: user,
                    account: org
                )
                account_user.add_role(:thnx_admin) if org_user_legacy["role_type"] == 'Manager'
                account_user.add_role(:account_admin) if org_user_legacy["role_type"] == 'Admin'
                thnx_credits = org_user_legacy["credits"]
                if thnx_credits > 0
                    puts "Creating #{thnx_credits} thnx for #{user.email}"
                    for credit in 1..thnx_credits
                        org_user_legacy["role_type"] == 'Admin' ? Thnx.create!(owner_user_id: user.id, account_id: org.id) : Thnx.create!(owner_user_id: user.id, account_id: org.id)
                    end
                end
            end
        end
    end

    task :users => :environment do
        desc 'Migrating users from legacy database'
        # We want to pick up all users here that are not assigned to an organisation
        users_sql = "SELECT * FROM users_legacy WHERE org_id = 0"
        records_array = ActiveRecord::Base.connection.execute(users_sql)
        records_array.each do |legacy_user|
            next if User.exists?(email: legacy_user["email"].downcase)

            name = legacy_user["name"]
            email = legacy_user["email"]

            user = User.find_or_initialize_by(
                email: email.downcase,
                encrypted_password: legacy_user["password"],
                first_name: name.nil? || name.empty? ? "TBA" : name&.split.first, #default the name of the user to TBA and we'll come back and check it
                last_name: name&.split.count > 1 ? name.split[1..-1]&.join(' ') : '',
                confirmed: true,
                mobile: legacy_user["phone"]
            )
            user.skip_confirmation!
            user.save(validate: false)
            thnx_credits = legacy_user["credits"]
            if thnx_credits > 0
                puts "Creating #{thnx_credits} thnx for #{user.email}"
                for credit in 1..thnx_credits
                    Thnx.create!(owner_user_id: user.id)
                end
            end
        end
    end

    task :gifts => :environment do
        desc 'Migrating gifts from legacy database'

        timeZone = ActiveSupport::TimeZone["Australia/Brisbane"]

        #Gift.skip_callback(:create, :after, :deliver_gift)
        #Gift.skip_callback(:save, :after, :update_stats)
        gifts_sql = "SELECT * FROM gifts_legacy"
        gifts_array = ActiveRecord::Base.connection.execute(gifts_sql)
        gifts_array.each do |legacy_gift|
            legacy_sender = legacy_gift["sender_id"] ? ActiveRecord::Base.connection.execute("SELECT * FROM users_legacy WHERE id=#{legacy_gift["sender_id"]}").first : nil
            legacy_recipient = legacy_gift["recipient_id"] ? ActiveRecord::Base.connection.execute("SELECT * FROM users_legacy WHERE id=#{legacy_gift["recipient_id"]}").first : nil

            legacy_sender_email = legacy_sender["email"] unless legacy_sender.nil?
            legacy_recipient_email = legacy_recipient["email"] unless legacy_recipient.nil?
            legacy_sender_email&.downcase!
            legacy_recipient_email&.downcase!

            # try and determine where it was redeemed
            redemption_sql = "SELECT accounts.id FROM redemptions_legacy
            inner join merchants_legacy on redemptions_legacy.merchant_id = merchants_legacy.id
            inner join accounts on accounts.name = merchants_legacy.shop_name
            WHERE gift_id = #{legacy_gift["id"]}"
            redemption_array = ActiveRecord::Base.connection.execute(redemption_sql)
            merchant_id = redemption_array.first["id"] if redemption_array.first.present?


            puts "Can't find legacy sender for legacy sender id #{legacy_gift.to_json}" if legacy_sender.nil?
            # puts "Can't find legacy recipient for legacy recipient id #{legacy_gift.to_json}" if legacy_recipient.nil?

            gift = Gift.find_or_create_by(
                sender_user_id: legacy_sender && User.exists?(email: legacy_sender_email) ? User.find_by_email(legacy_sender_email).id : nil,
                recipient_user_id: legacy_recipient && User.exists?(email: legacy_recipient_email) ? User.find_by_email(legacy_recipient_email).id : nil,
                recipient_email: legacy_gift['recipient_email']&.downcase,
                recipient_name: legacy_gift['recipient_name'],
                recipient_mobile: legacy_gift['recipient_phone'],
                claim_token: legacy_gift['code'] && Gift.exists?(claim_token: legacy_gift['code']) ? "#{legacy_gift['code']}-DUPLICATE" : legacy_gift['code'], # check if the claim code is a duplicate
                message: legacy_gift['message'],
                opened: legacy_gift['opened'] == 1,
                opened_at: legacy_gift['opened_time'].present? ? timeZone.parse(legacy_gift['opened_time']) : nil,
                claimed: legacy_gift['opened'] == 1,
                claimed_at: legacy_gift['opened_time'].present? ? timeZone.parse(legacy_gift['opened_time']) : nil,
                redeemed: legacy_gift['claimed'] == 1,
                redeemed_at: legacy_gift['claimed_time'].present? ? timeZone.parse(legacy_gift['claimed_time']) : nil,
                merchant_account_id: merchant_id,
                sent_at: legacy_gift['sent_time'],
                sender_deleted_at: legacy_gift['deleted_by_sender'] == 1 ? Time.now.utc : nil,
                recipient_deleted_at: legacy_gift['deleted_by_recipient'] == 1 ? Time.now.utc : nil,
                product_id: legacy_gift['gift_type'] == 'BIG' ? 1 : 2,   # this is the ids on product where a BIG thnx is id 1
                expires_at: Time.current
            )

            unless gift.valid?
                puts "ERROR creating gift #{legacy_gift['id']} for #{legacy_sender_email}"
                puts gift.errors.full_messages
            end

            # Assign the thnx for the user to the gift
            thnx_credits = legacy_gift['gift_type'] == 'BIG' ? 2 : 1 # this is actual credits no the product id
            for credit in 1..thnx_credits
                # find the recipient or the sender.
                user = User.exists?(email: legacy_recipient_email) ? User.find_by_email(legacy_recipient_email) : User.find_by_email(legacy_sender_email)
                thnx = Thnx.create!(owner_user_id: user.id, gifted: true, redeemed: legacy_gift['claimed'] == 1,
                    redeemed_at: legacy_gift['claimed_time'].present? ? timeZone.parse(legacy_gift['claimed_time']) : nil,
                    merchant_account_id: merchant_id )
                gift_item = GiftItem.create!(thnx_id: thnx.id, gift_id: gift.id)
            end


        end
        # Gift.set_callback(:create, :after, :deliver_gift)
        # Gift.set_callback(:save, :after, :update_stats)
    end

    task :update_stats => :environment do
        desc 'Update user stats'

        User.all.each do |user|
            user.update_attributes!(total_thnx_gifted: Gift.where(sender_user_id: user.id).count, total_thnx_received: Gift.where(recipient_user_id: user.id).count)
        end
    end




    task :all => [:merchants, :organisations, :users, :gifts, :update_stats]
end