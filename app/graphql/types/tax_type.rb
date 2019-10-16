module Types
    class TaxType < BaseObject
      field :id, ID, null: false
      field :country_code, String, null: false
      field :tax_perc, Float, null: false
    end
  end