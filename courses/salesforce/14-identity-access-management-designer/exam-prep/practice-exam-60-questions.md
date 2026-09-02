# Salesforce Identity & Access Management Designer (CRT-405)
# Practice Exam — 50 Scenario-Based Questions

**Exam weight distribution:**
- Authentication & Authorization + Federation/SSO: 44% (~22 questions)
- Connected Apps & OAuth: 17% (~9 questions)
- Identity Concepts: 17% (~9 questions)
- Communities/Experience Cloud: 12% (~6 questions)
- Governance & Administration: 10% (~4 questions)

---

## SECTION 1: Authentication, Authorization, Federation & SSO (Questions 1–22)

---

**Question 1**
A company wants employees to log into Salesforce using Active Directory credentials. Salesforce must NOT store passwords. What should the architect implement?

A. Delegated Authentication with Salesforce as the identity provider
B. SAML SSO with Active Directory as the IdP and Salesforce as the SP
C. OAuth 2.0 Username-Password flow connecting to Active Directory
D. A custom login flow that validates credentials against Active Directory via callout

**Answer: B**
**Explanation:** SAML SSO with AD as the IdP means credentials live only in AD. Salesforce receives a signed SAML assertion and grants access without ever handling a password. Salesforce acts as the Service Provider (SP) and trusts assertions issued by the registered IdP.

**Why the others are wrong:**
- A: In Delegated Authentication, the user submits credentials to Salesforce first; Salesforce then sends them to the external endpoint — passwords still transit Salesforce
- C: The Username-Password OAuth grant sends credentials in the HTTP body and is explicitly deprecated for security reasons
- D: A custom callout login flow still requires credentials to be entered at Salesforce before being forwarded — same anti-pattern as Delegated Auth

---

**Question 2**
A company uses SAML SSO. End users navigate directly to https://mycompany.my.salesforce.com and click "Log in with SSO." Which flow is triggered?

A. IdP-initiated SSO — the IdP sends an unsolicited SAML Response
B. SP-initiated SSO — Salesforce sends an AuthnRequest to the IdP
C. OAuth 2.0 Authorization Code flow initiated by Salesforce
D. JIT provisioning flow initiated by the IdP

**Answer: B**
**Explanation:** When a user starts at the SP (Salesforce) and clicks the SSO button, Salesforce generates a SAML AuthnRequest and redirects the browser to the IdP. This is SP-initiated flow. The SP-initiated flow always begins with an AuthnRequest XML document signed by the SP.

**Why the others are wrong:**
- A: IdP-initiated means the user starts at the IdP portal, clicks a tile, and the IdP posts an unsolicited SAML Response directly to Salesforce — no AuthnRequest is sent
- C: OAuth Authorization Code is a distinct protocol and does not involve SAML AuthnRequest messages
- D: JIT provisioning is not a separate flow; it is an optional step that occurs during any SAML login when the user record doesn't exist yet

---

**Question 3**
A SAML IdP-initiated SSO flow fails with "We can't log you in because of an issue with the single sign-on configuration." The Salesforce admin finds that the SAML assertion is valid and the user exists. What is the most likely cause?

A. My Domain is not enabled on the Salesforce org
B. The IdP certificate stored in Salesforce is expired
C. The SP-initiated SSO setting is disabled on the SSO configuration
D. The SAML assertion contains a Subject NameID that does not match any Salesforce user's Federation ID or username

**Answer: D**
**Explanation:** Even a cryptographically valid assertion will fail to log in a user if the NameID cannot be correlated to a Salesforce user. Salesforce attempts to match the NameID value against the Federation ID field (or username, depending on configuration). A mismatch causes a silent authentication failure.

**Why the others are wrong:**
- A: My Domain is required for SP-initiated SSO; IdP-initiated SSO can technically function without it, though My Domain is best practice
- B: An expired certificate would produce a signature validation error, not a user-matching failure
- C: The "SP-initiated" toggle affects only SP-initiated flows; IdP-initiated flows are unaffected by that setting

---

**Question 4**
A new employee is hired and their account must be created in Salesforce automatically the first time they log in via SAML SSO. The SAML assertion contains the employee's email, first name, last name, and department. What should the architect configure?

A. Provisioning via SCIM so the IdP pushes user records before the first login
B. Just-in-Time (JIT) provisioning using attribute mapping in the SSO configuration
C. A registration handler Apex class on the connected app
D. An outbound message from the IdP to a Salesforce REST API endpoint on login

**Answer: B**
**Explanation:** JIT provisioning, configured within the SAML SSO settings, automatically creates or updates Salesforce user records when a valid assertion is received for a user who does not yet exist. Custom attribute mappings translate assertion attributes (email, first name, etc.) directly into Salesforce User fields.

**Why the others are wrong:**
- A: SCIM is a separate provisioning protocol that runs independently of login events; it would work but is not the SAML-native solution described
- C: Registration handlers are used with OAuth/social login via Auth. Providers, not SAML JIT
- D: There is no native mechanism for an IdP to call Salesforce REST API at login; this is a custom architecture that isn't part of the SAML spec

---

**Question 5**
During SAML JIT provisioning, an attribute statement maps "department" to a standard User field. After login, the user's Department field in Salesforce remains blank even though the assertion contains the correct value. What is the most likely cause?

A. JIT provisioning only updates standard fields; custom fields require a custom JIT handler
B. The attribute name in the SSO configuration does not exactly match the attribute name sent in the SAML assertion (case-sensitive)
C. The user already existed in Salesforce, and JIT only creates — it does not update existing users
D. The IdP must use a NameFormat of urn:oasis:names:tc:SAML:2.0:attrname-format:uri for mapping to work

**Answer: B**
**Explanation:** Attribute name matching between the SSO configuration and the assertion is case-sensitive and must be exact. A mismatch of even one character causes the mapping to be silently skipped, leaving the field empty.

**Why the others are wrong:**
- A: Standard JIT attribute mapping supports both standard and custom User fields without a custom handler
- C: By default, JIT provisioning both creates and updates user records; the "update on every login" behavior is the default
- D: While NameFormat affects how attribute names are interpreted, the primary cause of silent mapping failure is a literal string mismatch, not the format URI

---

**Question 6**
A large enterprise wants SSO but cannot modify its on-premise IdP to support SAML. The IdP exposes a REST endpoint that accepts a username and password and returns a boolean. What Salesforce feature should the architect implement?

A. Social Sign-On with a custom Auth. Provider
B. Delegated Authentication
C. SAML SP-initiated SSO with a proxy IdP
D. OAuth 2.0 Resource Owner Password Credentials grant

**Answer: B**
**Explanation:** Delegated Authentication allows Salesforce to call an external web service (any protocol the customer controls) to validate credentials. Salesforce sends the username and password to the configured endpoint; if the endpoint returns success, Salesforce grants access. This is the correct fit when the external system does not support SAML or OAuth.

**Why the others are wrong:**
- A: Auth. Provider-based social SSO requires the external system to support OAuth or OIDC, not a simple boolean REST endpoint
- C: A proxy IdP is a valid architecture but requires significant IdP infrastructure changes, which the question states cannot happen
- D: The Resource Owner Password grant is an OAuth pattern between a client and an OAuth authorization server — it does not describe Salesforce calling an arbitrary REST boolean endpoint

---

**Question 7**
A Salesforce admin enables SAML SSO with a third-party IdP. Internal users report that they can log in fine, but external partners who access a custom Salesforce URL are redirected to the wrong login page. What configuration is most likely missing?

