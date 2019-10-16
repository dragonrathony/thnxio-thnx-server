class RemoveCodeFromGift < ActiveRecord::Migration[5.2]
  def change
    remove_column :gifts, :code
  end
end
