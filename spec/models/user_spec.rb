require 'rails_helper'

RSpec.describe User, type: :model do
  subject { build(:user) }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }
  it { should validate_presence_of(:zip_code) }
  it { should validate_presence_of(:password) }

  it { should have_one(:vote) }
end