A. My Domain custom login page policy must be set to "Redirect to Identity Provider"
B. A separate SSO configuration must exist for each user profile
C. The Connected App must have "IP Relaxation" set to "Relax IP restrictions"
D. My Domain has not been deployed to all users

**Answer: D**
**Explanation:** Until My Domain is deployed to all users (not just enabled), some login paths — especially custom URLs and embedded Visualforce — still point to the legacy login.salesforce.com, which bypasses My Domain's login policy and SSO redirects.

**Why the others are wrong:**
- A: "Redirect to Identity Provider" is a My Domain login policy option, but it only takes effect after My Domain is deployed to all users
- B: SSO configurations can be scoped to specific profiles, but the symptom describes redirection to the wrong page, not an authorization failure
- C: IP Relaxation is a connected app OAuth setting unrelated to SAML redirect behavior

---

**Question 8**
An organization uses SP-initiated SAML SSO. Security wants to ensure that even authenticated users must re-authenticate when accessing a highly sensitive custom app. What should the architect configure?

A. A Connected App with "High Assurance" session level required, and a session policy that does not allow standard sessions to satisfy high-assurance requirements
B. A login flow that triggers a second username/password prompt for the specific app
C. Set the profile's session timeout to a very short duration for sensitive app users
D. Enable Multi-Factor Authentication for all logins org-wide via Setup

**Answer: A**
**Explanation:** Salesforce session security levels allow a connected app to require a "High Assurance" session. If the current session was created via a method that only grants a "Standard" level (e.g., username/password without MFA), Salesforce will block access to the app and can redirect the user through a step-up authentication. This is the correct per-app enforcement mechanism.

**Why the others are wrong:**
- B: A login flow that prompts for username/password again is a valid technique but not the recommended platform-native approach; session security levels achieve this without a custom flow
- C: Shortening the session timeout affects all users on that profile for all apps, not just the sensitive app
- D: Org-wide MFA enforcement raises the floor for all sessions but does not enforce step-up re-authentication for specific apps during an existing session

---

**Question 9**
A Salesforce architect needs to configure an org so that users who log in with SAML SSO receive a High Assurance session, while users who log in with username/password receive a Standard session. Which combination achieves this?

A. Create two login flows — one for SAML and one for password — each setting a custom session variable
B. Configure the SAML SSO Setting with Session Security Level = High Assurance; the username/password method defaults to Standard
C. Set the org-wide session security level to High Assurance and exclude the password login method
D. Use a permission set to assign High Assurance sessions only to users whose last login was via SSO

**Answer: B**
**Explanation:** Each authentication method in Salesforce can be assigned a session security level. By setting the SAML SSO configuration's session level to High Assurance, any login via that SAML method creates a High Assurance session. Username/password logins default to Standard unless otherwise configured.

**Why the others are wrong:**
- A: Login flows do not expose a supported API to set session security level; session level is driven by the authentication method configuration
- C: There is no org-wide override that excludes specific methods; the setting is per authentication method
- D: Permission sets control feature and object access, not session security levels

---

**Question 10**
A company implements a mobile app that uses OAuth to access Salesforce. The app is a public client (no way to securely store a client secret). Which OAuth flow is most appropriate?

A. Web Server flow (Authorization Code) without PKCE
B. Authorization Code flow with PKCE (Proof Key for Code Exchange)
C. Client Credentials flow with a client secret
D. JWT Bearer flow with a certificate-backed connected app

**Answer: B**
**Explanation:** PKCE (Proof Key for Code Exchange) was designed specifically for public clients — mobile and native apps — where a client secret cannot be stored safely. PKCE replaces the secret with a dynamically generated code verifier/challenge pair, preventing authorization code interception attacks.

**Why the others are wrong:**
- A: Authorization Code without PKCE requires a client secret to exchange the code for tokens; without it the flow is vulnerable to code interception
- C: Client Credentials requires a client secret stored in the app, which is insecure for mobile public clients
- D: JWT Bearer requires a private key to sign assertions; while a key can be stored in the mobile device keychain it is more complex and not the standard recommendation for interactive mobile logins

---

**Question 11**
A server-to-server integration needs to call Salesforce APIs nightly without any user interaction. The integration cannot store a username or password. What OAuth flow should be used?

A. Authorization Code (Web Server) flow with offline access scope
B. Device flow, polling until the user approves
C. JWT Bearer (OAuth 2.0 JWT Bearer Token flow) using a certificate
D. SAML Bearer Assertion flow using an IdP-signed assertion

**Answer: C**
**Explanation:** The JWT Bearer flow is designed for server-to-server (machine-to-machine) integrations. The client signs a JWT with a private key, posts it to Salesforce's token endpoint, and receives an access token — no user interaction, no stored password. The connected app must be pre-authorized for the integration user.

**Why the others are wrong:**
- A: Web Server flow requires a browser redirect and user consent on first use; it is not headless
- B: Device flow is for input-constrained devices that still require eventual user approval — not fully automated
- D: The SAML Bearer flow is valid for headless integrations but requires a full IdP and is less commonly supported than JWT Bearer

---

**Question 12**
A connected app is configured with the OAuth 2.0 Client Credentials flow. Which user's permissions are applied when the connected app calls Salesforce APIs?

A. The permissions of the user who last authorized the connected app
B. The permissions of the "Run As" user configured on the connected app
C. System-level (admin) permissions because Client Credentials bypasses user context
D. The permissions of the connected app owner (the user who created it)

**Answer: B**
**Explanation:** Client Credentials flow in Salesforce requires a specific "Run As" user to be designated on the connected app. All API calls made via Client Credentials tokens execute with the permissions of that designated user. This is how Salesforce enforces data-level security in headless integrations.

**Why the others are wrong:**
- A: There is no "last authorizing user" concept in Client Credentials; no interactive authorization occurs
- C: Client Credentials does not grant admin or system-level bypass; it is bound to the Run As user's profile and permission sets
- D: The connected app owner is irrelevant to runtime API call permissions

---

**Question 13**
A connected app uses the Web Server (Authorization Code) OAuth flow. The refresh token issued to a user should expire after 12 hours of inactivity and absolutely never after 30 days regardless of activity. Which connected app OAuth policies achieve this?

A. Refresh Token Policy: "Expire refresh token if not used for 12 hours"; Refresh Token Validity: 30 days
B. Refresh Token Policy: "Immediately expire refresh token"; Token Valid for: 12 hours
C. Refresh Token Policy: "Expire refresh token if not used for 12 hours" AND "Expire refresh token after 30 days"
D. Set the session timeout to 12 hours and enable "Force re-login after session timeout"

**Answer: C**
**Explanation:** Salesforce connected app OAuth policies allow both an inactivity expiration and an absolute maximum lifetime to be configured simultaneously. Setting both "expire if not used for 12 hours" and "expire after 30 days" gives the desired dual constraint: inactivity kills the token and it hard-expires at 30 days regardless.

**Why the others are wrong:**
- A: This sets only one constraint (inactivity); the 30-day validity is the absolute maximum but the question requires a 30-day hard cap combined with the inactivity rule
- B: "Immediately expire" revokes the refresh token after a single use, which is far more restrictive than intended
- D: Session timeout affects the access token/session, not the OAuth refresh token lifecycle

---

**Question 14**
A user authenticates via SAML SSO and receives a Salesforce session. Twenty minutes later, they open a connected app that requires High Assurance. They are blocked. What should the architect recommend to allow the user to seamlessly satisfy the High Assurance requirement?

A. Re-issue a new SAML assertion from the IdP with a high-assurance attribute
B. Configure the SAML SSO method's session security level to High Assurance, and ensure the connected app's required level matches
C. Enable "Raise session level" in the connected app and add an MFA step-up login flow
D. Grant the user a permission set that bypasses session security level checking

