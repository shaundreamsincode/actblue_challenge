FactoryBot.define do
  factory :user do
  email { Faker::Internet.unique.email }
  zip_code { Faker::Address.zip_code }
  password { Faker::Internet.password }
  end
end
