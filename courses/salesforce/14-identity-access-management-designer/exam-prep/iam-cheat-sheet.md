# CRT-405 IAM Designer — Master Cheat Sheet

*Quick-reference for exam day and architecture reviews. Print this. Read it the morning of the exam.*

---

## Exam Domain Weights

| Domain | Weight | ~Questions |
|---|---|---|
| Federation, SSO & Delegated Authentication | 22% | 13 |
| Salesforce Identity (Connected Apps, OAuth) | 25% | 15 |
| Access Management & Governance | 20% | 12 |
| Communities, Portals & External Identity | 17% | 10 |
| Identity Principles & Architecture | 16% | 10 |

**Total: 60 questions, 105 minutes**

---

## SAML Quick Reference

**Flow Types:**
- SP-Initiated: User starts at Salesforce → AuthnRequest to IdP → SAML Response back → ACS URL
- IdP-Initiated: User starts at IdP portal → SAML Response directly → ACS URL (no AuthnRequest)
- SP-Initiated is MORE secure (InResponseTo prevents replay attacks)

**Critical Elements:**
| Element | Salesforce Config | Must Match |
|---|---|---|
| `Issuer` | "Issuer" field in SSO Settings | IdP's entityID |
| `Audience` | Auto-set to Entity ID | Salesforce My Domain URL |
| `NameID` | SAML Identity Type setting | Federation ID / Username / Email |
| `ACS URL` | Auto-populated | Where IdP POSTs the response |
| `Entity ID` | Auto-set from My Domain | Must be registered with IdP |
| `InResponseTo` | Checked by SF | Present in SP-init; ABSENT in IdP-init |

**SAML vs. OAuth — When to Use:**
- SAML → enterprise browser SSO (AD, Okta, ADFS) → SSO Settings
- OAuth/OIDC → social login, API access, mobile → Auth Provider / Connected App

**JIT Provisioning:**
- Creates/updates users on SAML login
- Cannot deprovision (only fires on login)
- Requires attributes in assertion: FirstName, LastName, Email, ProfileName

**NameID Formats:**
- `emailAddress` → email format
- `unspecified` → any format (use with Federation ID)
- `persistent` → opaque cross-session identifier
- `transient` → one-session-only identifier

**Common SAML Errors:**
| Error | Cause |
|---|---|
| Invalid audience | Audience ≠ Salesforce Entity ID |
| Assertion expired | Clock skew > NotOnOrAfter window |
| NameID not matched | Federation ID value mismatch |
| Invalid signature | Wrong IdP certificate in SF |
| JIT failed | Missing required attribute in assertion |

---

## OAuth 2.0 Grant Types Quick Reference

| Grant Type | Use Case | Has refresh_token | Client Secret? |
|---|---|---|---|
| Authorization Code | Server-side web app | Yes | Yes |
| Auth Code + PKCE | Mobile / SPA | Yes | NO (public client) |
| Client Credentials | M2M — no user context | No | Yes |
| JWT Bearer | M2M — user context via sub | No | NO (certificate) |
| Implicit (deprecated) | Old SPA — avoid | No | No |
| ROPC / Password | Legacy — avoid | Yes | Yes |
| Device Flow | IoT / CLI — limited input | Yes | Sometimes |

**JWT Bearer Requirements:**
1. Certificate uploaded to Connected App (Use Digital Signatures)
2. Admin Approved policy enabled
3. `sub` user has Connected App's Permission Set assigned

**`exp` claim**: max 3 minutes in the future; clock sync is critical

**Client Credentials Requirements:**
1. "Enable Client Credentials Flow" checked in Connected App
2. Run As User configured in OAuth Policies
3. Admin Approved policy enabled

---

## OpenID Connect

**id_token vs access_token:**
- `id_token` = JWT for identity; validated by client; NOT used for API calls
- `access_token` = opaque string for API calls; NOT a JWT in Salesforce

**Scopes for identity:**
- `openid` → enables id_token (sub claim only)
- `openid profile` → adds name, locale, timezone
- `openid profile email` → adds email, email_verified

**UserInfo endpoint:** `GET /services/oauth2/userinfo` with access_token

**Token Introspection:** `POST /services/oauth2/introspect` — requires auth; returns `active: true/false`

---

## Connected Apps Quick Reference

**Policy: Permitted Users**
- All users may self-authorize → consent screen; no PS required
- Admin approved users are pre-authorized → no consent; PS assignment REQUIRED

