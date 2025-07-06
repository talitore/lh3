FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user_#{n}@example.com" }
    password { "password" }
    password_confirmation { "password" }
    display_name { "Test User" }
    verified { true }

    trait :unverified do
      verified { false }
    end

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
