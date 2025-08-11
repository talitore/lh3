# frozen_string_literal: true

if Rails.env.test?
  Geocoder.configure(lookup: :test)

  Geocoder::Lookup::Test.set_default_stub(
    [
      {
        "latitude" => 40.7143528,
        "longitude" => -74.0059731,
        "address" => "New York, NY, USA",
        "state" => "New York",
        "state_code" => "NY",
        "country" => "United States",
        "country_code" => "US"
      }
    ]
  )
else
  Geocoder.configure(
    # Geocoding service provider
    lookup: :google,

    # Geocoding service API key
    api_key: ENV.fetch("GEOCODER_API_KEY", nil),

    # Other geocoding options
    timeout: 5,
    units: :mi
  )
end
