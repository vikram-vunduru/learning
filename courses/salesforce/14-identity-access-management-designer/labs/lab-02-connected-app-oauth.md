# Lab 02: Connected App OAuth Flows

## Lab Overview

**Scenario:** You are the Salesforce Architect at Acme Corp. You need to configure three different OAuth integration patterns:
1. A web application using Authorization Code flow (for employee-facing CRM access)
2. A machine-to-machine batch integration using JWT Bearer flow (nightly data sync)
3. A client credentials integration for a microservice (API v53+ pattern)

**Skills Practiced:**
- Creating and configuring Connected Apps
- Implementing Authorization Code flow
- Setting up JWT Bearer flow with X.509 certificate
- Configuring Client Credentials flow with Run As User
- Managing OAuth policies (IP relaxation, refresh token, Admin Approved)
- Token revocation

**Time to complete:** 90-120 minutes

**Prerequisites:**
- Salesforce Developer Edition org with My Domain deployed
- OpenSSL installed (for certificate generation)
- A REST API testing tool (Postman, Insomnia, or curl)
- Python 3 or Node.js (for JWT Bearer example)

---

## Part 1: Authorization Code Flow — Web Application

### Step 1.1: Create the Connected App

1. Navigate to **Setup > App Manager > New Connected App**

Fill in:
- **Connected App Name:** `Acme Web App`
- **API Name:** `Acme_Web_App`
- **Contact Email:** your email
- **Enable OAuth Settings:** ✓ Check
- **Callback URL:** `https://localhost:8080/callback` (for testing)
- **Selected OAuth Scopes:**
  - Access and manage your data (api)
  - Perform requests at any time (refresh_token, offline_access)
  - Access your basic information (openid)
  - Access your email address (email)
  - Access your profile information (profile)
- **Require Proof Key for Code Exchange (PKCE):** Leave unchecked (server-side app can use client secret)

2. Click **Save** → Continue

3. After saving, find and note:
   - **Consumer Key** (Client ID)
   - Click "Click to reveal" next to **Consumer Secret** → note it

### Step 1.2: Configure OAuth Policies

1. Navigate to **Setup > App Manager > Acme Web App > Manage**
2. Click **Edit Policies**

Set:
- **Permitted Users:** `All users may self-authorize`
- **IP Relaxation:** `Enforce IP restrictions`
- **Refresh Token Policy:** `Expire refresh token after 90 days`

3. Save

### Step 1.3: Test Authorization Code Flow (Manual)

**Step A: Authorization Request**

Open your browser and navigate to:
```
https://[your-domain].my.salesforce.com/services/oauth2/authorize
?response_type=code
&client_id=[YOUR_CONSUMER_KEY]
&redirect_uri=https://localhost:8080/callback
&scope=api+refresh_token+openid+email+profile
&state=teststate123
```

You will be prompted to log in (if not already) and then to authorize the app. Click **Allow**.

**Step B: Capture the Authorization Code**

After clicking Allow, your browser redirects to:
```
https://localhost:8080/callback?code=aPrxPNVqBZeJPEbKcvBPlxECfmU
&state=teststate123
```
(The page will fail to load since localhost:8080 isn't running — that's OK. Copy the `code` value from the URL.)

> **Architecture Note:** In a real application, the backend server intercepts this redirect, captures the code, and proceeds to the token exchange. The code is single-use and expires in approximately 10 minutes.

**Step C: Token Exchange (using curl or Postman)**

```bash
curl -X POST https://[your-domain].my.salesforce.com/services/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "code=[CODE_FROM_STEP_B]" \
  -d "client_id=[YOUR_CONSUMER_KEY]" \
  -d "client_secret=[YOUR_CONSUMER_SECRET]" \
  -d "redirect_uri=https://localhost:8080/callback"
```

**Expected Response:**
```json
{
  "access_token": "00D...",
  "refresh_token": "5Aep...",
  "signature": "...",
  "scope": "refresh_token api openid email profile",
  "id_token": "eyJhbGci...",
  "instance_url": "https://[your-domain].my.salesforce.com",
  "id": "https://login.salesforce.com/id/00D.../005...",
  "token_type": "Bearer",
  "issued_at": "1693000000000"
}
```

**Step D: Call the API**

```bash
curl -X GET "[INSTANCE_URL]/services/data/v59.0/sobjects/" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

**Step E: Decode the id_token**

The `id_token` is a JWT. Base64-decode the middle section (between the dots) to see the claims:

```python
import base64, json
id_token = "[your_id_token]"
payload = id_token.split('.')[1]
# Add padding if needed
payload += '=' * (4 - len(payload) % 4)
decoded = json.loads(base64.b64decode(payload))
print(json.dumps(decoded, indent=2))
```

Verify the claims: `sub`, `iss`, `aud`, `exp`, `email`, `name`, `given_name`, `family_name`

---

## Part 2: JWT Bearer Token Flow — Machine-to-Machine

### Step 2.1: Generate an RSA Key Pair

Open a terminal and run:

```bash
# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key certificate (self-signed)
openssl req -new -x509 -key private_key.pem -out certificate.pem -days 365 \
  -subj "/CN=Acme Integration/O=Acme Corp/C=US"

