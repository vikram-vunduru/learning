# Delegated Administration

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Delegated Administration lets you give non-admin users limited admin abilities — specifically, the ability to manage users within a defined scope. This is useful for large orgs where a central admin team can't handle every user request.

**Delegated Admin CAN:**
- Create and edit users in specified roles (and roles below them)
- Assign specified profiles to those users
- Assign specified Permission Sets to those users
- Manage specified custom objects (grant access, create/edit records)
- Reset passwords and unlock users within their scope

**Delegated Admin CANNOT:**
- Create new profiles
- Modify existing profiles
- Manage system permissions or standard objects they haven't been delegated for
- Create new custom objects
- Access Setup beyond their delegated scope
- Grant permissions they don't have themselves (security principle)

**Setup:** Setup → Security → Delegated Administrators → Create a Delegated Group → Define scope (roles, profiles, objects, Permission Sets)

**Delegated Administrator ≠ System Administrator.** A delegated admin is a normal user with a narrow slice of admin capability. System Admin is a profile with full org access.

## PTA / SA Relevance

Delegated admin is the right answer for regional IT leads or department heads who need to onboard their own users. This is common in global enterprises where a central Salesforce team can't create users across every regional office in every timezone.

**Architecture consideration:** Define the scope carefully. The delegated admin can only manage users in roles at or below their configured scope. If the role hierarchy isn't designed correctly, the scope for delegated admin won't match the real organizational structure.

**What delegated admins reveal about the org:** If you find a customer who has delegated admin groups configured, it usually means they have a distributed team structure and a central admin team that's too small for the org size. This is a signal to ask about their change management and governance processes.

## Key Facts to Memorize

- Delegated admin = limited admin powers for non-System Admin users
- Scope is defined per: roles (and below), profiles (which ones they can assign), objects (specific custom objects), Permission Sets
- CAN: create/edit users, reset passwords, assign profiles within scope
- CANNOT: create profiles, modify profiles, access system-wide settings
- Cannot grant permissions they don't themselves have (security principle)
- Configured in: Setup → Security → Delegated Administrators

## Exam Traps

- **"A delegated admin can create new profiles"** — FALSE. Creating profiles is a System Admin capability.
- **"Delegated admins can manage all users in the org"** — FALSE. Their scope is limited to specified roles.
- **"A delegated admin can grant any permission set to users"** — FALSE. Only the Permission Sets specified in their delegated group.
- **"Delegated admin requires a special license"** — FALSE. It's a configuration — any Salesforce user can be made a delegated admin.

## Practice Questions

**Q:** A large company wants their regional HR managers to create and manage user accounts for their own region without giving them full System Administrator access. What should the Salesforce admin configure?
**A:** Delegated Administration. Create a Delegated Admin group, assign the HR managers to it, and scope it to the appropriate roles and profiles.

**Q:** A delegated administrator tries to assign a new profile they just heard about to a user, but the profile doesn't appear in their options. Why?
**A:** Delegated admins can only assign profiles that have been explicitly included in their Delegated Admin group configuration. The profile must be added to their allowed profile list.

**Q:** Can a delegated administrator create a new custom object in Salesforce?
**A:** No. Creating custom objects requires System Administrator access. Delegated admins can only manage users and assigned objects within their delegated scope.
