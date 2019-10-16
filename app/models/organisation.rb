class Organisation < Account
    acts_as_paranoid
    has_many :unassigned_thnx, -> { where :owner_user_id => nil }, foreign_key: "account_id", class_name: "OrganisationThnx"

    validates :name, uniqueness: { case_sensitive: false }
end
