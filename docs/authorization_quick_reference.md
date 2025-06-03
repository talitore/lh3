# Authorization Quick Reference

A quick reference guide for implementing authorization in the Cerulean application.

## Role Hierarchy (Quick Overview)

```
Internal Admin (Global)
    ↓
Owner (Account-wide)
    ↓  
Admin (Account-wide, limited)
    ↓
Member (Read-only)
```

## Controller Authorization Checklist

### ✅ Required for Every Controller Action

```ruby
class MyController < ApplicationController
  include Pundit::Authorization

  def index
    authorize MyModel                    # ← Always authorize first
    @records = policy_scope(MyModel)     # ← Use policy scope for filtering
  end

  def show
    @record = MyModel.find(params[:id])
    authorize @record                    # ← Authorize the specific record
  end

  def create
    @record = MyModel.new(record_params)
    authorize @record                    # ← Authorize before saving
    # ... rest of action
  end

  private

  def record_params
    permitted_attributes(@record || MyModel)  # ← Use policy for params
  end
end
```

## Policy Template

```ruby
class MyModelPolicy < ApplicationPolicy
  def index?
    internal_admin? || belongs_to_account?(current_account)
  end

  def show?
    internal_admin? || belongs_to_account?(record.account)
  end

  def create?
    internal_admin? || can_manage_account?(current_account)
  end

  def update?
    internal_admin? || can_manage_account?(record.account)
  end

  def destroy?
    internal_admin?
  end

  def permitted_attributes
    if internal_admin?
      [:name, :description, :status, :account_id]
    elsif owner_of_account?(record&.account || current_account)
      [:name, :description]
    else
      []
    end
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if internal_admin?
        scope.all
      else
        scope.joins(:account).where(account: user.accounts)
      end
    end
  end
end
```

## Helper Methods Available in Policies

### Role Checking
```ruby
internal_admin?                    # Global admin access
owner_of_account?(account)         # Account owner
admin_of_account?(account)         # Account admin  
member_of_account?(account)        # Account member
belongs_to_account?(account)       # Any account access
```

### Permission Checking
```ruby
can_manage_account?(account)       # Owner or internal admin
can_manage_users_for_account?(account)  # Admin, owner, or internal admin
```

### Context
```ruby
current_account                    # Current account from subdomain
user                              # Current user
record                            # The record being authorized
```

## Common Authorization Patterns

### Account-Scoped Resources
```ruby
def show?
  internal_admin? || belongs_to_account?(record.account)
end

def update?
  internal_admin? || can_manage_account?(record.account)
end
```

### User-Owned Resources
```ruby
def show?
  internal_admin? || record.user == user
end

def update?
  internal_admin? || (record.user == user && member_of_account?(record.account))
end
```

### Admin-Only Resources
```ruby
def index?
  internal_admin?
end

def create?
  internal_admin?
end
```

### Role-Based Attribute Access
```ruby
def permitted_attributes
  base_attrs = [:name, :description]
  
  if internal_admin?
    base_attrs + [:status, :account_id, :internal_flag]
  elsif owner_of_account?(record&.account)
    base_attrs + [:contact_email]
  elsif admin_of_account?(record&.account)
    base_attrs
  else
    []
  end
end
```

## Testing Authorization

### Policy Tests
```ruby
RSpec.describe MyModelPolicy do
  subject { described_class }
  
  let(:user) { create(:user) }
  let(:account) { create(:account) }
  let(:record) { create(:my_model, account: account) }

  permissions :show? do
    context "with account member" do
      before { create(:account_user, user: user, account: account, role: "member") }
      it { is_expected.to permit(user, record) }
    end

    context "with non-member" do
      it { is_expected.not_to permit(user, record) }
    end

    context "with internal admin" do
      let(:user) { create(:user, :internal) }
      it { is_expected.to permit(user, record) }
    end
  end

  describe "Scope" do
    it "returns only user's account records" do
      create(:account_user, user: user, account: account)
      other_record = create(:my_model)  # Different account
      
      scope = Pundit.policy_scope(user, MyModel)
      expect(scope).to include(record)
      expect(scope).not_to include(other_record)
    end
  end
end
```

### Request Tests
```ruby
RSpec.describe "/my_models", type: :request do
  let(:user) { create(:user) }
  let(:account) { create(:account) }
  
  before do
    create(:account_user, user: user, account: account, role: "member")
    sign_in user
    host! "#{account.subdomain}.localhost"
  end

  describe "GET /my_models" do
    it "authorizes and returns success" do
      get my_models_path
      expect(response).to be_successful
    end
  end

  describe "POST /my_models" do
    context "as member" do
      it "denies access" do
        post my_models_path, params: { my_model: { name: "Test" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "as owner" do
      before { user.account_users.first.update!(role: "owner") }
      
      it "allows creation" do
        post my_models_path, params: { my_model: { name: "Test" } }
        expect(response).to have_http_status(:redirect)
      end
    end
  end
end
```

## Debugging Authorization

### Check User Permissions
```ruby
# In console or debugger
user = User.find(1)
record = MyModel.find(1)

# Check specific permission
policy = Pundit.policy(user, record)
policy.show?     # => true/false
policy.update?   # => true/false

# Check scope
Pundit.policy_scope(user, MyModel).count

# Check permitted attributes
policy.permitted_attributes
```

### Common Error Messages

**Pundit::NotAuthorizedError**
- User lacks permission for the action
- Check user role and account membership
- Verify policy method exists and logic

**Pundit::PolicyNotFoundError**  
- Missing policy class
- Create `MyModelPolicy` class
- Ensure proper naming convention

**Empty results from policy_scope**
- Check Scope class implementation
- Verify user has account associations
- Debug scope filtering logic

## Security Reminders

- ✅ **Always authorize before any action**
- ✅ **Use policy_scope for data filtering**  
- ✅ **Use permitted_attributes for params**
- ✅ **Test all authorization scenarios**
- ❌ **Never skip authorization checks**
- ❌ **Don't rely on UI-only restrictions**
- ❌ **Avoid hardcoding role checks in controllers**

## Role Assignment Quick Reference

```ruby
# Create users with roles
create(:user, :internal)                                    # Internal admin
create(:user, :with_account, role: "owner")                # Account owner  
create(:user, :with_account, role: "admin")                # Account admin
create(:user, :with_account, role: "member")               # Account member

# Change user role
account_user = user.account_users.find_by(account: account)
account_user.update!(role: "owner")
```

## Need Help?

1. Check the full [Authorization Documentation](authorization.md)
2. Look at existing policy implementations in `app/policies/`
3. Review policy tests in `spec/policies/`
4. Ask in team chat for complex authorization scenarios
