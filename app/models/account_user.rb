class AccountUser < ApplicationRecord
  rolify
    acts_as_tenant(:account)

    has_paper_trail :class_name => 'PaperTrail::AccountVersion'
    belongs_to :account
    belongs_to :user
end
