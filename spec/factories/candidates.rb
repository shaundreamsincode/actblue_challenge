FactoryBot.define do
  factory :candidate do
    name { Faker::Music.band }
  end
end