**Answer: B**
**Explanation:** The cleanest solution is to ensure the authentication method itself grants a High Assurance session at login time. If the SAML method is configured for High Assurance and the connected app also requires High Assurance, users who logged in via SSO will already hold the required session level and won't be blocked.

**Why the others are wrong:**
- A: SAML assertions cannot carry session security level upgrades mid-session; Salesforce session levels are assigned at authentication time by the configured method, not by assertion attributes
- C: This is a valid but more complex approach for cases where the authentication method cannot be changed; it requires a custom login flow
- D: No such permission set capability exists; session security levels are platform-enforced

---

**Question 15**
An architect is configuring Salesforce as a SAML Identity Provider (IdP) so that users can SSO into a third-party SaaS application. Which Salesforce feature enables this?

A. Salesforce as a Service Provider (SP) in the SSO Settings
B. Salesforce Identity as an IdP using the Identity Provider setup page and Outbound SSO
C. A Connected App configured as a SAML-enabled app with Salesforce as the issuing IdP
D. An Auth. Provider pointing to the third-party SaaS as an OAuth endpoint

**Answer: C**
**Explanation:** When Salesforce acts as an IdP for an external SP, the architect creates a Connected App in Salesforce with SAML enabled. Salesforce issues SAML assertions destined for the external app. The third-party app is configured to trust assertions from Salesforce's IdP metadata.

**Why the others are wrong:**
- A: The SSO Settings page is used when Salesforce is the SP consuming assertions from an external IdP — the opposite direction
- B: "Outbound SSO" is not a distinct Salesforce feature name; the correct mechanism is the Connected App SAML configuration
- D: Auth. Providers are used when Salesforce is consuming OAuth tokens from an external IdP, not issuing SAML assertions

---

**Question 16**
A company recently enabled SAML SSO. Before SSO, their IdP must direct the browser to post the SAML Response to Salesforce. What is the correct Assertion Consumer Service (ACS) URL format for a My Domain-enabled org?

A. https://login.salesforce.com/services/oauth2/token
B. https://login.salesforce.com/?saml=idpinit
C. https://[mydomain].my.salesforce.com/
D. https://[mydomain].my.salesforce.com?so=[OrgID]

**Answer: C**
**Explanation:** For a My Domain-enabled org, the ACS URL (where the IdP POSTs the SAML Response) is the My Domain login URL itself — https://[mydomain].my.salesforce.com/. Salesforce parses the SAMLResponse parameter at that endpoint. The exact URL is available in the SSO configuration's "Salesforce Login URL" field.

**Why the others are wrong:**
- A: This is the OAuth token endpoint, not the SAML ACS URL
- B: login.salesforce.com is the legacy URL; for My Domain orgs the ACS URL uses the My Domain hostname
- D: The `?so=` parameter format was used in older Salesforce sandbox ACS URLs; the preferred format does not require this query string

---

**Question 17**
A company uses Salesforce as an OAuth Authorization Server. A third-party app exchanges an authorization code for an access token. The developer notices that the access token expires after 2 hours. They want the app to maintain access for 90 days without re-prompting the user. What must be configured?

A. Set the connected app's access token validity to 90 days
B. Request the "refresh_token" (or "offline_access") scope and implement token refresh logic using the refresh token
C. Use the Client Credentials flow instead, which issues non-expiring tokens
D. Set the org-wide session timeout to 90 days

**Answer: B**
**Explanation:** Access tokens in Salesforce are short-lived by design. The proper pattern for long-lived access is to request the refresh_token scope during authorization, store the refresh token securely, and exchange it for a new access token when the current one expires. This avoids re-prompting the user while keeping access tokens short-lived.

**Why the others are wrong:**
- A: The connected app's "access token validity" controls the access token lifetime, but best practice keeps this short; long access token lifetimes are a security risk
- C: Client Credentials tokens are also short-lived; the flow does not issue non-expiring tokens
- D: The org session timeout affects UI sessions, not programmatic OAuth access token lifetimes

---

**Question 18**
A Salesforce org is configured with SAML SSO. A user tries SP-initiated login and receives a "Failed to decrypt SAML assertion" error. What is the most likely cause?

A. The IdP is sending an unencrypted assertion but Salesforce expects encryption
B. Salesforce's certificate (used for assertion encryption) has been regenerated or replaced and the new certificate has not been uploaded to the IdP
C. The user's Federation ID is missing from their Salesforce profile
D. The IdP is not listed as a trusted IP range in Salesforce

**Answer: B**
**Explanation:** When SAML assertion encryption is enabled, the IdP encrypts the assertion using Salesforce's public certificate. If that certificate has been regenerated (e.g., after expiry) but the new certificate's public key hasn't been shared with the IdP, the IdP encrypts with the old key, and Salesforce (holding only the new private key) cannot decrypt — causing this exact error.

**Why the others are wrong:**
- A: If Salesforce expects encryption but receives plaintext, the error would be "assertion not encrypted" or similar, not a decryption failure
- C: Federation ID is used for user matching after successful assertion decryption; a missing Federation ID causes a user-matching error, not decryption failure
- D: IdP IP ranges are not part of SAML assertion decryption; this setting is irrelevant to cryptographic operations

---

**Question 19**
An organization wants to allow users to log into Salesforce using their Google Workspace accounts. No custom user mapping logic is needed. Users exist in both Google and Salesforce with matching email addresses. What is the recommended implementation?

A. SAML SSO with Google as the IdP using the Google SAML app template
B. An Auth. Provider configured for Google with a custom registration handler that performs user lookup by email
C. An Auth. Provider configured for Google using the built-in Google provider type; set "Link to the user whose username matches" to the email attribute from Google
D. Delegated Authentication endpoint that calls the Google Identity API

**Answer: C**
**Explanation:** Salesforce provides a built-in Google Auth. Provider type. When users' Salesforce usernames match their Google email addresses, the standard "Match by username" configuration in the Auth. Provider handles the mapping with no custom code. This is the simplest, most maintainable approach.

**Why the others are wrong:**
- A: SAML with Google Workspace as IdP also works, but the question specifies social SSO via Google accounts (OAuth/OIDC), and SAML setup is more complex for this use case
- B: A custom registration handler is necessary only when standard matching logic is insufficient; for email-to-username matching, no custom Apex is needed
- D: Delegated Auth requires credentials to pass through Salesforce, which is not how Google OAuth works and is an anti-pattern

---

**Question 20**
A developer configures an Auth. Provider in Salesforce for social login. Testing reveals that when a completely new user (no matching Salesforce account) attempts to log in, they are denied with no error message. What is the cause?

A. The Auth. Provider does not have "Allow Existing Users to Connect to the Auth. Provider" enabled
B. The registration handler's createUser method is returning null instead of a new User object
C. My Domain is not enabled, blocking external OAuth redirects
D. The Auth. Provider is missing the Consumer Key (client ID) from the external identity system

**Answer: B**
**Explanation:** When a registration handler's createUser method returns null, Salesforce interprets this as an explicit denial of access for the new user. The login attempt is silently rejected with no visible error to the end user. The handler must return a valid (and typically inserted) User object to permit access.

**Why the others are wrong:**
- A: "Allow Existing Users to Connect" controls account linking for returning users, not new user creation
- C: My Domain is required for Auth. Provider login redirects to work, but if it were missing the user would get a configuration error, not a silent denial
- D: A missing Consumer Key would cause an OAuth error at the external provider level, not a silent denial during the registration handler phase

---

**Question 21**
A company requires that all Salesforce users complete MFA at every login, including SSO users who authenticate via a corporate IdP. What is the correct architectural approach?

