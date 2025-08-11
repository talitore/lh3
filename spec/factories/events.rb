# frozen_string_literal: true

FactoryBot.define do
  factory :event do
    creator factory: %i[user]
    sequence(:run_number)
    descriptor { "Test Run" }
    date { Time.zone.today }
    time { Time.current }
    address { "1600 Amphitheatre Parkway, Mountain View, CA" }

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
