# Authorization System (RBAC)

This document describes the Role-Based Access Control (RBAC) system implemented using Pundit for the Cerulean application.

## Overview

The authorization system provides fine-grained access control across the multi-tenant application. It implements a four-tier role system that works in conjunction with the multitenancy system to ensure users can only access resources they're authorized to view or modify.

## Role Hierarchy

The system implements four distinct roles with increasing levels of access:

### 1. Member
- **Scope**: Account-specific
- **Access**: Dashboard access only
- **Restrictions**: Cannot manage account settings, users, or licenses
- **Use Case**: Regular users who need basic access to account resources

### 2. Admin
- **Scope**: Account-specific
- **Access**: Can manage most resources within their account
- **Restrictions**: Cannot invite users or change user roles
- **Use Case**: Account administrators who manage day-to-day operations

### 3. Owner
- **Scope**: Account-specific
- **Access**: Can manage any resource within their account
- **Capabilities**: Full account management including user invitations and role changes
- **Use Case**: Account owners who have complete control over their tenant

### 4. Internal Admin
- **Scope**: Global (all accounts)
- **Access**: Can manage any resource regardless of tenant
- **Special Privileges**: Only role that can create/modify accounts and manage products
- **Use Case**: Cerulean employees who provide support and administration

## Policy Structure

The authorization system is built using Pundit policies that follow a consistent pattern:

### Core Policies

1. **ApplicationPolicy** - Base policy with shared authorization logic
2. **UserPolicy** - User management authorization
3. **AccountPolicy** - Account management authorization
4. **AccountUserPolicy** - Account user management authorization
5. **LicensePolicy** - License management authorization
6. **LicenseEntitlementPolicy** - License entitlement authorization
7. **DashboardPolicy** - Dashboard access authorization
8. **ProductPolicy** - Product management authorization

### Policy Methods

Each policy implements standard CRUD methods:
- `index?` - Can view list of resources
- `show?` - Can view individual resource
- `create?` / `new?` - Can create new resources
- `update?` / `edit?` - Can modify existing resources
- `destroy?` - Can delete resources

Additional methods for specific actions:
- `activate?` / `deactivate?` - Can change resource status
- `permitted_attributes` - Which attributes can be modified
- `Scope` - Which resources can be accessed

## Detailed Permission Matrix

### User Management

| Action | Member | Admin | Owner | Internal Admin |
|--------|--------|-------|-------|----------------|
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |
| View other users | ❌ | ✅ | ✅ | ✅ |
| Edit other users | ❌ | ❌ | ✅ | ✅ |
| Invite users | ❌ | ❌ | ✅ | ✅ |
| Change user roles | ❌ | ❌ | ✅ | ✅ |
| Deactivate users | ❌ | ✅ | ✅ | ✅ |
| View all users (global) | ❌ | ❌ | ❌ | ✅ |

### Account Management

| Action | Member | Admin | Owner | Internal Admin |
|--------|--------|-------|-------|----------------|
| View account details | ✅ | ✅ | ✅ | ✅ |
| Edit account details | ❌ | ❌ | ✅ | ✅ |
| Create accounts | ❌ | ❌ | ❌ | ✅ |
| Delete accounts | ❌ | ❌ | ❌ | ✅ |
| Activate/Deactivate accounts | ❌ | ❌ | ❌ | ✅ |
| View all accounts | ❌ | ❌ | ❌ | ✅ |

### License Management

| Action | Member | Admin | Owner | Internal Admin |
|--------|--------|-------|-------|----------------|
| View account licenses | ✅ | ✅ | ✅ | ✅ |
| Manage account licenses | ❌ | ❌ | ❌ | ✅ |
| View all licenses | ❌ | ❌ | ❌ | ✅ |
| Create/Edit licenses | ❌ | ❌ | ❌ | ✅ |

### Product Management

| Action | Member | Admin | Owner | Internal Admin |
|--------|--------|-------|-------|----------------|
| View products | ❌ | ❌ | ❌ | ✅ |
| Manage products | ❌ | ❌ | ❌ | ✅ |

## Implementation Guidelines

