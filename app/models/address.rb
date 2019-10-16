class Address < ApplicationRecord
    acts_as_paranoid
    acts_as_tenant(:account)
    belongs_to :account

    has_paper_trail :class_name => 'PaperTrail::AccountVersion'

    validates_presence_of :address1, :city, :state, :postcode, :country_code
    validates :country_code, inclusion: { in: %w(AU NZ USA),
        message: "%{value} is not a valid country" }

    def full_address
        "#{address1} #{address2} #{city}"
    end

end
