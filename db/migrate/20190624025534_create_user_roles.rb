class CreateUserRoles < ActiveRecord::Migration[5.2]
  def change
    create_table(:users_roles, :id => false) do |t|
      t.references :user
      t.references :role
    end
    add_index(:users_roles, [ :user_id, :role_id ])
  end
end
