
module PaperTrail
  class PaymentVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :payment_versions
    self.sequence_name = :payment_versions_id_seq

    
  end
end