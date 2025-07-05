# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
    def sign_in_as(user)
      post(sign_in_url, params: { email: user.email, password: 'Secret1*3*5*' })
      user
    end
  end
end

# Custom Inertia test helpers for Minitest
module ActionDispatch
  class IntegrationTest
    # Inertia request headers
    def inertia_headers
      {
        'X-Inertia' => 'true',
        'X-Requested-With' => 'XMLHttpRequest',
        'Accept' => 'text/html, application/xhtml+xml',
        'X-Inertia-Version' => 'test-version'
      }
    end

    # Override HTTP methods to include Inertia headers when testing Inertia responses
    def inertia_get(path, **args)
      get(path, headers: inertia_headers.merge(args[:headers] || {}), **args.except(:headers))
    end

    def inertia_post(path, **args)
      post(path, headers: inertia_headers.merge(args[:headers] || {}), **args.except(:headers))
    end

    def inertia_patch(path, **args)
      patch(path, headers: inertia_headers.merge(args[:headers] || {}), **args.except(:headers))
    end

    def inertia_put(path, **args)
      put(path, headers: inertia_headers.merge(args[:headers] || {}), **args.except(:headers))
    end

    def inertia_delete(path, **args)
      delete(path, headers: inertia_headers.merge(args[:headers] || {}), **args.except(:headers))
    end

    def assert_inertia_response
      assert response.content_type.start_with?('application/json'),
             "Expected JSON response, got #{response.content_type}"
      json_response = JSON.parse(response.body)
      assert json_response.key?('component'), 'Response is not an Inertia response'
      assert json_response.key?('props'), 'Response is not an Inertia response'
    end

    def assert_inertia_component(expected_component)
      json_response = JSON.parse(response.body)
      assert_equal expected_component, json_response['component']
    end

    def assert_inertia_props(expected_props = nil)
      json_response = JSON.parse(response.body)
      if block_given?
        yield json_response['props']
      elsif expected_props
        assert_equal expected_props, json_response['props']
      end
    end

    def inertia_props
      json_response = JSON.parse(response.body)
      json_response['props']
    end
  end
end
