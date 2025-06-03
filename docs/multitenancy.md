# Multitenancy System

This document describes the multitenancy system implemented in the Cerulean application.

## Overview

The multitenancy system allows users to access different accounts via subdomains (e.g., company-name.cerulean.work). Each user can belong to multiple accounts, and accounts can have multiple users. The system is designed to be secure, ensuring that users can only access accounts they are members of.

## Key Components

### Models

1. **Account**
   - Represents a tenant in the system
   - Has a unique subdomain that is used for access
   - Has many users through account_users

2. **User**
   - Represents a user in the system
   - Can belong to multiple accounts through account_users
   - Has an `internal` flag to identify internal employees

3. **AccountUser**
   - Join table between User and Account
   - Contains a `role` field with values: "member", "admin", "owner"
   - Contains a `status` field to enable/disable user access
   - Contains a `default` flag to identify the user's default account

### Current Object

The `Current` object is used to store request-specific information, including:
- The current user (via the session)
- The current account (based on the subdomain)
- The current subdomain

### Multitenancy Concern

The `Multitenancy` concern is included in the `ApplicationController` and handles:
- Setting the current account based on the subdomain
- Ensuring users only have access to accounts they are members of
- Special handling for the internal.cerulean.work subdomain

## Subdomain Routing

The application uses subdomain-based routing to determine which account a user is accessing:

1. **No Subdomain (cerulean.work)**
   - Users can sign up, sign in, and manage their accounts
   - Users can see a list of accounts they have access to

2. **Account Subdomain (company-name.cerulean.work)**
   - Users can access account-specific resources
   - Users must be members of the account to access it

3. **Internal Subdomain (internal.cerulean.work)**
   - Only internal users can access this subdomain
   - Used for internal administration and management

## User Authentication Flow

1. When a user signs up:
   - If on a subdomain, they are automatically associated with that account
   - If on the internal subdomain, they are marked as internal users

2. When a user signs in:
   - The system checks if they have access to the current account (if on a subdomain)
   - If on the internal subdomain, the system checks if they are an internal user
   - If the user doesn't have access, they are redirected to the sign-in page with an error message

## Account Management

1. **Creating Accounts**
   - Users can create new accounts from the main domain
   - When an account is created, the user is automatically associated with it

2. **Managing Account Users**
   - Account administrators can invite users to join their account
   - Account administrators can remove users from their account
   - Account administrators can change user roles within their account

## RBAC Integration

The multitenancy system works with the implemented RBAC (Role-Based Access Control) system using the Pundit gem:

1. The `AccountUser` model includes a `role` field with four permission levels:
   - **member**: Dashboard access only
   - **admin**: Can manage resources except user invitations/roles
   - **owner**: Can manage any resource within their account
   - **internal_admin**: Global access across all accounts (set via User.internal flag)

2. Pundit policies use the user's role and account membership to determine access
3. All controllers implement proper authorization using `authorize` and `policy_scope`

For detailed information, see the [Authorization Documentation](authorization.md).

## Console Helpers

When working in the Rails console, the following helpers are available:

1. A default account is automatically set when the console starts
2. The `switch_account(subdomain)` method can be used to switch to a different account

## Testing

The system includes factories for testing:

1. `FactoryBot.create(:user)` - Creates a regular user
2. `FactoryBot.create(:user, :internal)` - Creates an internal user
3. `FactoryBot.create(:user, :with_account)` - Creates a user with an associated account
4. `FactoryBot.create(:account)` - Creates an account
5. `FactoryBot.create(:account_user)` - Creates an account-user association
