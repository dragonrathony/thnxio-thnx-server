# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_08_29_054317) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_products", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "product_id"
    t.decimal "price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_account_products_on_account_id"
    t.index ["product_id"], name: "index_account_products_on_product_id"
  end

  create_table "account_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "total_thnx_received"
    t.integer "total_thnx_gifted"
    t.index ["account_id"], name: "index_account_users_on_account_id"
    t.index ["user_id"], name: "index_account_users_on_user_id"
  end

  create_table "account_users_roles", id: false, force: :cascade do |t|
    t.bigint "account_user_id"
    t.bigint "role_id"
    t.index ["account_user_id", "role_id"], name: "index_account_users_roles_on_account_user_id_and_role_id"
    t.index ["account_user_id"], name: "index_account_users_roles_on_account_user_id"
    t.index ["role_id"], name: "index_account_users_roles_on_role_id"
  end

  create_table "account_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_account_versions_on_item_type_and_item_id"
  end

  create_table "accounts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.string "country_code"
    t.boolean "active"
    t.string "deleted_at"
    t.string "name"
    t.string "code"
    t.float "unit_thnx_price"
    t.string "abn"
    t.string "bsb"
    t.string "account_no"
    t.string "primary_email"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.bigint "account_id"
    t.string "address1"
    t.string "address2"
    t.string "city"
    t.string "state"
    t.string "postcode"
    t.string "country_code"
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["account_id"], name: "index_addresses_on_account_id"
  end

  create_table "gift_items", force: :cascade do |t|
    t.bigint "gift_id"
    t.bigint "thnx_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["gift_id"], name: "index_gift_items_on_gift_id"
    t.index ["thnx_id"], name: "index_gift_items_on_thnx_id"
  end

  create_table "gift_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_gift_versions_on_item_type_and_item_id"
  end

  create_table "gifts", force: :cascade do |t|
    t.bigint "sender_user_id"
    t.bigint "recipient_user_id"
    t.bigint "product_id"
    t.string "message"
    t.boolean "opened"
    t.boolean "claimed"
    t.datetime "sent_at"
    t.datetime "opened_at"
    t.datetime "claimed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "recipient_name"
    t.string "recipient_email"
    t.string "recipient_mobile"
    t.string "claim_token"
    t.datetime "expires_at", null: false
    t.string "encrypted_claim_token"
    t.boolean "redeemed"
    t.datetime "redeemed_at"
    t.integer "merchant_account_id"
    t.datetime "sender_deleted_at"
    t.datetime "recipient_deleted_at"
    t.boolean "send_error"
    t.string "send_error_message"
    t.index ["merchant_account_id", "redeemed", "redeemed_at"], name: "index_gifts_on_merchant_account_id_and_redeemed_and_redeemed_at"
    t.index ["product_id"], name: "index_gifts_on_product_id"
    t.index ["recipient_user_id", "recipient_deleted_at"], name: "index_gifts_on_recipient_user_id_and_recipient_deleted_at"
    t.index ["recipient_user_id"], name: "index_gifts_on_recipient_user_id"
    t.index ["sender_user_id", "sender_deleted_at"], name: "index_gifts_on_sender_user_id_and_sender_deleted_at"
    t.index ["sender_user_id"], name: "index_gifts_on_sender_user_id"
  end

  create_table "invoice_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_invoice_versions_on_item_type_and_item_id"
  end

  create_table "payment_items", force: :cascade do |t|
    t.bigint "payment_id"
    t.bigint "thnx_id"
    t.decimal "price", precision: 10, scale: 6
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["payment_id"], name: "index_payment_items_on_payment_id"
    t.index ["thnx_id"], name: "index_payment_items_on_thnx_id"
  end

  create_table "payment_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_payment_versions_on_item_type_and_item_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "account_id"
    t.decimal "amount", precision: 10, scale: 2
    t.decimal "tax", precision: 10, scale: 2
    t.decimal "total", precision: 10, scale: 2
    t.float "qty"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "gateway"
    t.string "receipt"
    t.string "status"
    t.string "failure_code"
    t.string "failure_message"
    t.index ["account_id"], name: "index_payments_on_account_id"
    t.index ["user_id"], name: "index_payments_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name"
    t.string "sku"
    t.decimal "price", precision: 10, scale: 6
    t.float "qty"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
  end

  create_table "promotion_accounts", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.bigint "promotion_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "account_id"
    t.index ["account_id"], name: "index_promotion_accounts_on_account_id"
    t.index ["code"], name: "index_promotion_accounts_on_code", unique: true
    t.index ["promotion_id"], name: "index_promotion_accounts_on_promotion_id"
  end

  create_table "promotion_gifts", force: :cascade do |t|
    t.string "email_or_phone", null: false
    t.string "claim_token", null: false
    t.datetime "sent_at"
    t.datetime "redeemed_at"
    t.bigint "promotion_account_id"
    t.bigint "promotion_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "contact_me"
    t.bigint "gift_id"
    t.index ["gift_id"], name: "index_promotion_gifts_on_gift_id"
    t.index ["promotion_account_id"], name: "index_promotion_gifts_on_promotion_account_id"
    t.index ["promotion_id"], name: "index_promotion_gifts_on_promotion_id"
  end

  create_table "promotions", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.datetime "sent_gifts_at"
    t.boolean "accepting_gifts"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "claim_code"
    t.boolean "allow_reset"
    t.integer "available_thnx"
    t.bigint "sender_user_id"
    t.string "message"
    t.index ["code"], name: "index_promotions_on_code", unique: true
    t.index ["sender_user_id"], name: "index_promotions_on_sender_user_id"
  end

  create_table "remittance_batches", force: :cascade do |t|
    t.datetime "start_processing_at"
    t.datetime "complete_processing_at"
    t.datetime "paid_at"
    t.datetime "exported_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "line_item_count"
    t.decimal "total", precision: 18, scale: 4
  end

  create_table "remittance_payment_items", force: :cascade do |t|
    t.bigint "remittance_payment_id"
    t.bigint "thnx_id"
    t.decimal "unit_thnx_price", precision: 18, scale: 4
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["remittance_payment_id"], name: "index_remittance_payment_items_on_remittance_payment_id"
    t.index ["thnx_id"], name: "index_remittance_payment_items_on_thnx_id"
  end

  create_table "remittance_payments", force: :cascade do |t|
    t.bigint "merchant_account_id"
    t.decimal "total_amount", precision: 18, scale: 4
    t.decimal "total_tax", precision: 18, scale: 4
    t.decimal "total", precision: 18, scale: 4
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.datetime "paid_at"
    t.integer "qty"
    t.bigint "remittance_batch_id"
    t.boolean "processing"
    t.index ["merchant_account_id"], name: "index_remittance_payments_on_merchant_account_id"
    t.index ["remittance_batch_id"], name: "index_remittance_payments_on_remittance_batch_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "settings", force: :cascade do |t|
    t.string "var", null: false
    t.text "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["var"], name: "index_settings_on_var", unique: true
  end

  create_table "taxes", force: :cascade do |t|
    t.string "country_code"
    t.decimal "tax_perc", precision: 10, scale: 6
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
  end

  create_table "thnx_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_thnx_versions_on_item_type_and_item_id"
  end

  create_table "thnxes", force: :cascade do |t|
    t.bigint "owner_user_id"
    t.bigint "merchant_account_id"
    t.string "status"
    t.boolean "redeemed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.bigint "account_id"
    t.boolean "gifted"
    t.datetime "redeemed_at"
    t.datetime "remit_at"
    t.index ["account_id"], name: "index_thnxes_on_account_id"
    t.index ["merchant_account_id"], name: "index_thnxes_on_merchant_account_id"
    t.index ["owner_user_id"], name: "index_thnxes_on_owner_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.bigint "thnx_id"
    t.bigint "user_id"
    t.string "type"
    t.jsonb "meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["thnx_id"], name: "index_transactions_on_thnx_id"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "user_versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.text "object_changes"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_user_versions_on_item_type_and_item_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "jti"
    t.string "first_name"
    t.string "last_name"
    t.string "mobile"
    t.integer "total_thnx_received"
    t.integer "total_thnx_gifted"
    t.boolean "confirmed"
    t.string "notification_device_id"
    t.string "notification_token"
    t.jsonb "preferences"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email"
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  create_table "vouchures", force: :cascade do |t|
    t.string "vouchure"
    t.bigint "gift_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gift_id"], name: "index_vouchures_on_gift_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "accounts"
  add_foreign_key "gift_items", "gifts"
  add_foreign_key "gift_items", "thnxes"
  add_foreign_key "gifts", "accounts", column: "merchant_account_id"
  add_foreign_key "gifts", "products"
  add_foreign_key "gifts", "users", column: "recipient_user_id"
  add_foreign_key "gifts", "users", column: "sender_user_id"
  add_foreign_key "payment_items", "payments"
  add_foreign_key "payment_items", "thnxes"
  add_foreign_key "payments", "accounts"
  add_foreign_key "payments", "users"
  add_foreign_key "promotions", "users", column: "sender_user_id"
  add_foreign_key "remittance_payment_items", "remittance_payments"
  add_foreign_key "remittance_payment_items", "thnxes"
  add_foreign_key "remittance_payments", "accounts", column: "merchant_account_id"
  add_foreign_key "thnxes", "accounts", column: "merchant_account_id"
  add_foreign_key "transactions", "thnxes"
  add_foreign_key "transactions", "users"
end
