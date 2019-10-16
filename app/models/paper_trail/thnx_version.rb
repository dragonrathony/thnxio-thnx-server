
module PaperTrail
  class ThnxVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :thnx_versions
    self.sequence_name = :thnx_versions_id_seq

    
  end
end