# Verify the certificate
openssl x509 -in certificate.pem -text -noout
```

> **Security Note:** In production, store `private_key.pem` in a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault). Never commit it to version control. The `certificate.pem` (public key) is uploaded to Salesforce — it's not secret.

### Step 2.2: Create the JWT Bearer Connected App

1. **Setup > App Manager > New Connected App**

Fill in:
- **Connected App Name:** `Acme Batch Integration`
- **API Name:** `Acme_Batch_Integration`
- **Contact Email:** your email
- **Enable OAuth Settings:** ✓
- **Callback URL:** `https://localhost/callback` (placeholder; not used in JWT Bearer)
- **Selected OAuth Scopes:**
  - Access and manage your data (api)
- **Use Digital Signatures:** ✓ Check
  - Click **Choose File** → upload `certificate.pem`

2. Save → note Consumer Key

### Step 2.3: Configure JWT Bearer Policies

1. **Manage > Edit Policies**
2. Set **Permitted Users:** `Admin approved users are pre-authorized`
3. Save

### Step 2.4: Create Integration User and Assign Permission Set

1. **Setup > Users > New User**
   - Profile: `Standard User` (or create a minimal integration user profile)
   - Username: `integration.user@acmecorp.dev`
   - Note the Username

2. **Setup > Permission Sets > New Permission Set**
   - Label: `JWT Integration Access`
   - API Name: `JWT_Integration_Access`
   - Assigned Connected Apps: Add `Acme Batch Integration`
   - Save

3. **Assign the PS to the integration user:**
   - Users > integration.user@acmecorp.dev > Permission Set Assignments > Edit > Move JWT_Integration_Access to Enabled > Save

### Step 2.5: Generate and Submit a JWT Assertion

**Using Python:**

```python
import jwt
import time
import requests
from pathlib import Path

# Configuration
CONSUMER_KEY = "[YOUR_CONSUMER_KEY]"
USERNAME = "integration.user@acmecorp.dev"
AUDIENCE = "https://login.salesforce.com"  # Use test.salesforce.com for sandbox
PRIVATE_KEY = Path("private_key.pem").read_text()

# Build JWT payload
now = int(time.time())
payload = {
    "iss": CONSUMER_KEY,
    "sub": USERNAME,
    "aud": AUDIENCE,
    "exp": now + 180  # 3 minutes
}

# Sign the JWT
token = jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")
print("JWT Assertion:", token[:50] + "...")

# Exchange for access token
response = requests.post(
    f"{AUDIENCE}/services/oauth2/token",
    data={
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": token
    }
)

print("Status:", response.status_code)
print("Response:", response.json())
```

**Expected Success Response:**
```json
{
  "access_token": "00D...",
  "instance_url": "https://[your-domain].my.salesforce.com",
  "id": "https://login.salesforce.com/id/00D.../005...",
  "token_type": "Bearer",
  "issued_at": "1693000000000"
}
```
Note: **No `refresh_token` is returned** — this is by design for JWT Bearer flow.

**Common JWT Bearer Errors:**

| Error | Cause | Fix |
|---|---|---|
| `invalid_grant: user hasn't approved this consumer` | Admin Approved policy but PS not assigned | Assign the PS to the integration user |
| `invalid_client: certificate not found` | Certificate not uploaded to Connected App | Upload certificate.pem to the Connected App |
| `invalid_grant: JWT has expired` | Clock skew; exp was more than 3 min in the past | Ensure server clock is synchronized with NTP |
| `invalid_grant: audience invalid` | Wrong `aud` value | Use `https://login.salesforce.com` for production or `https://test.salesforce.com` for sandbox |

---

## Part 3: Client Credentials Flow (API v53+)

### Step 3.1: Create Connected App for Client Credentials

1. **Setup > App Manager > New Connected App**

Fill in:
- **Connected App Name:** `Acme Microservice`
- **API Name:** `Acme_Microservice`
- **Enable OAuth Settings:** ✓
- **Callback URL:** `https://localhost/callback`
- **Selected OAuth Scopes:** `api`
- **Enable Client Credentials Flow:** ✓ Check

2. Save → note Consumer Key and Consumer Secret

### Step 3.2: Configure Run As User

1. **Manage > Edit Policies**
2. Set **Run As:** click the lookup → find `integration.user@acmecorp.dev`
3. Set **Permitted Users:** `Admin approved users are pre-authorized`
4. Save

### Step 3.3: Test Client Credentials Flow

```bash
curl -X POST https://[your-domain].my.salesforce.com/services/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=[CONSUMER_KEY]" \
  -d "client_secret=[CONSUMER_SECRET]"
```

