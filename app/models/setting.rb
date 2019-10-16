# RailsSettings Model
class Setting < RailsSettings::Base
  cache_prefix { "v1" }
  field :default_price, type: :float, default: 6.0
  field :default_merchant_price, type: :float, default: 4.2

end