**IP Relaxation:**
- Enforce IP restrictions → Profile Login IP Ranges apply to OAuth
- Relax with second factor → IP bypassed IF high-assurance session
- Relax IP restrictions → no IP restrictions for this app

**Refresh Token Policies (default = unlimited → change this!):**
- Valid until revoked (default) — dangerous for security
- Immediately expire → single-use rotation
- Expire if not used for N days → inactivity timeout
- Expire after N days → absolute timeout

**Key Consumer Key vs Secret:**
- Consumer Key (client_id) = public; safe in mobile apps / JS
- Consumer Secret (client_secret) = SECRET; never client-side; never in version control

**Callback URL:** exact string match; no wildcards; add ALL environments

---

## Auth Providers Quick Reference

**Auth Provider = OAuth 2.0 inbound login (Google, Facebook, Azure AD OIDC)**
**SSO Settings = SAML 2.0 inbound login (Okta SAML, ADFS, Azure AD SAML)**

**Registration Handler interface:** `Auth.RegistrationHandler`
- `createUser(portalId, data)` → new user; can return existing User to link
- `updateUser(userId, portalId, data)` → existing user; sync attributes

**Auth.UserData properties:**
- `data.identifier` = external provider's unique user ID
- `data.email` = email (may be null for some providers — check!)
- `data.attributeMap` = Map of all extra claims

**Community detection in Registration Handler:**
- `portalId != null` → community login → create community user with ContactId
- `portalId == null` → internal org login

**ThirdPartyAccountLink:** Object linking external identity to Salesforce user
- Created when `createUser()` returns an existing/new User
- On subsequent logins: `updateUser()` is called (not `createUser()`)

**Callback URL format:** `https://[domain]/services/authcallback/[URL_Suffix]`
→ Register this exactly in the social provider's app settings

---

## Session Security Quick Reference

**IP Restriction Levels (from least to most permissive):**
1. Profile Login IP Ranges → HARD BLOCK for browser login
2. Org Trusted IP Ranges → bypasses email verification only (NOT a block)
3. Connected App IP Relaxation → governs OAuth API token access

**CRITICAL DISTINCTION:**
- Profile Login IP Ranges = hard block on browser login
- Trusted IP Ranges = NO BLOCK; just bypasses email verification challenge

**Session Assurance Levels:**
- High-Assurance: TOTP authenticator, Salesforce Authenticator push, hardware key (FIDO2), passkey
- Standard: SMS, email verification

**SMS = Standard assurance (NOT high-assurance)**

**Login Hours:**
- Restricts NEW logins only
- Does NOT terminate existing sessions when hours end

**Lock session to originating IP:**
- Session invalidated if IP changes mid-session
- Bad for mobile users (WiFi → cellular)

---

## Permission Sets Quick Reference

**Hierarchy:**
- User = 1 Profile + 0-to-many PSes/PSGs
- PSG = container for multiple PSes (+ optional Muting PSes)
- Muting PS = negates permissions WITHIN its PSG only

**CRITICAL:** Muting PS only works INSIDE a PSG. Cannot mute Profile permissions. Cannot mute across PSGs.

**Session-Based PSes:**
- Assigned to user but INACTIVE by default
- Activated via `Auth.SessionManagement.activateSessionPermSet()`
- Deactivates when session expires

**Effective permissions = OR of Profile + all PSes + all PSGs (after muting)**

**Profiles control; PSes do NOT control:**
- Login IP Ranges
- Login Hours
- Page Layouts
- Record Types (directly)

---

## Delegated Administration Quick Reference

**What delegated admins CAN do:**
- Create/edit/deactivate users in their role branch scope
- Reset passwords, unlock accounts
- Assign profiles FROM the approved list
- Assign roles FROM the approved list
- Assign PSes THEY THEMSELVES HAVE

**What delegated admins CANNOT do:**
- Manage users outside their role scope
- Assign unapproved profiles (System Admin, elevated profiles)
- Manage Connected Apps, SSO Settings
- Assign PSes they don't personally have (no privilege escalation)

**Scope:** Role and Subordinates (users without roles = outside scope)

---

## SCIM & Identity Governance Quick Reference

**SCIM 2.0 Endpoint:** `https://[domain].my.salesforce.com/services/scim/v2/Users`
**Authentication:** OAuth Bearer token (JWT Bearer preferred)

**SCIM deactivation:** Sets IsActive=false; terminates browser sessions
**BUT does NOT auto-revoke OAuth tokens** (must be done explicitly)

**Deactivate vs Delete:**
- Always DEACTIVATE → preserves audit trail, record ownership, history
- DELETE = irreversible; breaks data relationships; avoid