A. Enable "Require MFA" in Salesforce org-wide settings, which intercepts all logins including SSO and prompts for Salesforce Authenticator
B. Configure the IdP to perform MFA before issuing the SAML assertion, and set the SAML session security level to High Assurance in Salesforce
C. Add a login flow to every profile that triggers Salesforce Authenticator after SAML authentication
D. Both B and C are valid; the choice depends on where MFA infrastructure is managed

**Answer: D**
**Explanation:** Both approaches satisfy the requirement. If the IdP handles MFA (option B), Salesforce trusts the assertion and the High Assurance session level confirms MFA was completed. If MFA is managed in Salesforce (option C), a login flow adds an Authenticator step after SAML assertion validation. The correct choice depends on whether the enterprise wants centralized IdP-managed MFA or Salesforce-managed MFA.

**Why the others are wrong:**
- A: Enabling org-wide MFA with the "require" setting does apply to SSO users, but it forces Salesforce Authenticator as the second factor — this conflicts with companies whose IdP already performs MFA and would result in double MFA prompts
- B alone is not always correct if the IdP lacks MFA capability
- C alone is not always correct if the IdP already enforces MFA, making a second Salesforce step redundant

---

**Question 22**
A Salesforce org has three SSO configurations: one for employees (Okta), one for partners (Azure AD), and one for contractors (Ping Identity). An employee's My Domain URL is the same for all three. How does Salesforce route the user to the correct IdP?

A. Salesforce automatically detects the IdP based on the user's email domain
B. Salesforce displays a login page where the user selects the correct SSO option; each SSO configuration appears as a button
C. Each user population must use a separate Salesforce org with its own My Domain
D. The admin assigns a specific SSO configuration to each user's profile via the "Single Sign-On Settings" field

**Answer: D**
**Explanation:** Salesforce SSO configurations are assigned at the profile level (or can be presented as login page options). When the correct SSO configuration is linked to a profile, users on that profile are automatically directed to the right IdP. Admins map each SSO config to the relevant profiles (Employees → Okta profile, Partners → Azure AD profile, etc.).

**Why the others are wrong:**
- A: Salesforce does not auto-detect IdPs from email domains natively; that requires custom logic or IdP-side routing
- B: This is partially true (My Domain login page can show multiple SSO buttons), but the routing is configured via profile assignment, not just button display
- C: Multiple user populations can coexist in one org using profile-level SSO configuration mapping

---

## SECTION 2: Connected Apps & OAuth (Questions 23–31)

---

**Question 23**
A connected app must allow API access but only from the company's corporate network (IP range 203.0.113.0/24). The connected app should refuse tokens for users connecting from other IPs. Which configuration achieves this?

A. Set "IP Relaxation" to "Enforce IP restrictions" on the connected app, and configure the allowed IP range in the connected app's OAuth IP settings
B. Configure Trusted IP Ranges in the org-wide Network Access settings
C. Set "IP Relaxation" to "Relax IP restrictions" so that the user's profile IP restrictions are enforced
D. Add a custom scope to the connected app that validates IP at runtime

**Answer: A**
**Explanation:** Connected apps have a dedicated IP Relaxation setting. When set to "Enforce IP restrictions," access is limited to the IP ranges defined on the connected app itself, providing app-specific network control independent of org-wide or profile settings.

**Why the others are wrong:**
- B: Org-wide trusted IP ranges control login access from the browser, not OAuth token requests from applications; they apply to UI sessions
- C: "Relax IP restrictions" does the opposite — it loosens restrictions by deferring to the user's profile settings, not enforcing a specific range
- D: OAuth scopes are about data access permissions, not network-level IP enforcement

---

**Question 24**
A developer builds an internal employee app using OAuth Authorization Code flow. The app should access Salesforce data on behalf of the logged-in user. After authorization, the app stores the refresh token. Six months later, the user is disabled in Salesforce. What happens when the app attempts to use the stored refresh token?

A. The refresh token exchange succeeds because OAuth tokens are independent of user account status
B. The refresh token exchange fails because Salesforce revokes all tokens associated with disabled users
C. The refresh token becomes invalid only after the token's natural expiration date
D. The connected app's "Run As" user takes over, and the exchange succeeds under that user context

**Answer: B**
**Explanation:** When a Salesforce user is deactivated, all active sessions and associated OAuth tokens (including refresh tokens) are immediately invalidated. Any attempt to use a refresh token belonging to a deactivated user will return a token error, forcing re-authorization — which also fails because the user cannot log in.

**Why the others are wrong:**
- A: Salesforce explicitly ties token validity to user account status; deactivation is an immediate revocation event
- C: Natural expiration only applies to active users; deactivation overrides the expiration date
- D: "Run As" user is specific to the Client Credentials flow; Authorization Code flow tokens are bound to the authorizing user

---

**Question 25**
An architect reviews a connected app and notices it has the scope "full" enabled. Security review flags this as a risk. What does the "full" scope grant, and what is the recommended alternative?

A. "full" grants access to all Salesforce objects; replace it with specific object-level scopes per the principle of least privilege
B. "full" grants the same access as the user's profile and permission sets, including API; replace it with narrower scopes like "api", "web", or custom scopes
C. "full" grants system administrator access regardless of the user's profile; there is no equivalent narrower scope
D. "full" includes "refresh_token" scope; remove it and use short-lived access tokens only

**Answer: B**
**Explanation:** The "full" scope grants the connected app the same data access as the user's profile and permission sets, plus the ability to manage user data and perform any action available to that user. The recommended alternative is to specify only the minimum necessary scopes (e.g., "api" for API access, "web" for web access, "id" for identity) to limit the app's footprint.

**Why the others are wrong:**
- A: Salesforce OAuth scopes are not object-level; they are capability-level (api, web, chatter_api, etc.)
- C: "full" is bounded by the user's actual permissions; it does not grant admin access to a non-admin user
- D: "full" does not inherently include "refresh_token"; that must be requested separately

---

**Question 26**
A connected app is configured with "Permitted Users: Admin-approved users are pre-authorized" and "IP Relaxation: Relax IP restrictions." A user not assigned to any approved profile tries to use the app. What happens?

A. The user is prompted to authorize the app on first use, and the token is granted
B. The user receives an error indicating they are not authorized to use the connected app
C. The app falls back to the Client Credentials flow using the Run As user
D. The user is redirected to the Salesforce admin to request access

**Answer: B**
**Explanation:** When a connected app is set to "Admin-approved users are pre-authorized," only users on the explicitly approved profiles or permission sets can authorize the app. Any other user attempting OAuth authorization will receive an access denied error. This is a security control for sensitive integrations.

**Why the others are wrong:**
- A: "Admin-approved" specifically prevents self-service authorization; users not on an approved profile cannot authorize regardless of their consent
- C: The connected app's flow type does not change based on authorization failure; there is no automatic fallback to Client Credentials
- D: Salesforce does not have a built-in access request workflow; the user would simply receive an error

---

**Question 27**
A connected app uses OAuth and is configured with the scope "api refresh_token." The admin wants to prevent users from storing long-lived refresh tokens. Which policy should they configure?

A. Set "Refresh Token Policy" to "Immediately expire refresh token"
B. Remove "refresh_token" from the allowed scopes, forcing re-authorization on every access token expiration
C. Set the access token lifetime to match the desired long-term period (e.g., 30 days)
D. Enable "Require Secret for Web Server Flow" to prevent silent token refresh

**Answer: B**
**Explanation:** If the "refresh_token" scope is not granted, Salesforce will not issue a refresh token during the OAuth exchange. The application will need to re-run the authorization flow when the access token expires. This prevents any long-lived token from being stored on the client side.

