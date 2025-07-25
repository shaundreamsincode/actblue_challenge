class Candidate < ApplicationRecord
  has_many :votes
  validates_presence_of :name
end