**Freeze vs Deactivate:**
- Freeze: prevents login; still consumes license
- Deactivate: prevents login; frees license

**Login History:** retained 6 months only; queryable via SOQL (LoginHistory object)

**For >6 month retention:** Event Monitoring → export to SIEM

**MFA Identity Verification Methods:**
- High-Assurance: Salesforce Authenticator, TOTP app, hardware key (FIDO2), passkey
- Standard: SMS, email

---

## Experience Cloud Identity Quick Reference

**Community User Model:** Account → Contact → Community User (ContactId required)

**License Types (cheapest to most expensive):**
1. External Identity: SSO only; NO CRM data; no community features
2. Customer Community: Cases, custom objects, community features
3. Customer Community Plus: Customer Community + sharing rules + reporting
4. Partner Community: Full CRM (Leads, Opps); B2B partner portals

**Per-Member vs Per-Login:**
- Per-Member = monthly fee per user; good for frequent users
- Per-Login = fee per login event; good for infrequent users (monthly or less)

**Data Access:**
- Sharing Sets: grant access where record field matches user's Account/Contact
- Share Groups: make portal-user-owned records visible to internal users

**Self-Registration Handler:** `Site.RegistrationHandler.createPersonAccountOrContact()` → returns Contact Id

**Auth Provider for communities:**
- `portalId != null` → community login → create user with ContactId
- `portalId == null` → internal login

**External Identity:** CANNOT access any Salesforce objects (not even custom)

---

## My Domain Quick Reference

**My Domain is REQUIRED before:**
- Configuring SSO Settings (SAML)
- Deploying Lightning apps
- Using Auth Providers for login

**My Domain URL format:** `https://[subdomain].my.salesforce.com`
**After Enhanced Domains:** `https://[subdomain].my.salesforce.com` (instance URLs deprecated)

**Authentication Configuration:** controls what auth methods appear on the login page
- Can enable/disable: Standard login, SSO options, Auth Provider buttons

---

## Decision Tree: Authentication Scenario → Solution

| Scenario | Solution |
|---|---|
| Employee SSO from Active Directory | SAML SSO Settings (SF as SP; AD/Okta as IdP) |
| Employee SSO from Azure AD via OIDC | Auth Provider (Open ID Connect type) |
| "Login with Google" on community | Auth Provider (Google type) + Registration Handler |
| Mobile app API access | Authorization Code + PKCE Connected App |
| Nightly batch integration, no password | JWT Bearer Token flow |
| IoT device, no browser | Device Flow |
| Legacy username-password API (avoid) | ROPC (migrate away from this) |
| External users, SSO only, no CRM data | External Identity license |
| External customers with support cases | Customer Community license |
| Channel partner managing deals | Partner Community license |
| Step-up auth for sensitive data | Session-Based Permission Set + Login Flow |
| Auto-provision users from AD | SCIM from Azure AD / Okta → Salesforce |
| Revoke ALL tokens for a compromised app | Connected Apps OAuth Usage > Block |

---

## The Most Common Exam Traps — Final Review

1. **Trusted IP ≠ hard block** → Profile Login IP Ranges = hard block
2. **OAuth ≠ authentication** → OAuth is authorization; OIDC adds authentication
3. **JWT Bearer = no refresh token** → re-assert on demand
4. **Implicit flow is deprecated** → use Authorization Code + PKCE
5. **JIT cannot deprovision** → only fires on login
6. **SMS = Standard assurance** → not high-assurance
7. **Login Hours = no session termination** → only blocks new logins
8. **SCIM deactivation ≠ token revocation** → must revoke OAuth tokens separately
9. **Muting PS = PSG-scoped** → cannot mute Profile permissions
10. **External Identity = no CRM objects** → not even custom objects
11. **Community user requires ContactId** → no Contact = cannot be a community user
12. **`full` scope ≠ admin access** → constrained by user's actual permissions
13. **Admin Approved PS = PS assignment required** → even for JWT Bearer sub user
14. **`id_token` ≠ API token** → id_token for identity; access_token for API
15. **My Domain = SSO prerequisite** → cannot configure SSO without My Domain
16. **Customer Community ≠ Lead/Opp access** → Partner Community needed for those
17. **Delete ≠ Deactivate** → always deactivate departing users
18. **Login History = 6 months only** → SIEM for longer retention
19. **Callback URL = exact match** → no wildcards, no trailing slash tolerance
20. **Consumer Key = public; Consumer Secret = private** → key safe in mobile; secret never client-side
