FactoryBot.define do
  factory :rsvp do
    association :user
    association :event
    status { "yes" }

    trait :pending do
      status { "pending" }
    end

    trait :no do
      status { "no" }
    end

    trait :attended do
      attended_at { Time.current }
    end

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
