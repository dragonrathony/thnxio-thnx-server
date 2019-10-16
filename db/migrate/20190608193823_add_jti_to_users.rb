class AddJtiToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :current_sign_in_at , :datetime
    add_column :users, :last_sign_in_at , :datetime
    
    add_column :users, :failed_attempts, :integer, default: 0, null: false # Only if lock strategy is :failed_attempts
    add_column :users, :unlock_token, :string # Only if unlock strategy is :email or :both
    add_column :users, :locked_at, :datetime

    add_column :users, :jti, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :mobile, :string

    add_index :users, :jti, unique: true
    add_index :users, :unlock_token, unique: true
  end
end
