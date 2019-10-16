class AddSendErrorToGift < ActiveRecord::Migration[5.2]
  def change
    add_column :gifts, :send_error, :boolean
    add_column :gifts, :send_error_message, :string
  end
end
