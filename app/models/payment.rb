class Payment < ApplicationRecord
    acts_as_paranoid
    #acts_as_tenant(:account)
    has_paper_trail :class_name => 'PaperTrail::PaymentVersion'

    belongs_to :user
    belongs_to :account, :optional => true

end
