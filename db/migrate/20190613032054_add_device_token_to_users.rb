class AddDeviceTokenToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :notification_device_id, :string
    add_column :users, :notification_token, :string
    
    remove_column :users, :session_token

  end
end
