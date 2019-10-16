class AddDefaultsToSetting < ActiveRecord::Migration[5.2]
  def change
    Setting.default_merchant_price = 4.20
    Setting.default_price = 6
  end
end
