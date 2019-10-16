module Types
    class AccountType < BaseObject
      field :id, ID, null: false
      field :name, String, null: false
      field :country_code, String, null: false
      field :code, String, null: true
      field :active, Boolean, null: false
      field :unit_thnx_price, String, null: true
      field :addresses, [Types::AddressType], null: false
      field :account_users, [Types::AccountUserType], null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :image, Types::FileType, null: true
      field :image_url, String, null: true
      field :last_7_days_activity, [Integer], null: true
      field :abn, String, null: true
      field :bsb, String, null: true
      field :account_no, String, null: true
      field :primary_email, String, null: true
      field :payable, Boolean, null: false
      


      def self.authorized?(object, context)
        if object.instance_of? Merchant
          return true
        else
          super
        end
      end
    end
  end