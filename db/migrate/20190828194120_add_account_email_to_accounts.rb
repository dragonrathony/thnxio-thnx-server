class AddAccountEmailToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :primary_email, :string
  end
end
