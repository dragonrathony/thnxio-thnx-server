class Tax < ApplicationRecord
    acts_as_paranoid
    has_paper_trail :class_name => 'PaperTrail::Version'
end
