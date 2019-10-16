class OrganisationPayment < Payment
    acts_as_tenant(:account)
    belongs_to :account

end
