
module PaperTrail
  class UserVersion < PaperTrail::Version
    # custom behaviour, e.g:
    self.table_name = :user_versions
    self.sequence_name = :user_versions_id_seq

    
  end
end