### For New Controllers

When creating new controllers, **always** implement proper authorization:

1. **Include Pundit in your controller:**
   ```ruby
   class MyController < ApplicationController
     include Pundit::Authorization
   end
   ```

2. **Authorize every action:**
   ```ruby
   def index
     authorize MyModel
     @records = policy_scope(MyModel)
   end

   def show
     @record = MyModel.find(params[:id])
     authorize @record
   end

   def create
     @record = MyModel.new(permitted_attributes(MyModel))
     authorize @record
     # ... rest of action
   end
   ```

3. **Use policy scopes for data filtering:**
   ```ruby
   def index
     @records = policy_scope(MyModel.all)
   end
   ```

4. **Use permitted_attributes for strong parameters:**
   ```ruby
   private

   def record_params
     permitted_attributes(@record || MyModel)
   end
   ```

### Creating New Policies

1. **Inherit from ApplicationPolicy:**
   ```ruby
   class MyModelPolicy < ApplicationPolicy
     def index?
       # Authorization logic
     end

     def show?
       # Authorization logic
     end

     # ... other methods

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

2. **Use helper methods from ApplicationPolicy:**
   - `internal_admin?` - Check if user is internal admin
   - `owner_of_account?(account)` - Check if user owns account
   - `admin_of_account?(account)` - Check if user is admin of account
   - `member_of_account?(account)` - Check if user is member of account
   - `belongs_to_account?(account)` - Check if user belongs to account

### Testing Authorization

Always test your authorization logic:

```ruby
RSpec.describe MyModelPolicy do
  subject { described_class }

  let(:user) { create(:user) }
  let(:account) { create(:account) }
  let(:record) { create(:my_model, account: account) }

  permissions :show? do
    context "when user is account member" do
      before { create(:account_user, user: user, account: account) }
      
      it "grants access" do
        expect(subject).to permit(user, record)
      end
    end

    context "when user is not account member" do
      it "denies access" do
        expect(subject).not_to permit(user, record)
      end
    end
  end
end
```

## Security Considerations

1. **Default Deny**: All policies default to denying access unless explicitly granted
2. **Tenant Isolation**: Regular users can only access resources within their accounts
3. **Role Validation**: User roles are validated at the database level
4. **Scope Filtering**: All data queries are automatically scoped by user permissions
5. **Attribute Protection**: Sensitive attributes are protected based on user role

## Common Patterns

### Multi-Account Resources
For resources that belong to accounts, use this pattern:

```ruby
def show?
  internal_admin? || belongs_to_account?(record.account)
end

def update?
  internal_admin? || can_manage_account?(record.account)
end
```

### User-Specific Resources
For resources that belong to users:

```ruby
def show?
  internal_admin? || record.user == user
end
```

### Admin-Only Resources
For resources only internal admins can access:

```ruby
def index?
  internal_admin?
end

def create?
  internal_admin?
end
```

## Troubleshooting

### Common Issues

1. **Pundit::NotAuthorizedError**: User doesn't have permission for the action
   - Check if user has correct role
   - Verify user belongs to the account
   - Ensure policy method exists and returns true

2. **Missing Policy**: No policy found for the model
   - Create a policy class following naming convention
   - Ensure policy inherits from ApplicationPolicy

3. **Scope Issues**: User sees no data or wrong data
   - Check the policy's Scope class
   - Verify scope filtering logic
   - Ensure user has account associations

### Debugging Authorization

Use these helpers in development:

```ruby
# Check what a user can do
policy = Pundit.policy(user, record)
policy.show?    # => true/false
policy.update?  # => true/false

# Check what records a user can see
Pundit.policy_scope(user, Model)

# Get permitted attributes
Pundit.policy(user, record).permitted_attributes
```

## Future Enhancements

Potential areas for expansion:

1. **Resource-Level Permissions**: More granular permissions on specific resources
2. **Time-Based Access**: Temporary access grants with expiration
3. **Audit Logging**: Track authorization decisions for compliance
4. **Dynamic Roles**: Runtime role assignment based on conditions
5. **Permission Inheritance**: Hierarchical permission structures
