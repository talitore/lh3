# Cerulean Documentation

This directory contains comprehensive documentation for the Cerulean application architecture and development practices.

## 📚 Available Documentation

### Core Architecture
- **[Multitenancy System](multitenancy.md)** - How the subdomain-based multi-tenant architecture works
- **[Authorization System](authorization.md)** - Complete RBAC implementation guide with Pundit
- **[Authorization Quick Reference](authorization_quick_reference.md)** - Developer cheat sheet for authorization

### Development Practices  
- **[Testing Strategy](testing_strategy.md)** - Comprehensive testing approach for Inertia.js Rails apps

## 🚀 Quick Start for New Developers

### Understanding the System
1. Start with [Multitenancy System](multitenancy.md) to understand how accounts and subdomains work
2. Read [Authorization System](authorization.md) to understand the four-tier role system
3. Keep [Authorization Quick Reference](authorization_quick_reference.md) handy while coding

### Before Writing Code
- **New Controllers**: Always implement authorization following the patterns in the quick reference
- **New Features**: Consider which roles should have access and document authorization decisions
- **Testing**: Follow the testing strategy and include authorization tests

## 🔐 Security Requirements

### Every Controller Must:
- ✅ Include `Pundit::Authorization`
- ✅ Call `authorize` before every action
- ✅ Use `policy_scope` for data filtering  
- ✅ Use `permitted_attributes` for strong parameters
- ✅ Have comprehensive authorization tests

### Every Policy Must:
- ✅ Inherit from `ApplicationPolicy`
- ✅ Implement all CRUD methods (`index?`, `show?`, `create?`, `update?`, `destroy?`)
- ✅ Include a `Scope` class for data filtering
- ✅ Define `permitted_attributes` method
- ✅ Have complete test coverage

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Multitenancy  │    │  Authorization  │    │     Testing     │
│                 │    │                 │    │                 │
│ • Subdomains    │◄──►│ • 4-Tier Roles  │◄──►│ • Request Specs │
│ • Account Scope │    │ • Pundit Policies│   │ • Policy Tests  │
│ • Current Object│    │ • Tenant Isolation│  │ • System Tests  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Role System Summary

| Role | Scope | Key Permissions |
|------|-------|----------------|
| **Member** | Account | Dashboard access only |
| **Admin** | Account | Manage resources (limited user management) |
| **Owner** | Account | Full account management |
| **Internal Admin** | Global | Manage any resource across all accounts |

## 📝 Documentation Standards

When adding new documentation:

1. **Use clear headings** with emoji for visual hierarchy
2. **Include code examples** for implementation guidance  
3. **Add cross-references** to related documentation
4. **Update this README** when adding new docs
5. **Keep examples current** with the actual codebase

## 🔍 Finding Information

### I need to understand...
- **How subdomains work** → [Multitenancy System](multitenancy.md)
- **Who can access what** → [Authorization System](authorization.md)  
- **How to implement authorization** → [Authorization Quick Reference](authorization_quick_reference.md)
- **How to write tests** → [Testing Strategy](testing_strategy.md)

### I'm implementing...
- **A new controller** → [Authorization Quick Reference](authorization_quick_reference.md)
- **A new policy** → [Authorization System](authorization.md) + [Quick Reference](authorization_quick_reference.md)
- **Tests** → [Testing Strategy](testing_strategy.md)
- **Multi-tenant features** → [Multitenancy System](multitenancy.md)

## 🆘 Getting Help

1. **Check the documentation** - Most questions are answered here
2. **Look at existing code** - Follow established patterns in the codebase
3. **Run the tests** - They demonstrate expected behavior
4. **Ask the team** - For complex scenarios or architectural decisions

## 🔄 Keeping Documentation Updated

This documentation should be updated when:
- New authorization patterns are established
- Role permissions change
- New testing patterns are adopted
- Architecture decisions are made
- New developers join and find gaps

Remember: Good documentation prevents security vulnerabilities and speeds up development!
