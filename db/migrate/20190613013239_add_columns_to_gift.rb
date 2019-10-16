class AddColumnsToGift < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :recipient_name, :string
    add_column :gifts, :recipient_email, :string
    add_column :gifts, :recipient_mobile, :string
    add_column :gifts, :claim_token, :string
  end
end
