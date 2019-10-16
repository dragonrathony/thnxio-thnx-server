module Types
    class RemittanceBatchType < BaseObject
      field :id, ID, null: false
      field :total, Float, null: true
      field :line_item_count, Integer, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: true
      field :paid_at, GraphQL::Types::ISO8601DateTime, null: true
      field :exported_at, GraphQL::Types::ISO8601DateTime, null: true
    end
  end