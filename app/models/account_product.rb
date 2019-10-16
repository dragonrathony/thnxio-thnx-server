class AccountProduct < ApplicationRecord
    acts_as_paranoid
    acts_as_tenant(:account)
    belongs_to :account

   
    has_paper_trail :class_name => 'PaperTrail::AccountVersion'

end
