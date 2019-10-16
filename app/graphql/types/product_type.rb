module Types
    class ProductType < BaseObject
      field :id, ID, null: false
      field :name, String, null: false
      field :sku, String, null: false
      field :qty, Float, null: false
      field :price, Float, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end