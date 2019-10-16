class AddGiftExpiryDate < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :expires_at, :datetime, :null => false
    add_column :gifts, :encrypted_claim_token, :string
  end
end
