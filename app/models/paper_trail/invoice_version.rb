
module PaperTrail
  class InvoiceVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :invoice_versions
    self.sequence_name = :invoice_versions_id_seq

    
  end
end