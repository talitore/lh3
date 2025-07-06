FactoryBot.define do
  factory :event do
    association :creator, factory: :user
    sequence(:run_number)
    descriptor { "Test Run" }
    date { Date.today }
    time { Time.current }
    address { "1600 Amphitheatre Parkway, Mountain View, CA" }

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
