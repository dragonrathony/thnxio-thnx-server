class RemoveColumnsFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :gifts, :email
    remove_column :gifts, :mobile
    remove_column :gifts, :name
  end
end
