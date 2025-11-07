# frozen_string_literal: true

FactoryBot.define do
  factory :photo do
    user
    hash_event
    sequence(:image_url) { |n| "https://example.com/photo_#{n}.jpg" }
    alt_text { "A test photo" }

    trait :deleted do
      deleted_at { Time.current }
    end
  end
end
