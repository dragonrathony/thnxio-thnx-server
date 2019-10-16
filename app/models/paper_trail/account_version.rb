
module PaperTrail
  class AccountVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :account_versions
    self.sequence_name = :account_versions_id_seq

    
  end
end