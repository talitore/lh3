# Testing Strategy for Inertia.js Rails Application

This document outlines our testing strategy for the Cerulean application, which uses Inertia.js with Rails.

## Overview

Our testing approach is designed to provide comprehensive coverage while respecting the unique architecture of an Inertia.js application. Since Inertia.js bridges the gap between server-side and client-side rendering, our testing strategy focuses on the server-side responses and data structures rather than traditional view testing.

## Test Types

### 1. Model Tests

Model tests verify the business logic, validations, and relationships in our ActiveRecord models.

- **Location**: `spec/models/`
- **Framework**: RSpec with Shoulda Matchers
- **Focus**: Validations, associations, callbacks, and model methods

Example:

```ruby
RSpec.describe Account, type: :model do
  describe "validations" do
    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:subdomain).case_insensitive }
  end

  describe "associations" do
    it { should have_many(:account_users).dependent(:destroy) }
    it { should have_many(:users).through(:account_users) }
  end
end
```

### 2. Request Tests

Request tests verify the server-side behavior of our controllers, including the Inertia responses they generate. These are our primary tests for controller functionality since we're using Inertia.js.

- **Location**: `spec/requests/`
- **Framework**: RSpec with Inertia Rails test helpers
- **Focus**: HTTP responses, Inertia components, props, and redirects

Example:

```ruby
RSpec.describe "/accounts", type: :request, inertia: true do
  it "renders the Account/Index component" do
    get accounts_url

    expect(response).to be_successful
    expect(inertia.component).to eq("Account/Index")
    expect(inertia.props[:accounts]).to be_an(Array)
  end
end
```

### 3. Routing Tests

Routing tests verify that URLs are correctly mapped to controller actions, which is especially important in a multi-tenant application with subdomain routing.

- **Location**: `spec/routing/`
- **Framework**: RSpec
- **Focus**: URL to controller/action mapping, including subdomain constraints

Example:

```ruby
RSpec.describe AccountsController, type: :routing do
  it "routes to #show with subdomain" do
    expect(get: "http://test.localhost/account").to route_to(
      controller: "accounts",
      action: "show"
    )
  end
end
```

### 4. System Tests

System tests provide end-to-end testing of the application, including JavaScript interactions. These are particularly valuable for testing the full stack, including the React frontend.

- **Location**: `spec/system/`
- **Framework**: RSpec with Capybara and Selenium
- **Focus**: User flows, JavaScript interactions, and multi-page processes

Example:

```ruby
RSpec.describe "Multitenancy", type: :system do
  it "allows access to account subdomain for associated users" do
    sign_in_as(user)
    host! "#{account.subdomain}.localhost"

    expect(page).to have_current_path("/dashboard")
  end
end
```

## Inertia.js Specific Testing

### Why We Don't Use View Specs

Traditional Rails view specs don't apply to Inertia.js applications because:

1. Inertia.js doesn't use server-side templates (ERB, HAML, etc.)
2. The "view" is actually a JSON response containing component name and props
3. The actual rendering happens client-side in React

Instead, we focus on testing:

- The correct Inertia component is rendered
- The props contain the expected data
- The controller actions respond appropriately

### Testing Inertia Responses

We use the `inertia_rails/rspec` gem to test Inertia responses. This provides helpers to inspect the component name and props returned by the server.

To use these helpers:

1. Add the `:inertia` tag to your request spec:

   ```ruby
   RSpec.describe "/accounts", type: :request, inertia: true do
   ```

2. Use the `inertia` helper to inspect the response:

   ```ruby
   expect(inertia.component).to eq("Account/Index")
   expect(inertia.props[:accounts]).to be_present
   ```

3. Test specific props and their structure:
   ```ruby
   expect(inertia.props[:account][:id]).to eq(account.id)
   expect(inertia.props[:account][:name]).to eq(account.name)
   ```

## Multitenancy Testing

Testing a multi-tenant application requires special consideration (Note: In this context, "Tenant" refers to the `Account` model in Rails):

1. Setting the correct subdomain for each test
2. Testing access controls between tenants
3. Verifying that data is properly scoped to tenants

We use helper methods to manage this:

```ruby
# Set the subdomain for the current test
host! "#{account.subdomain}.localhost"

# Test access controls
it "denies access to non-members" do
  sign_in_as(non_member_user)
  get account_url
  expect(response).to have_http_status(:forbidden)
end
```

## Factory Strategy

We use FactoryBot to create test data with traits for different scenarios:

```ruby
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Test User" }
    password { "Secret1*3*5*" }
    verified { true }
    internal { false }

    trait :internal do
      internal { true }
      sequence(:email) { |n| "internal#{n}@cerulean.work" }
    end

    trait :with_account do
      transient do
        account { nil }
        role { "member" }
        default { true }
      end

      after(:create) do |user, evaluator|
        account = evaluator.account || create(:account)
        create(:account_user, user: user, account: account,
               role: evaluator.role, default: evaluator.default)
      end
    end
  end
end
```

## Running Tests

- Run all tests: `bundle exec rspec`
- Run specific test file: `bundle exec rspec spec/requests/accounts_spec.rb`
- Run specific test: `bundle exec rspec spec/requests/accounts_spec.rb:42`
- Skip tests with specific tag: `bundle exec rspec --tag ~skip`

## Continuous Integration

Our CI pipeline runs all tests on every pull request and merge to main. Tests must pass before code can be merged.
