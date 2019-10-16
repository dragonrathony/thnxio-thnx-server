class AddAbnBankDetailsToAccount < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :abn, :string
    add_column :accounts, :bsb, :string
    add_column :accounts, :account_no, :string
  end
end
