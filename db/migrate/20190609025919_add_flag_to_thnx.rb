class AddFlagToThnx < ActiveRecord::Migration[5.2]
  def change
    add_column :thnxes, :gifted, :boolean
  end
end
