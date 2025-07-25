require 'rails_helper'

RSpec.describe Candidate, type: :model do
  subject { build(:candidate) }

  it { should have_many(:votes) }
end
