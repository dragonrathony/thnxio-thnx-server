class CreatePromotion < ActiveRecord::Migration[5.2]
  def change
    create_table :promotions do |t|
      t.string   :name,         null: false
      t.string   :code,         null: false
      t.datetime :sent_gifts_at
      t.boolean   :accepting_gifts 
      t.timestamps
    end
    create_table :promotion_accounts do |t|
      t.string   :name,     null: false
      t.string   :code,     null: false
      t.string   :address
      t.string   :longitude
      t.string   :latitude
      t.references :promotion
      t.timestamps
    end
    create_table :promotion_gifts do |t|
      t.string   :email_or_phone,     null: false
      t.string   :claim_token,     null: false
      t.datetime   :sent_at
      t.datetime   :redeemed_at
      t.references :promotion_account
      t.references :promotion
      t.timestamps
    end
    add_index :promotions, :code, unique: true
    add_index :promotion_accounts, :code, unique: true
  end
end
