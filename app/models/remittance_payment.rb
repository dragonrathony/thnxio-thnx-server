class RemittancePayment < ApplicationRecord
    acts_as_paranoid
    has_paper_trail :class_name => 'PaperTrail::InvoiceVersion'
    
    belongs_to :merchant_account, :class_name => "Account"
    belongs_to :remittance_batch, optional: true
    has_many :remittance_payment_items

end