**Why the others are wrong:**
- A: "Immediately expire refresh token" means the refresh token is single-use (revoked after first use to get a new access token), not that it is never issued — this is more about rotation policy than prevention
- C: Extending access token lifetime is the opposite of the goal; it does not prevent long-lived token storage
- D: "Require Secret for Web Server Flow" is a client authentication control, not a token issuance scope control

---

**Question 28**
A Salesforce admin creates a connected app. Which statement about the connected app's Consumer Key and Consumer Secret is correct?

A. The Consumer Key uniquely identifies the app; the Consumer Secret must be included in every OAuth request
B. The Consumer Key uniquely identifies the app to Salesforce; the Consumer Secret is used to authenticate the app (client) to Salesforce and should be stored securely, never in client-side code
C. Both the Consumer Key and Consumer Secret should be included in the browser redirect URL for Authorization Code flows
D. The Consumer Secret can be regenerated at any time with no impact to existing tokens

**Answer: B**
**Explanation:** The Consumer Key (client ID) is public-facing and identifies the app. The Consumer Secret (client secret) is a shared secret that proves the identity of the application server to Salesforce. It must never be exposed in client-side JavaScript, mobile app code, or URLs — only used in server-to-server token exchange calls.

**Why the others are wrong:**
- A: Not every OAuth request requires the secret; public client flows (PKCE) do not use a secret at all
- C: Including the Consumer Secret in a browser redirect URL exposes it to the browser history, logs, and interception — this is a critical security violation
- D: Regenerating the Consumer Secret immediately invalidates the old secret, breaking all integrations using it until they are updated

---

**Question 29**
A developer uses the Salesforce OAuth 2.0 Authorization Code flow and receives the following error after the redirect back from Salesforce: "error=redirect_uri_mismatch." What is the cause?

A. The user denied the authorization request on the Salesforce authorization page
B. The redirect_uri in the OAuth request does not exactly match any of the callback URLs registered in the connected app
C. The authorization code expired before the developer's server called the token endpoint
D. The connected app is configured for a different OAuth flow type

**Answer: B**
**Explanation:** Salesforce strictly enforces that the redirect_uri in the authorization request must exactly match one of the Callback URLs registered in the connected app (including protocol, domain, port, and path). Even a trailing slash difference will cause this mismatch error. This is a required security control to prevent open redirect attacks.

**Why the others are wrong:**
- A: User denial produces "error=access_denied", not redirect_uri_mismatch
- C: An expired authorization code produces an "expired_code" or "invalid_grant" error at the token endpoint, not a mismatch during the redirect
- D: Connected apps support multiple flows; the error occurs before flow type matters

---

**Question 30**
An integration uses the Salesforce OAuth 2.0 Web Server flow. The application stores the refresh token. After 90 days, the refresh token stops working. The connected app has no explicit expiration set. What is the most likely cause?

A. All Salesforce refresh tokens expire after 90 days by default
B. The connected app's "Refresh Token Policy" is set to "Expire refresh token after 90 days"
C. The user changed their password, which invalidates all OAuth tokens issued before the password change
D. The Salesforce org's session timeout setting applies to refresh tokens

**Answer: C**
**Explanation:** By default, when a Salesforce user changes their password, all existing OAuth tokens (including refresh tokens) for that user are invalidated. This is a security measure ensuring that after a password change, previously issued tokens cannot be used to maintain unauthorized access.

**Why the others are wrong:**
- A: Salesforce does not have a universal 90-day default refresh token expiry; the default is "Refresh token is valid until revoked" unless explicitly configured otherwise
- B: This is possible if the policy was configured, but the question states no explicit expiration is set
- D: Session timeout affects UI access tokens, not OAuth refresh tokens

---

**Question 31**
A Salesforce architect needs to allow a third-party app to read Salesforce Chatter posts on behalf of users. The app should NOT be allowed to modify any data. Which OAuth scope combination is most appropriate?

