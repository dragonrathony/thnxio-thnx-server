class CreateAllVersions < ActiveRecord::Migration[5.2]
  TEXT_BYTES = 1_073_741_823
  def change
    create_table :account_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end

    create_table :gift_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end

    create_table :invoice_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end
    create_table :payment_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end
    create_table :thnx_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end
    create_table :user_versions do |t|
      t.string   :item_type, {:null=>false}
      t.integer  :item_id,   null: false
      t.string   :event,     null: false
      t.string   :whodunnit
      t.text     :object, limit: TEXT_BYTES
      t.text     :object_changes, limit: TEXT_BYTES
      t.datetime :created_at
    end
    add_index :user_versions, %i(item_type item_id)
    add_index :thnx_versions, %i(item_type item_id)
    add_index :payment_versions, %i(item_type item_id)
    add_index :invoice_versions, %i(item_type item_id)
    add_index :gift_versions, %i(item_type item_id)
    add_index :account_versions, %i(item_type item_id)
  end
end
