FactoryBot.define do
  factory :vote do
    user { association(:user) }
    candidate { association(:candidate) }
  end
end