**Expected Response:**
```json
{
  "access_token": "00D...",
  "instance_url": "https://[your-domain].my.salesforce.com",
  "token_type": "Bearer",
  "issued_at": "..."
}
```
Note: No `refresh_token` and no `id_token` — pure M2M token.

---

## Part 4: Token Introspection

### Step 4.1: Introspect an Access Token

Use an access token obtained from any of the above flows:

```bash
curl -X POST https://[your-domain].my.salesforce.com/services/oauth2/introspect \
  -d "token=[ACCESS_TOKEN]" \
  -d "token_type_hint=access_token" \
  -d "client_id=[CONSUMER_KEY]" \
  -d "client_secret=[CONSUMER_SECRET]"
```

**Expected Response:**
```json
{
  "active": true,
  "scope": "api",
  "client_id": "3MVG9...",
  "username": "integration.user@acmecorp.dev",
  "sub": "https://login.salesforce.com/id/00D.../005...",
  "token_type": "access_token",
  "exp": 1693003600,
  "iat": 1693000000,
  "nbf": 1693000000
}
```

### Step 4.2: Introspect an Expired Token

Wait for the access token to expire (2 hours default, or create a short-lived test). Introspect again:

```json
{ "active": false }
```

---

## Part 5: OAuth Token Audit and Revocation

### Step 5.1: View Active OAuth Grants

1. Navigate to **Setup > Connected Apps OAuth Usage**
2. You should see all three Connected Apps you created
3. Note the user count for each

### Step 5.2: Revoke a Specific User Token

1. **Setup > Manage Connected Apps > Acme Web App > OAuth Usage**
2. Find your test user in the list
3. Click **Revoke** next to their token

### Step 5.3: Block an Entire Connected App

1. **Setup > Connected Apps OAuth Usage**
2. Find `Acme Web App`
3. Click **Block**
4. Verify: attempt to use the access token from Part 1 → should now receive 401

### Step 5.4: Revoke via API

```bash
curl -X POST https://[your-domain].my.salesforce.com/services/oauth2/revoke \
  -d "token=[REFRESH_TOKEN]"
```

Expected: 200 OK with empty body (successful revocation)

---

## Part 6: Admin Approved Policy — Testing Access Control

### Step 6.1: Remove the PS Assignment

1. Remove the `JWT_Integration_Access` Permission Set from the integration user
2. Attempt a JWT Bearer token request again

**Expected Error:**
```json
{
  "error": "invalid_grant",
  "error_description": "user hasn't approved this consumer"
}
```

This confirms that Admin Approved + missing PS assignment = access denied.

### Step 6.2: Re-assign and Verify

1. Re-assign the Permission Set to the integration user
2. Retry the JWT Bearer request
3. It should succeed again

---

## Lab Validation Checklist

- [ ] Authorization Code flow: successfully obtained access_token and refresh_token
- [ ] id_token decoded: sub, email, name claims visible
- [ ] API call succeeded with Bearer token
- [ ] RSA key pair generated: private_key.pem and certificate.pem created
- [ ] JWT Bearer Connected App: certificate uploaded, Admin Approved policy set
- [ ] Integration user created with Permission Set assigned
- [ ] JWT Bearer flow succeeded: access_token obtained (no refresh_token)
- [ ] JWT Bearer failed with expected error when PS removed
- [ ] Client Credentials flow: access_token obtained with Run As User
- [ ] Token Introspection: active token shows claims; expired shows `active: false`
- [ ] Token Revocation: revoked token returns 401 on API call
- [ ] Connected Apps OAuth Usage page reviewed

---

## Exam-Focused Reflection Questions

1. **Why does JWT Bearer flow not return a refresh token?** (By design — JWT Bearer is meant for automated systems that can re-assert a new JWT on demand. The integration system always has the private key available to generate a new assertion, so a persistent refresh token is unnecessary.)

2. **What happens to the JWT Bearer integration if the integration user is deactivated?** (All JWT assertions with `sub` = that username will fail with `invalid_grant`. The `sub` must be an active, licensed Salesforce user. This is why integration users should have deactivation processes coordinated with integration owners.)

3. **A Connected App uses "Relax IP restrictions." An admin adds a Profile-level Login IP Range. Will the OAuth API calls from outside that range still work?** (Yes — Connected App IP Relaxation overrides Profile Login IP Ranges for OAuth token access. The admin must change the Connected App to "Enforce IP restrictions" to apply the Profile ranges to API calls.)

4. **What is the maximum validity window for the JWT `exp` claim?** (3 minutes / 180 seconds from when Salesforce processes it. If exp is more than 3 minutes in the past, or if the server clocks are off, the assertion fails.)

5. **If you want to verify that a Salesforce access token is still valid before making an API call, what is the correct approach?** (Call the Token Introspection endpoint. Do NOT attempt to decode the access_token — Salesforce access tokens are opaque strings, not JWTs, and cannot be decoded to extract validity information.)