A. full, chatter_api
B. chatter_api (read-only implied by the scope's permissions)
C. api (for read-only access to all APIs)
D. There is no read-only OAuth scope; data access is controlled by the user's profile

**Answer: D**
**Explanation:** Salesforce OAuth scopes (like "api" and "chatter_api") grant access at the API capability level — they do not restrict HTTP methods (GET vs POST/PATCH). Read-only enforcement is the responsibility of the Salesforce user's profile and permission sets, not the OAuth scope. The architect should ensure the user's permissions allow only read operations on Chatter objects.

**Why the others are wrong:**
- A: "full" grants all capabilities of the user's permissions, which may include write access
- B: "chatter_api" grants access to Chatter APIs but does not itself enforce read-only; write permissions depend on the user's underlying Salesforce permissions
- C: "api" grants general API access, including write operations if the user's permissions allow it

---

## SECTION 3: Identity Concepts (Questions 32–40)

---

**Question 32**
In the AAA (Authentication, Authorization, Accounting) framework, a company wants to ensure that when a Salesforce admin accesses a customer record, that access event is logged with the admin's identity, what was accessed, and when. Which AAA pillar does this describe?

A. Authentication — verifying the admin's identity
B. Authorization — controlling what the admin can access
C. Accounting (Audit) — recording who accessed what and when
D. This is an Authentication and Authorization combined concern

**Answer: C**
**Explanation:** The Accounting (also called Auditing) pillar of AAA covers the recording and logging of user activities — who accessed what resource, at what time, and from where. This supports compliance, forensic investigation, and anomaly detection. In Salesforce, this is served by features like Login History, Event Monitoring, and Field Audit Trail.

**Why the others are wrong:**
- A: Authentication is the act of verifying identity at login, not the logging of subsequent data access events
- B: Authorization controls what the admin is permitted to do; it does not record what they actually did
- D: While both A and B are prerequisites for meaningful accounting, the logging of access events is specifically the Accounting pillar

---

**Question 33**
A SAML assertion contains the following elements: Issuer, Subject, Conditions, AttributeStatement, and AuthnStatement. A Salesforce SSO configuration fails with "Issuer mismatch." What should the admin check?

A. The Subject NameID in the assertion does not match any Salesforce user
B. The Entity ID configured in the Salesforce SSO settings does not match the Issuer value in the SAML assertion
C. The SAML assertion signature is using SHA-1 instead of SHA-256
D. The assertion's Conditions element has a NotBefore time that is in the future (clock skew)

**Answer: B**
**Explanation:** The Salesforce SSO configuration includes an "Issuer" (or Entity ID of the IdP) field that must exactly match the Issuer element in the SAML assertion. Salesforce validates this as part of assertion processing to ensure the assertion came from the expected IdP. Any mismatch causes immediate rejection.

**Why the others are wrong:**
- A: Subject NameID mismatch produces a user-not-found error, not an issuer mismatch
- C: A signature algorithm mismatch produces a signature validation error, not an issuer mismatch
- D: Clock skew produces a "NotBefore" or "NotOnOrAfter" condition failure, not an issuer mismatch

---

**Question 34**
When Salesforce acts as an OAuth Identity Provider and issues an OIDC id_token, what is the primary purpose of the id_token vs. the access_token?

A. The access_token identifies the user; the id_token authorizes API calls
B. The id_token is a JWT containing claims about the authenticated user (identity); the access_token is a credential used to call protected resource APIs
C. Both tokens serve the same purpose; id_token is just a longer-lived version of the access_token
D. The id_token is issued only for mobile apps; the access_token is issued for web apps

**Answer: B**
**Explanation:** In OpenID Connect, the id_token is a signed JWT whose payload contains identity claims about the authenticated user (sub, name, email, etc.) for the client application to verify. The access_token is an opaque (or JWT) credential presented to resource servers (APIs) to authorize data access. These serve fundamentally different purposes in the protocol.

**Why the others are wrong:**
- A: The roles are reversed; the id_token is about identity, the access_token is about authorization/access
- C: They serve distinct purposes; an id_token contains verifiable identity claims while an access_token is an authorization credential — their lifetimes are independent
- D: Both token types are issued regardless of the client platform; the differentiation is purpose, not platform

---

**Question 35**
A security architect reviews Salesforce's identity architecture. They note that Salesforce can act as both an IdP and an SP simultaneously. What scenario would require this dual role?

A. Salesforce cannot act as both simultaneously; it must be configured in one role per org
B. Salesforce acts as an SP for employee logins (consuming assertions from corporate AD) while also acting as an IdP for third-party SaaS apps (issuing assertions for apps connected via Salesforce Connected App SAML)
C. Salesforce acts as both when using OAuth 2.0 flows that combine authorization and authentication
D. This requires two separate Salesforce orgs — one configured as IdP and one as SP

**Answer: B**
**Explanation:** Salesforce can simultaneously consume SAML assertions from an external IdP (acting as SP for inbound authentication) and issue SAML assertions to third-party apps via Connected App SAML configurations (acting as IdP for outbound SSO). This is a common hub-and-spoke identity architecture.

**Why the others are wrong:**
- A: Salesforce explicitly supports both roles concurrently within a single org
- C: OAuth 2.0 flows do not involve SAML assertion consumption/issuance; this describes a different protocol entirely
- D: Both roles can coexist in a single org; separate orgs are not required

---

**Question 36**
A SAML assertion's Subject element contains: `<NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">user@company.com</NameID>`. The Salesforce SSO configuration has the "SAML Identity Type" set to "Assertion contains the User's Salesforce username." The user's Salesforce username is "user@company.com.prod". What happens when the user tries to log in?

A. Login succeeds because the email address is matched against the Salesforce username field
B. Login fails because "user@company.com" does not exactly match the Salesforce username "user@company.com.prod"
C. Login succeeds if the user's email field in Salesforce contains "user@company.com"
D. Login fails because the NameID format emailAddress is incompatible with Salesforce username matching

**Answer: B**
**Explanation:** When "SAML Identity Type" is set to use the username, Salesforce performs an exact string match between the NameID value and the Salesforce username. "user@company.com" does not equal "user@company.com.prod", so the match fails. The alternative is to configure the SSO to use Federation ID and populate that field with the IdP's identifier.

**Why the others are wrong:**
- A: The match is against the username field, not the email field; even if they shared the same value, an exact match is required
- C: The email field in Salesforce is irrelevant when the identity type is set to username
- D: The NameID format is metadata about how the IdP represents the identifier; Salesforce does not reject based on format — the failure is a value mismatch, not format incompatibility

---

**Question 37**
A security team wants to prevent OAuth access tokens obtained via the Authorization Code flow from being used across different IP addresses (session binding). What feature should the architect configure?

A. Set "IP Relaxation" on the connected app to "Enforce IP Restrictions"
B. Enable "Bind OAuth tokens to IP" in the org-wide OAuth settings
C. Configure a Login Flow that validates the current IP matches the token-issuance IP at every API call
D. Use the JWT Bearer flow instead, which inherently binds tokens to the server's IP

**Answer: A**
**Explanation:** Setting "IP Relaxation" to "Enforce IP Restrictions" on the connected app means Salesforce will validate that API calls using the token come from IPs listed in either the org's trusted IP ranges or the connected app's IP ranges. Calls from unlisted IPs are rejected, effectively binding the token to known IP ranges.

**Why the others are wrong:**
- B: There is no native "bind OAuth tokens to IP" toggle in Salesforce org settings; IP enforcement is managed through connected app and network access settings
- C: Login Flows run at login time, not on every API call; they cannot intercept individual API requests
- D: JWT Bearer flow tokens are subject to the same IP relaxation settings as any other flow; they do not inherently bind to an IP

---

**Question 38**
An architect compares OpenID Connect (OIDC) and SAML 2.0. Which statement is accurate?

A. SAML uses JSON tokens; OIDC uses XML assertions
B. OIDC is built on top of OAuth 2.0 and introduces the id_token for authentication; SAML is an independent XML-based standard with its own authentication and attribute sharing protocol
C. SAML supports SSO; OIDC supports only API authorization, not authentication
D. OIDC requires a My Domain to be configured in Salesforce; SAML does not

**Answer: B**
**Explanation:** OIDC is an authentication layer built on top of OAuth 2.0, adding the id_token (a JWT with identity claims) to the OAuth authorization flow. SAML 2.0 is a separate, older XML-based standard with its own SSO protocol, assertion format, and binding types. They are independent standards with different formats and trust mechanisms.

**Why the others are wrong:**
- A: The formats are reversed — SAML uses XML assertions, OIDC/OAuth uses JSON (JWT) tokens
- C: OIDC is specifically designed for authentication (it is OpenID Connect); it provides identity alongside OAuth's authorization
- D: My Domain is recommended for both SAML and OIDC/OAuth-based SSO configurations in Salesforce; neither is uniquely dependent

---

**Question 39**
A company uses Salesforce Identity to issue OAuth tokens. The security team discovers that a compromised application is using valid access tokens to call the Salesforce API. What is the fastest way to revoke access for that specific connected app without affecting other apps or users?

A. Deactivate every user in Salesforce to invalidate all sessions
B. Revoke all OAuth tokens for the compromised connected app via Setup > Connected Apps > Manage OAuth Tokens, then rotate the Consumer Secret
C. Delete the connected app record from Salesforce
D. Change the org-wide session timeout to 1 minute to force all tokens to expire

**Answer: B**
**Explanation:** Salesforce provides an admin interface to revoke all OAuth tokens for a specific connected app without impacting other apps or user accounts. Rotating the Consumer Secret immediately invalidates any subsequent token refresh attempts for that app, fully cutting off access while other integrations continue normally.

**Why the others are wrong:**
- A: Deactivating all users is a drastic action that would cause an org-wide outage; it affects all apps and all users
- C: Deleting the connected app does revoke access but also destroys the app configuration, metadata, and any related settings — disruptive and hard to reverse
- D: Session timeout affects UI sessions; it does not forcibly expire API access tokens before their natural expiry

---

**Question 40**
A developer inspects a Salesforce-issued OIDC id_token (JWT). Which claims should they validate to ensure the token is intended for their application and has not expired?

A. "iss" (issuer) and "sub" (subject)
B. "aud" (audience) and "exp" (expiration time)
C. "jti" (JWT ID) and "iat" (issued at)
D. "nonce" and "scope"

**Answer: B**
**Explanation:** According to the OIDC specification, a consuming application (relying party) MUST validate "aud" (that the token was issued for this specific client/audience) and "exp" (that the token has not expired). Failing to validate these allows token replay attacks from other apps and acceptance of expired tokens.

**Why the others are wrong:**
- A: "iss" and "sub" should also be validated, but "iss" verifies the issuer (anti-phishing) and "sub" identifies the user — neither directly confirms the token was issued for this specific app ("aud") or is still valid ("exp")
- C: "jti" helps prevent token replay and "iat" records issuance time, but these are secondary validation concerns; "aud" and "exp" are the critical claims per the spec
- D: "nonce" is validated to prevent replay attacks in specific flows, and "scope" describes authorized capabilities — these are flow-specific, not the primary JWT validation checks

---

## SECTION 4: Communities / Experience Cloud Identity (Questions 41–46)

---

**Question 41**
A company builds a Salesforce Experience Cloud portal for external customers. They want customers to register themselves using their email address. New customer records must be automatically created as Contacts in a specific Account. What is the recommended implementation?

A. Enable self-registration in the Experience Cloud site settings and configure a default Account for new registrations
B. Write a custom registration handler Apex class implementing Auth.RegistrationHandler that creates the Contact and associates it with the correct Account
C. Enable JIT provisioning on the Experience Cloud site with a SAML assertion that contains the Account ID
D. Use the Salesforce Customer Community license's built-in Contact creation on self-registration without any configuration

**Answer: B**
**Explanation:** A custom Auth.RegistrationHandler Apex class gives full control over how new external users are created. The createUser method receives the user's profile information, allows the architect to query or create the Contact record, associate it with the correct Account, and return a fully configured User object.

**Why the others are wrong:**
- A: Self-registration with a default Account works for simple cases, but the question implies specific Account association logic that requires custom handling
- C: JIT provisioning is a SAML-specific feature; most Experience Cloud self-registration uses OAuth/social login or username/password, not SAML
- D: Customer Community licenses do support Contact creation, but the automatic Account association logic described requires customization

---

**Question 42**
An Experience Cloud site uses social login via a custom Auth. Provider. A returning customer who previously connected their social account tries to log in but receives "This user is already associated with another login." What caused this and how should it be resolved?

A. The customer created a second Salesforce account; merge the duplicate records
B. The Auth. Provider's "Existing User Linking URL" is not configured, so the system cannot match the social identity to the existing Salesforce user
C. The social identity's unique identifier changed (e.g., the social provider rotated user IDs), creating a new portal user record and conflicting with the existing one
D. The registration handler's handleAttributeChanges method needs to be updated to accept the new social identifier

**Answer: C**
**Explanation:** Some social identity providers can change or rotate user identifiers (e.g., after account merges or platform changes). When the Auth. Provider in Salesforce tries to match the new identifier to a Salesforce user record, it fails, and if a new user is created it conflicts with the existing mapped user. The resolution is to update the ThirdPartyAccountLink record to the new identifier.

**Why the others are wrong:**
- A: Duplicate records would produce a different error; "already associated" specifically points to an identifier conflict in the auth provider mapping
- B: "Existing User Linking URL" is used for first-time linking, not for returning users whose link already exists
- D: handleAttributeChanges is called for existing users on subsequent logins; it would not produce an "already associated" error on its own

---

**Question 43**
An architect is designing an Experience Cloud site for partners. Partners should authenticate using their company's IdP (Azure AD) via SAML. External users must NOT be able to use Salesforce username/password login. What should the architect configure?

A. In the Experience Cloud site's Login & Registration settings, enable SAML SSO, disable the username/password login option, and assign the SAML configuration to the site
B. Remove all passwords from partner user records via data loader
C. Set the profile of all partner users to "Login Hours: 0 hours" to block direct login
D. Enable "SSO Only" on the org-wide authentication settings

**Answer: A**
**Explanation:** Experience Cloud sites allow granular control over which login methods are available. By configuring the site to use the SAML SSO configuration and disabling the username/password option in the site's Login & Registration settings, the architect ensures partners can only authenticate via Azure AD.

**Why the others are wrong:**
- B: Removing passwords via data load is not a Salesforce-supported pattern and does not prevent users from setting new passwords via "Forgot Password"
- C: Login Hours restrict when a user can log in by time of day; they do not prevent a specific authentication method from being used
- D: There is no org-wide "SSO Only" toggle that applies universally to Experience Cloud sites without site-level configuration

---

**Question 44**
A Salesforce Experience Cloud site has an Auth. Provider configured for Facebook login. A user successfully authenticates with Facebook, but the registration handler's createUser method is called. The admin expected the user to already exist since they registered previously. What is the most likely cause?

A. The user cleared their browser cookies, so Salesforce cannot recognize the returning user
B. The ThirdPartyAccountLink record linking the user's Salesforce account to their Facebook identity was deleted
C. The user logged in on a different device, which creates a new auth session
D. Facebook rotated the user's access token, triggering a new registration flow

**Answer: B**
**Explanation:** Salesforce stores the mapping between a Salesforce user and their social identity in a ThirdPartyAccountLink record. If this record is deleted (intentionally or accidentally), Salesforce can no longer match the returning Facebook identity to the existing user, treating them as a new user and calling createUser.

**Why the others are wrong:**
- A: Browser cookies affect session persistence, not identity linking; the ThirdPartyAccountLink is a server-side database record independent of browser state
- C: Device type is irrelevant; ThirdPartyAccountLink is stored server-side and is device-independent
- D: Access tokens are short-lived and are exchanged at each login; token rotation is expected behavior and does not affect the ThirdPartyAccountLink record

---

**Question 45**
An External Identity license user attempts to access a standard Salesforce feature available to internal users, such as creating an Opportunity. They receive an insufficient privileges error. What is the cause?

A. External Identity licenses are provisioned with the wrong profile
B. External Identity licenses are designed for authentication and basic profile management only; they do not include CRM object access
C. The Experience Cloud site has not been configured to allow Opportunity access
D. External Identity licenses require an add-on to access standard Salesforce objects

**Answer: B**
**Explanation:** The External Identity (now often called "External App" or "Customer Identity") license is specifically scoped for authentication scenarios, self-service profile management, and basic community interactions. It does not include access to standard Salesforce CRM objects like Accounts (beyond basic lookup), Opportunities, Cases, etc. Accessing full CRM objects requires a Customer Community Plus or Partner Community license.

**Why the others are wrong:**
- A: Profile configuration can extend some access, but the underlying license restricts which objects can be accessed regardless of profile settings
- C: Experience Cloud site configuration controls UI visibility, but the license restriction prevents API-level access as well — it is not a site configuration issue
- D: No such add-on exists; the resolution is to upgrade to an appropriate community license tier

---

**Question 46**
A company wants to allow external community users to log in using their LinkedIn credentials. After successful OAuth with LinkedIn, a new Salesforce Contact should be created and linked to the user. What must be created in Salesforce to implement this?

A. A SAML SSO configuration pointing to LinkedIn's identity endpoint
B. An Auth. Provider configured with LinkedIn as the OAuth provider, and a custom registration handler Apex class that creates the Contact and User records
C. A connected app with LinkedIn as an external OAuth client and JIT provisioning enabled
D. A custom login flow that calls the LinkedIn API via a named credential

**Answer: B**
**Explanation:** Social login via LinkedIn requires an Auth. Provider using the OpenID Connect (or OAuth 2.0) provider type configured with LinkedIn's client credentials. A custom registration handler (implementing Auth.RegistrationHandler) handles the createUser callback to create the Contact, associate it with an Account, and return the User record to Salesforce.

**Why the others are wrong:**
- A: LinkedIn uses OAuth/OIDC, not SAML; a SAML SSO configuration cannot point to LinkedIn
- C: Connected Apps are for Salesforce acting as an OAuth server; they are not used for consuming external OAuth providers like LinkedIn
- D: Login flows run at Salesforce login time and cannot redirect to LinkedIn for OAuth; Auth. Providers handle the external OAuth redirect dance

---

## SECTION 5: Governance, MFA, and Administration (Questions 47–50)

---

**Question 47**
Salesforce announced that MFA is required for all Salesforce production logins. A company currently uses SSO via Okta for all users. An admin argues that since Okta performs MFA before issuing a SAML assertion, Salesforce's MFA requirement is already met. Is this correct?

A. No — Salesforce requires its own Salesforce Authenticator app regardless of IdP MFA
B. Yes — if the IdP enforces MFA before issuing the SAML assertion, the MFA requirement is satisfied; Salesforce honors IdP-enforced MFA as equivalent
C. No — Salesforce requires MFA to be enforced via a Salesforce login flow, not the IdP
D. It depends — Salesforce MFA is only satisfied by FIDO2 hardware keys, not TOTP apps like Okta Verify

**Answer: B**
**Explanation:** Salesforce explicitly states that if users authenticate via SSO and the IdP enforces MFA before issuing the assertion, the Salesforce MFA requirement is satisfied. The company must ensure their Okta policy genuinely requires MFA for Salesforce users, not just optionally offers it. Salesforce trusts the IdP's assertion that MFA was performed.

**Why the others are wrong:**
- A: Salesforce Authenticator is one MFA option; Salesforce does not require its proprietary app specifically — it accepts any compliant second factor applied at the IdP
- C: Login flows are one enforcement mechanism but are not the only acceptable approach; IdP-enforced MFA satisfies the requirement without a login flow
- D: Salesforce accepts multiple MFA factor types including TOTP, push notifications (Salesforce Authenticator), and security keys — it is not limited to FIDO2 hardware keys

---

**Question 48**
An organization uses SCIM to automate user provisioning from their HR system to Salesforce. A new employee is created in the HR system, and a SCIM call creates the user in Salesforce. Three months later, the employee is terminated. The HR system sets the employee's status to "inactive." What must the SCIM integration do to properly deprovision the Salesforce user?

A. Call the Salesforce SCIM /Users/{id} DELETE endpoint to remove the user record
B. Call the Salesforce SCIM /Users/{id} PATCH endpoint with `"active": false` to deactivate the user
C. Remove the user from the SCIM-managed group in the HR system, which triggers automatic Salesforce deactivation
D. Send a SCIM POST to create a new user record with a "deactivated" status attribute

**Answer: B**
**Explanation:** Salesforce's SCIM API supports user deactivation via a PATCH request to the user's SCIM endpoint with `"active": false`. This deactivates the Salesforce user (preventing login and revoking tokens) while preserving the user record and its associated audit history, reports, and ownership records. Salesforce user records are intentionally not deleted via SCIM.

**Why the others are wrong:**
- A: Salesforce does not support user deletion via the SCIM DELETE endpoint for licensed users; user records cannot be permanently deleted in Salesforce (only deactivated)
- C: Removing a user from a SCIM group may deprovision group-based licenses or permissions, but deactivation of the user account itself requires an explicit user-level update
- D: SCIM POST creates new records; there is no "deactivated" status attribute for creating users

---

**Question 49**
A company's security policy mandates that all failed login attempts from external IP addresses must generate an alert. Additionally, administrators must review all successful logins from new devices on a weekly basis. Which Salesforce features should the architect recommend?

A. Event Monitoring (Login Event Type) combined with Transaction Security Policies for real-time alerts on failed logins; Login History report for weekly new-device review
B. Enable Login Forensics and configure a workflow rule on the Login History object
C. Enable Field Audit Trail on the User object to track login IP changes
D. Configure a scheduled report on the User object filtering by LastLoginDate

**Answer: A**
**Explanation:** Event Monitoring's Login Event captures detailed login data including IP addresses and failure reasons, and Transaction Security Policies (built on Event Monitoring) enable real-time alerts and automated actions on specific login events. Login History in Setup provides a record of all logins including device/browser information for periodic review.

**Why the others are wrong:**
- B: Login Forensics is part of Event Monitoring and is valid for advanced analysis; however, workflow rules cannot be triggered on Login History (it is not a standard object that supports workflow)
- C: Field Audit Trail tracks changes to User record fields, not login events; login IP is not a User field change event
- D: LastLoginDate on the User object only records the most recent login, not a history of all logins or device information

---

**Question 50**
A compliance team requires that all Salesforce users be forced to re-verify their identity every 8 hours, regardless of activity. Which configuration satisfies this requirement?

A. Set the org-wide session timeout to 8 hours with "Force logout on session timeout" enabled
B. Set the org-wide session timeout to 8 hours; the user will be prompted to re-authenticate when the session expires
C. Configure a Transaction Security Policy that terminates sessions older than 8 hours
D. Set "Force Relogin After" to 8 hours in the session settings, which is distinct from the inactivity timeout

**Answer: B**
**Explanation:** The org-wide session timeout, when set to 8 hours, terminates the session after 8 hours of the session's creation (when absolute timeout is used, not just inactivity). The user is then required to re-authenticate, satisfying the re-verification requirement. In Salesforce session settings, the timeout can be configured as both an inactivity timeout and a hard session expiry.

**Why the others are wrong:**
- A: "Force logout on session timeout" controls what happens when the session expires — it forces a logout rather than showing a re-authentication prompt; this is a valid configuration detail but the core mechanism is the 8-hour timeout
- C: Transaction Security Policies can terminate sessions, but they are event-driven policies — not a built-in timed re-authentication enforcement; they are more appropriate for conditional enforcement, not blanket time-based rules
- D: Salesforce session settings do not have a distinct "Force Relogin After" field separate from the session timeout; the session timeout setting itself controls session lifetime

---

## Answer Key

| Q | Ans | Q | Ans | Q | Ans | Q | Ans | Q | Ans |
|---|-----|---|-----|---|-----|---|-----|---|-----|
| 1 | B | 11 | C | 21 | D | 31 | D | 41 | B |
| 2 | B | 12 | B | 22 | D | 32 | C | 42 | C |
| 3 | D | 13 | C | 23 | A | 33 | B | 43 | A |
| 4 | B | 14 | B | 24 | B | 34 | B | 44 | B |
| 5 | B | 15 | C | 25 | B | 35 | B | 45 | B |
| 6 | B | 16 | C | 26 | B | 36 | B | 46 | B |
| 7 | D | 17 | B | 27 | B | 37 | A | 47 | B |
| 8 | A | 18 | B | 28 | B | 38 | B | 48 | B |
| 9 | B | 19 | C | 29 | B | 39 | B | 49 | A |
| 10 | B | 20 | B | 30 | C | 40 | B | 50 | B |

---

## High-Yield Topic Review

**SP-initiated vs IdP-initiated:**
- SP-initiated: user starts at Salesforce → Salesforce sends AuthnRequest → IdP authenticates → IdP sends Response
- IdP-initiated: user starts at IdP portal → IdP sends unsolicited Response (no AuthnRequest)

**JIT Provisioning traps:**
- Attribute name matching is case-sensitive
- Missing Federation ID causes user-match failure, not JIT failure
- JIT both creates AND updates by default

**My Domain requirement:**
- Required for SP-initiated SSO (otherwise no login page to redirect from)
- Must be DEPLOYED (not just enabled) for all users before SSO fully works
- Required for Auth. Providers (social login) redirect handling

**Session security levels:**
- Standard: username/password, Delegated Auth
- High Assurance: SAML/OAuth methods can be configured for High Assurance, MFA satisfies High Assurance
- Connected Apps can REQUIRE High Assurance, blocking Standard-session users

**OIDC id_token vs access_token:**
- id_token: JWT with identity claims (aud, exp, sub, iss) — for the CLIENT to read
- access_token: credential for calling APIs — for the RESOURCE SERVER to accept

**Registration handler returning null = access denied (silent)**

**External Identity license:** authentication + profile only — no CRM object access

**Connected App Client Credentials:** MUST have a Run As user configured

**OAuth PKCE:** for public clients (mobile/native) that cannot store a client secret
