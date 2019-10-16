module Types
    class AddressType < BaseObject
      field :id, ID, null: false
      field :account_id, Integer, null: false
      field :address1, String, null: false
      field :address2, String, null: true
      field :city, String, null: false
      field :state, String, null: false
      field :postcode, String, null: false
      field :country_code, String, null: false
      field :latitude, Float, null: true #check this datatype
      field :longitude, Float, null: true
      field :account, Types::AccountType, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true

      def self.authorized?(object, context)
        if object.account.instance_of? Merchant
          return true
        else
          super
        end
      end
    end
  end