# Lab 01: SAML SSO Configuration — Salesforce as Service Provider

## Lab Overview

**Scenario:** Acme Corp has Okta as their corporate Identity Provider. Your task is to configure Salesforce as a SAML 2.0 Service Provider, enabling Salesforce users to log in via Okta SSO. You will also configure Just-in-Time (JIT) provisioning so users are automatically created in Salesforce on first login.

**Skills Practiced:**
- Configuring My Domain
- Setting up SAML SSO in Salesforce
- Configuring Okta (or simulating IdP configuration)
- Enabling JIT provisioning
- Testing SSO flows with SAML Validator

**Time to complete:** 60-90 minutes

**Prerequisites:**
- Salesforce Developer Edition org
- Okta Developer free account (https://developer.okta.com) OR
- SAML IdP simulator (https://samltool.io or similar)

---

## Part 1: My Domain Setup

My Domain must be configured before SSO can be activated.

### Step 1.1: Deploy My Domain

1. Navigate to **Setup > My Domain**
2. In the "Choose Your Domain Name" section, enter a subdomain: `acmecorp-dev`
3. Click **Check Availability** → if taken, try `acmecorp-dev-[your initials]`
4. Click **Register Domain**
5. Salesforce sends an email when the domain is ready (5-15 minutes)
6. Once ready, click **Log In**
7. Click **Deploy to Users**

**Verify:** Your org URL should now be `https://acmecorp-dev.my.salesforce.com`

> **Architect Note:** In production, My Domain deployment should be planned during off-peak hours. After deployment to users, users accessing the old URL (login.salesforce.com/orgId) are automatically redirected. Allow 24-48 hours for DNS propagation.

---

## Part 2: Gather Salesforce SP Metadata

Before configuring the IdP, you need Salesforce's SP metadata.

### Step 2.1: Navigate to SSO Settings

1. Go to **Setup > Identity > Single Sign-On Settings**
2. You'll see the Salesforce SP information at the top of the page:
   - **SAML Entity ID:** `https://acmecorp-dev.my.salesforce.com` (note this)
   - **Salesforce ACS URL:** `https://acmecorp-dev.my.salesforce.com/login` (note this)

3. These values must be provided to your IdP administrator to configure the Relying Party Trust / SAML App.

> **Exam Note:** The ACS URL is where the IdP POSTs the SAML Response. The Entity ID is Salesforce's unique identifier in SAML terms. Both are auto-populated based on My Domain.

---

## Part 3: Configure Okta as the IdP

*If using Okta Developer account:*

### Step 3.1: Create SAML App in Okta

1. Log in to your Okta Developer account
2. Navigate to **Applications > Applications > Create App Integration**
3. Sign-in method: **SAML 2.0** → Next
4. App name: `Salesforce Dev`
5. App logo: optional
6. Click **Next**

### Step 3.2: Configure SAML Settings in Okta

Under "SAML Settings":

| Field | Value |
|---|---|
| Single sign-on URL | `https://acmecorp-dev.my.salesforce.com/login` |
| Audience URI (SP Entity ID) | `https://acmecorp-dev.my.salesforce.com` |
| Name ID format | `EmailAddress` |
| Application username | `Email` |

**Attribute Statements** (required for JIT provisioning):

| Name | Value |
|---|---|
| `User.Email` | `user.email` |
| `User.FirstName` | `user.firstName` |
| `User.LastName` | `user.lastName` |
| `User.ProfileName` | (literal value) `Standard User` |
| `User.TimeZoneSidKey` | (literal value) `America/New_York` |
| `User.LocaleSidKey` | (literal value) `en_US` |
| `User.LanguageLocaleKey` | (literal value) `en_US` |
| `User.EmailEncodingKey` | (literal value) `UTF-8` |

Click **Next** → Finish

### Step 3.3: Download Okta IdP Metadata

1. In the Okta app you just created, go to **Sign On** tab
2. Under "SAML Signing Certificates", click **View Setup Instructions** or download the **Identity Provider Metadata** (XML file)
3. Note the following:
   - **Identity Provider Issuer**: Okta's entityID
   - **Identity Provider Single Sign-On URL**: Okta's SSO endpoint
   - **X.509 Certificate**: Okta's signing certificate (copy/download)

---

## Part 4: Configure SSO Settings in Salesforce

### Step 4.1: Create New SSO Setting

1. Navigate to **Setup > Identity > Single Sign-On Settings**
2. Click **Edit** on "SAML Enabled" → Check the box if not already enabled → Save
3. Click **New** under "SAML Single Sign-On Settings"

Fill in the fields:

| Field | Value | Where to Get It |
|---|---|---|
| Name | `Okta SSO` | Your choice |
| API Name | `Okta_SSO` | Auto-populated |
| Issuer | (Okta's entityID) | From Okta IdP metadata |
| Identity Provider Certificate | (Paste Okta's X.509 cert) | From Okta |
| SAML Identity Type | `Federation ID` | Best practice |
| SAML Identity Location | `Subject (NameID)` | Standard |
| Identity Provider Login URL | (Okta SSO endpoint) | From Okta |
| Identity Provider Logout URL | (Okta logout URL) | From Okta |
| Custom Error URL | (optional) | Leave blank for now |
| Entity ID | `https://acmecorp-dev.my.salesforce.com` | Auto-populated |
| ACS URL | `https://acmecorp-dev.my.salesforce.com/login` | Auto-populated |

4. Check **Just-In-Time User Provisioning** 

5. Click **Save**

### Step 4.2: Review JIT Attribute Mapping

After saving, Salesforce shows the JIT attribute mapping. Verify:
- The attributes in the JIT mapping match the attributes you configured in Okta (`User.FirstName`, `User.LastName`, `User.Email`, `User.ProfileName`, etc.)
- The attribute names in the SAML assertion from Okta must EXACTLY match what Salesforce expects

> **Common Mistake:** Attribute names are case-sensitive. `User.Email` ≠ `user.email`. Ensure the Okta attribute statement names exactly match the Salesforce JIT mapping names.

---

## Part 5: Configure My Domain Authentication Policy

### Step 5.1: Add SSO to Login Page

1. Navigate to **Setup > My Domain**
2. Scroll to **Authentication Configuration** section
3. Click **Edit**
4. Under "Authentication Services," check `Okta SSO` (the SSO Setting you created)
5. Optionally uncheck "Login Page" if you want to force SSO (no username/password login allowed)
6. Click **Save**

> **Architect Note:** For production, you typically want to keep "Login Page" enabled initially (for admin break-glass access) and only enforce SSO-only after thorough testing. For sandbox, keep both enabled.

---

## Part 6: Set Up Test User Federation ID

### Step 6.1: Assign Federation ID to Test User

For SSO to work, the Salesforce user's Federation ID must match the SAML NameID from Okta.

1. Navigate to **Setup > Users > Users**
2. Edit your own user (or a test user)
3. Scroll to the "Single Sign-On Information" section
4. Set **Federation ID** to your Okta username (email address): `your.email@example.com`
5. Save

> **Exam Key:** Federation ID is the recommended SAML Identity Type. It decouples the Salesforce username from the SSO identifier. The NameID in the SAML assertion must exactly match the Federation ID on the Salesforce user record.

---

## Part 7: Test SSO

### Step 7.1: SP-Initiated SSO Test

1. Open a private/incognito browser window
2. Navigate to `https://acmecorp-dev.my.salesforce.com`
3. You should see the Salesforce login page with an "Okta SSO" button
4. Click the button
5. You are redirected to Okta's login page
6. Enter your Okta credentials
7. If successful, you are redirected back to Salesforce and logged in

### Step 7.2: IdP-Initiated SSO Test

1. Log in to your Okta portal
2. Find the Salesforce Dev app tile in your dashboard
3. Click it
4. You should be logged into Salesforce without re-entering credentials

### Step 7.3: Test JIT Provisioning

1. Create a new user in Okta (or use an existing user without a Salesforce account)
2. Ensure the user is assigned to the Salesforce Dev app in Okta
3. Have the user attempt SP-initiated SSO
4. If JIT is configured correctly, a new Salesforce user is created on first login
5. Verify in Salesforce Setup > Users that the new user exists with the expected profile

---

## Part 8: Troubleshooting with SAML Validator

### Step 8.1: Using the SAML Assertion Validator

If SSO fails, use Salesforce's built-in SAML validator:

1. Navigate to **Setup > Identity > Single Sign-On Settings**
2. Click **SAML Assertion Validator** (link in the SSO Settings area)
3. In another browser tab, install the **SAML Tracer** browser extension (Chrome/Firefox)
4. Attempt the SSO login with SAML Tracer running
5. In SAML Tracer, find the POST request to your ACS URL (`/login`)
6. Copy the `SAMLResponse` value (base64 encoded)
7. Paste it into the SAML Assertion Validator in Salesforce
8. Click **Validate**

Salesforce will tell you exactly what passed and what failed:
- ✓ Signature Verified
- ✓ Issuer matches
- ✓ Audience matches
- ✗ Assertion expired (clock skew issue)
- ✗ NameID not matched (Federation ID mismatch)
- ✗ JIT provisioning failed (missing required attribute)

### Common Troubleshooting Scenarios

**Scenario 1: "Invalid audience" error**
- The Audience element in the SAML assertion doesn't match Salesforce's Entity ID
- Fix: Update Okta's "Audience URI" to exactly match your My Domain URL

**Scenario 2: "Assertion expired" error**
- Server clock drift between Okta and Salesforce
- Fix: Check NTP synchronization; Okta servers should sync automatically, but the assertion window is typically 5 minutes

**Scenario 3: NameID not matched**
- The Federation ID on the Salesforce user doesn't match the NameID in the assertion
- Fix: Check the Okta "Application username" setting and compare with the user's Federation ID in Salesforce

**Scenario 4: JIT fails — user not created**
- Required JIT attributes missing from the assertion
- Fix: Verify the Okta attribute statements include all required fields; check the attribute name case sensitivity

---

## Part 9: Configure Single Logout (Optional Advanced)

### Step 9.1: Enable SLO

1. In the SSO Setting record, edit it to add the IdP SLO URL from Okta:
   - In Okta, find the **Identity Provider Single Logout URL**
   - In Salesforce SSO Settings, add to the **Identity Provider Logout URL** field

2. Test: Log out of Salesforce using the logout button
3. Verify: The browser is redirected to Okta's logout page, and the Okta session is terminated

> **Architect Note:** SLO is not always reliable across all applications. Mobile apps using OAuth tokens are NOT affected by SAML SLO. For complete session termination, combine SLO with session timeout policies and Transaction Security Policies.

---

## Lab Validation Checklist

Before completing the lab, verify:

- [ ] My Domain is deployed to users
- [ ] SSO Settings record created with correct Issuer, ACS URL, Entity ID, and IdP certificate
- [ ] JIT provisioning enabled with all required attribute mappings
- [ ] Test user has Federation ID matching Okta username
- [ ] SP-initiated SSO works (click from Salesforce login page)
- [ ] IdP-initiated SSO works (click from Okta dashboard)
- [ ] JIT creates a new user on first login (verify in Setup > Users)
- [ ] SAML Validator used to diagnose at least one issue during testing
- [ ] My Domain Authentication Configuration shows the SSO option enabled

---

## Exam-Focused Reflection Questions

1. **What happens to a SAML SSO flow if the IdP's signing certificate expires?** (Signature verification fails; all SSO logins fail immediately; update the certificate in Salesforce SSO Settings)

2. **A sandbox copy was made of this org. Why might SSO fail in the sandbox?** (Sandbox has a different My Domain URL; Entity ID and ACS URL are different; must update IdP config for the sandbox URL)

3. **If My Domain is not deployed, can SSO be configured?** (No — My Domain is a prerequisite for SSO in Salesforce)

4. **What is the difference between "SAML Identity Type = Federation ID" and "SAML Identity Type = Username"?** (Federation ID decouples the SSO identifier from the Salesforce username — important because sandbox usernames have suffixes like `.dev` appended; Username must exactly match the full Salesforce username)

5. **A user logs in via SSO and gets the error "You don't have access to the Salesforce org." What are the possible causes?** (User profile is inactive; user's license is incorrect; user is deactivated; login hours restriction; profile Login IP Range restriction)
