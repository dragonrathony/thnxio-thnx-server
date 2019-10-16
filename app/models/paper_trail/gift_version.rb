
module PaperTrail
  class GiftVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :gift_versions
    self.sequence_name = :gift_versions_id_seq

    
  end
end