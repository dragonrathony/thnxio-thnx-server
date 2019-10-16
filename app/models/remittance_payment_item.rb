class RemittancePaymentItem < ApplicationRecord
    acts_as_paranoid

    has_paper_trail :class_name => 'PaperTrail::InvoiceVersion'
    
    belongs_to :remittance_payment
    belongs_to :thnx
    
end
