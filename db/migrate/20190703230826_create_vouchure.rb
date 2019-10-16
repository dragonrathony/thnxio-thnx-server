class CreateVouchure < ActiveRecord::Migration[5.2]
  def change
    create_table :vouchures do |t|
      t.string :vouchure
      t.references :gift
      t.timestamps
    end
  end
end
