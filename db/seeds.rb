# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Product.create!(name: "Big Thnx", price: 10, qty: 2, sku: "BIGTHNX_COFFEE")
Product.create!(name: "Small Thnx", price: 5, qty: 1, sku: "SMALLTHNX_COFFEE")

Tax.create!(country_code: "AU", tax_perc: 10.0)
Tax.create!(country_code: "NZ", tax_perc: 12.5)