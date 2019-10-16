class Product < ApplicationRecord
    acts_as_paranoid
    has_paper_trail :class_name => 'PaperTrail::Version'

    validates_presence_of :name, :sku, :price, :qty
    validates :sku, uniqueness: { case_sensitive: false }
end
