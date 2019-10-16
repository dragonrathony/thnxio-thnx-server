module Types
    class UserType < BaseObject
      field :id, ID, null: false
      field :email, String, null: true
      field :token, String, null: true
      field :first_name, String, null: false
      field :last_name, String, null: true
      field :mobile, String, null: false
      field :thnx_credits, Integer, null: true
      field :total_thnx_received, Integer, null: true
      field :total_thnx_gifted, Integer, null: true
      field :is_admin, Boolean, null: false
      field :last_sign_in_at, GraphQL::Types::ISO8601DateTime, null: true
      field :reset_password_sent_at, GraphQL::Types::ISO8601DateTime, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :last_7_days_giving_activity, [Integer], null: true
      
    
    end
  end