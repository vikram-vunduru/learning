# Lab 02 — Building a CI/CD Pipeline with GitHub Actions

## Lab Overview

In this lab, you will build a complete Salesforce CI/CD pipeline using GitHub Actions. You will configure JWT-based authentication, create a Connected App, store secrets in GitHub, write GitHub Actions workflow YAML, test the pipeline on a feature branch, add test gates, and deploy to a sandbox.

**Estimated Time:** 2-3 hours

**Difficulty:** Advanced (assumes completion of Lab 01 and familiarity with Git/GitHub)

---

## Objectives

By the end of this lab, you will be able to:
1. Generate a JWT certificate and private key for CI authentication
2. Create and configure a Connected App for JWT-based deployments
3. Set up GitHub repository secrets securely
4. Write a GitHub Actions workflow for Salesforce CI (PR validation)
5. Write a GitHub Actions workflow for Salesforce CD (deploy on merge)
6. Test and observe the pipeline executing on a feature branch
7. Add test gates (code coverage, static analysis)
8. Deploy metadata to a sandbox via GitHub Actions

---

## Prerequisites

- Completed Lab 01 (SFDX project with source code)
- GitHub account (free at github.com)
- Git configured locally (`git config --global user.name`, `git config --global user.email`)
- Salesforce Developer Edition org (will be your "sandbox" for this lab)
- OpenSSL installed (`openssl version` to check)

---

## Part 1: Generate JWT Certificate and Private Key

JWT authentication requires an asymmetric key pair: a private key (you keep this secret) and a certificate (you give to Salesforce).

### Step 1.1 — Create Keys Directory

```bash
# Create a directory for key generation (NOT in your project directory)
mkdir ~/salesforce-jwt-keys
cd ~/salesforce-jwt-keys
```

**Important:** We create keys OUTSIDE the project directory to prevent accidental commits.

### Step 1.2 — Generate Private Key

```bash
openssl genrsa -out server.key 4096
```

This creates `server.key` — your private key. This file is secret. Never commit it to Git.

### Step 1.3 — Generate Certificate Signing Request

```bash
openssl req -new -key server.key -out server.csr \
  -subj "/C=US/ST=CA/O=MyOrg/CN=salesforce-ci-lab"
```

### Step 1.4 — Self-Sign the Certificate

```bash
openssl x509 -req -sha256 -days 365 \
  -in server.csr \
  -signkey server.key \
  -out server.crt
```

This creates `server.crt` — the certificate you'll upload to Salesforce.

### Step 1.5 — View the Certificate

```bash
openssl x509 -in server.crt -text -noout | head -20
```

Verify the "Not After" date is one year from now.

### Expected Outcome
Three files in `~/salesforce-jwt-keys/`: `server.key`, `server.csr`, `server.crt`

---

## Part 2: Create a Connected App in Salesforce

### Step 2.1 — Navigate to Connected Apps

1. Log in to your Developer Edition org (this is your "production" for this lab)
2. Setup → App Manager → New Connected App

### Step 2.2 — Configure Basic Information

- **Connected App Name:** `GitHub Actions CI/CD`
- **API Name:** `GitHub_Actions_CI_CD`
- **Contact Email:** your email address

### Step 2.3 — Configure OAuth Settings

Enable OAuth Settings → check the box.

- **Callback URL:** `http://localhost:1717/OauthRedirect`
- **Use digital signatures:** Check this box
- **Upload Digital Certificate:** Upload `server.crt` from Step 1.4

**OAuth Scopes (add these):**
- Access and manage your data (api)
- Perform requests at any time (refresh_token, offline_access)
- Access your basic information (id, profile, email, address, phone)
- Full access (full) — for lab simplicity; use more restrictive scopes in production

### Step 2.4 — Save and Note Consumer Key

Save the Connected App. Wait 5-10 minutes for propagation, then:
- Click "Manage" on the Connected App
- Note the **Consumer Key** (this is your Client ID for JWT auth)

### Step 2.5 — Edit Policies for Pre-Authorization

- Click "Manage" on the Connected App
- Click "Edit Policies"
- **Permitted Users:** Select "Admin approved users are pre-authorized"
- Save

### Step 2.6 — Pre-Authorize Your Deploy User

For this lab, your own admin user is the "CI deploy user":
- Click "Manage" on the Connected App
- Under "Profiles," click "Manage Profiles"
- Add "System Administrator" (your profile for this lab)
- In production: add only the CI service account's profile

### Expected Outcome
Connected App configured with digital certificate and pre-authorized admin users.

---

## Part 3: Set Up GitHub Repository

### Step 3.1 — Create GitHub Repository

1. Go to github.com → New Repository
2. Name: `my-salesforce-project` (or your lab project name)
3. Visibility: Private
4. Do NOT initialize with README (you already have a local repo from Lab 01)
5. Create repository

### Step 3.2 — Connect Local Repository to GitHub

Back in your terminal (in the project directory from Lab 01):

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/my-salesforce-project.git

# Push initial code
git push -u origin main
```

### Step 3.3 — Configure Repository Secrets

In GitHub: Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value |
|---|---|
| `SF_JWT_SECRET_KEY` | Contents of `server.key` file (copy/paste entire file including BEGIN/END lines) |
| `SF_CLIENT_ID` | Consumer Key from Connected App |
| `SF_USERNAME` | Your org admin username (e.g., `yourname@yourorg.dev`) |
| `SF_INSTANCE_URL` | `https://login.salesforce.com` (for Developer Edition org) |

**How to get the key file contents:**
```bash
cat ~/salesforce-jwt-keys/server.key
# Copy the entire output including:
# -----BEGIN RSA PRIVATE KEY-----
# ... (many lines of base64)
# -----END RSA PRIVATE KEY-----
```

### Step 3.4 — Test JWT Authentication Locally

Before setting up the pipeline, verify JWT auth works:

```bash
echo "CONTENT_OF_YOUR_server.key" > /tmp/test.key
sf org login jwt \
  --client-id "YOUR_CONSUMER_KEY" \
  --jwt-key-file /tmp/test.key \
  --username "YOUR_ADMIN_USERNAME" \
  --instance-url "https://login.salesforce.com" \
  --alias TestJWTAuth

# Verify it worked
sf org list
sf org display --target-org TestJWTAuth

# Clean up test key
rm /tmp/test.key
```

**Troubleshooting JWT auth:**
- **"invalid_client_id"** — Consumer Key is wrong or the Connected App hasn't propagated yet (wait 10 min)
- **"user hasn't approved this connected app"** — The admin user's profile is not pre-authorized in the Connected App
- **"certificate_invalid"** — The certificate in the Connected App doesn't match the private key. Ensure you uploaded `server.crt` not `server.key`
- **"invalid_grant"** — Username is wrong or user doesn't exist in the org

### Expected Outcome
JWT authentication succeeds locally. `sf org list` shows the `TestJWTAuth` org.

---

## Part 4: Create the CI Workflow — Validate on PR

### Step 4.1 — Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### Step 4.2 — Create CI Validation Workflow

Create `.github/workflows/validate-pr.yml`:

```yaml
name: Validate Pull Request

on:
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'force-app/**'
      - 'package.json'

env:
  SF_CLI_VERSION: latest

jobs:
  validate-salesforce:
    name: Validate Salesforce Deployment
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Checkout the code
      - name: Checkout Source
        uses: actions/checkout@v4
        with:
          fetch-depth: 0    # Full history for delta deployments

      # Step 2: Install Salesforce CLI
      - name: Install Salesforce CLI
        run: |
          npm install -g @salesforce/cli@${{ env.SF_CLI_VERSION }}
          sf --version

      # Step 3: Create JWT key file from secret
      # IMPORTANT: Write to temp file and delete immediately after auth
      - name: Authenticate to Salesforce
        run: |
          echo "${{ secrets.SF_JWT_SECRET_KEY }}" > /tmp/server.key
          sf org login jwt \
            --client-id "${{ secrets.SF_CLIENT_ID }}" \
            --jwt-key-file /tmp/server.key \
            --username "${{ secrets.SF_USERNAME }}" \
            --instance-url "${{ secrets.SF_INSTANCE_URL }}" \
            --alias TargetOrg
          rm /tmp/server.key
          echo "Authentication successful"

      # Step 4: Validate deployment (no changes made to org)
      - name: Validate Deployment
        id: validate
        run: |
          sf project deploy validate \
            --source-dir force-app \
            --target-org TargetOrg \
            --test-level RunLocalTests \
            --wait 30

      # Step 5: Always upload the deploy result artifact
      - name: Upload Deployment Result
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: deployment-validation-result
          path: |
            .sf/
          retention-days: 7
```

### Step 4.3 — Add .github to Git and Push

```bash
git add .github/
git commit -m "ci: add GitHub Actions PR validation workflow"
git push origin main
```

### Expected Outcome
Workflow file is in GitHub. (It won't run yet because the workflow triggers on PRs, not pushes to main.)

---

## Part 5: Test the Pipeline on a Feature Branch

### Step 5.1 — Create a Feature Branch

```bash
git checkout -b feature/add-contact-field
```

### Step 5.2 — Add New Metadata

Create a new field on the Project object. Create `force-app/main/default/objects/Project__c/fields/ContactName__c.field-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>ContactName__c</fullName>
    <externalId>false</externalId>
    <label>Contact Name</label>
    <length>255</length>
    <required>false</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Text</type>
    <unique>false</unique>
</CustomField>
```

### Step 5.3 — Update Apex Class to Reference New Field

Update `ProjectService.cls` to use the new field:

```apex
public with sharing class ProjectService {
    
    public static List<Project__c> getActiveProjects() {
        return [
            SELECT Id, Name, Status__c, ContactName__c 
            FROM Project__c 
            WHERE Status__c = 'Active'
            ORDER BY Name
        ];
    }
    
    public static void activateProject(Id projectId) {
        Project__c proj = [SELECT Id, Status__c FROM Project__c WHERE Id = :projectId];
        proj.Status__c = 'Active';
        update proj;
    }
    
    public static void setContactName(Id projectId, String contactName) {
        Project__c proj = [SELECT Id FROM Project__c WHERE Id = :projectId];
        proj.ContactName__c = contactName;
        update proj;
    }
}
```

### Step 5.4 — Update Test Class

Add a test for the new method in `ProjectServiceTest.cls`:

```apex
@isTest
static void testSetContactName() {
    Project__c proj = [SELECT Id FROM Project__c WHERE Name = 'Project Alpha' LIMIT 1];
    
    Test.startTest();
    ProjectService.setContactName(proj.Id, 'John Smith');
    Test.stopTest();
    
    Project__c updated = [SELECT ContactName__c FROM Project__c WHERE Id = :proj.Id];
    System.assertEquals('John Smith', updated.ContactName__c, 'Contact name should be set');
}
```

### Step 5.5 — Commit and Push Feature Branch

```bash
git add force-app/
git commit -m "feat: add ContactName field and setContactName service method"
git push origin feature/add-contact-field
```

### Step 5.6 — Create a Pull Request on GitHub

1. Go to your GitHub repository
2. You should see a banner: "Compare & pull request"
3. Click it, set base = main, and create the PR

### Step 5.7 — Watch the Pipeline Run

1. Click the "Checks" tab on the PR
2. Watch "Validate Salesforce Deployment" run
3. Click the job to see each step's output

**Observe:**
- The auth step running
- The validate step running tests in your org
- Results showing test pass/fail

### Expected Outcome
The CI pipeline runs automatically on the PR. If successful, you should see a green check mark on the "validate-salesforce" check.

### Troubleshooting CI Failures
- **"Authenticate failed"** — Check secrets are correctly set (no trailing spaces, correct values)
- **"Deployment validation failed: Missing field"** — The `ContactName__c` field may not be in your target org. The validation will add it.
- **"No tests ran"** — Check that test classes are included in `force-app/` and have `@isTest` annotation

---

## Part 6: Add Test Gates to the Pipeline

### Step 6.1 — Update Workflow to Add PMD

First, install PMD. Update `.github/workflows/validate-pr.yml` to add a parallel job:

```yaml
name: Validate Pull Request

on:
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'force-app/**'

jobs:
  pmd-analysis:
    name: PMD Static Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: Setup Java (required for PMD)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Download PMD
        run: |
          PMD_VERSION=7.0.0
          wget -q https://github.com/pmd/pmd/releases/download/pmd_releases%2F${PMD_VERSION}/pmd-dist-${PMD_VERSION}-bin.zip
          unzip -q pmd-dist-${PMD_VERSION}-bin.zip -d $HOME/pmd
          echo "$HOME/pmd/pmd-bin-${PMD_VERSION}/bin" >> $GITHUB_PATH

      - name: Run PMD Analysis
        run: |
          pmd check \
            --dir force-app/main/default/classes \
            --rulesets category/apex/bestpractices.xml,category/apex/performance.xml \
            --format text \
            --fail-on-violation true
        continue-on-error: false    # Fail the job if violations found

  validate-salesforce:
    name: Validate Salesforce Deployment
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli@latest

      - name: Authenticate to Salesforce
        run: |
          echo "${{ secrets.SF_JWT_SECRET_KEY }}" > /tmp/server.key
          sf org login jwt \
            --client-id "${{ secrets.SF_CLIENT_ID }}" \
            --jwt-key-file /tmp/server.key \
            --username "${{ secrets.SF_USERNAME }}" \
            --instance-url "${{ secrets.SF_INSTANCE_URL }}" \
            --alias TargetOrg
          rm /tmp/server.key

      - name: Validate Deployment
        run: |
          sf project deploy validate \
            --source-dir force-app \
            --target-org TargetOrg \
            --test-level RunLocalTests \
            --wait 30
```

### Step 6.2 — Configure Branch Protection Rules

In GitHub: Settings → Branches → Add Branch Protection Rule

- Branch name pattern: `main`
- Enable: "Require a pull request before merging"
- Enable: "Require approvals" → 1 approval (or 0 for this lab)
- Enable: "Require status checks to pass before merging"
- Add these status checks:
  - `pmd-analysis / PMD Static Analysis`
  - `validate-salesforce / Validate Salesforce Deployment`
- Enable: "Require branches to be up to date before merging"

### Step 6.3 — Commit Updated Workflow

```bash
git add .github/workflows/validate-pr.yml
git commit -m "ci: add PMD static analysis gate and branch protection"
git push origin feature/add-contact-field
```

Watch the PR now shows TWO required checks.

---

## Part 7: Create the CD Workflow — Deploy on Merge

### Step 7.1 — Create CD Workflow

Create `.github/workflows/deploy-sandbox.yml`:

```yaml
name: Deploy to Sandbox

on:
  push:
    branches:
      - main           # Triggers when PR is merged to main
    paths:
      - 'force-app/**'

jobs:
  deploy:
    name: Deploy to Developer Sandbox
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli@latest

      - name: Authenticate to Target Org
        run: |
          echo "${{ secrets.SF_JWT_SECRET_KEY }}" > /tmp/server.key
          sf org login jwt \
            --client-id "${{ secrets.SF_CLIENT_ID }}" \
            --jwt-key-file /tmp/server.key \
            --username "${{ secrets.SF_USERNAME }}" \
            --instance-url "${{ secrets.SF_INSTANCE_URL }}" \
            --alias DeployTarget
          rm /tmp/server.key

      - name: Deploy to Sandbox
        id: deploy
        run: |
          sf project deploy start \
            --source-dir force-app \
            --target-org DeployTarget \
            --test-level RunLocalTests \
            --wait 60

      - name: Run Smoke Tests
        if: success()
        run: |
          sf apex test run \
            --tests ProjectServiceTest \
            --target-org DeployTarget \
            --result-format human \
            --wait 15

      - name: Report Success
        if: success()
        run: |
          echo "Deployment to sandbox completed successfully!"
          echo "All smoke tests passed."

      - name: Report Failure
        if: failure()
        run: |
          echo "Deployment or smoke tests failed!"
          echo "Review the logs above for details."
          exit 1
```

### Step 7.2 — Commit and Push

```bash
git add .github/workflows/deploy-sandbox.yml
git commit -m "cd: add deploy-to-sandbox workflow on main branch merge"
git push origin feature/add-contact-field
```

---

## Part 8: Complete the Pipeline Test

### Step 8.1 — Merge the PR (After CI Checks Pass)

1. Go to your PR on GitHub
2. Wait for both CI checks to pass (green checkmarks)
3. Merge the PR (or approve and merge if branch protection requires approval)
4. Watch the CD pipeline trigger automatically

### Step 8.2 — Observe CD Pipeline

1. Go to Actions tab in GitHub
2. Find the "Deploy to Sandbox" workflow run
3. Watch the deployment execute:
   - Authenticate to org
   - Deploy source
   - Run smoke tests

### Step 8.3 — Verify Deployment in Org

```bash
# Authenticate if needed
sf org login web --alias LabOrg

# Check that new field exists
sf data query \
  --query "SELECT Id, ContactName__c FROM Project__c LIMIT 1" \
  --target-org LabOrg
```

If the query works and returns (even 0 rows), `ContactName__c` is deployed.

### Expected Outcome
CD pipeline deploys successfully. New field and updated Apex class are in the org. Smoke tests pass.

---

## Lab Completion Checklist

- [ ] JWT certificate and private key generated
- [ ] Connected App created with digital certificate uploaded
- [ ] GitHub repository created with Salesforce source code
- [ ] GitHub Secrets configured (JWT key, client ID, username, instance URL)
- [ ] JWT auth tested locally before pipeline setup
- [ ] CI workflow (validate-pr.yml) created and deployed
- [ ] Feature branch created with new metadata
- [ ] PR created and CI pipeline triggered automatically
- [ ] PMD static analysis job added to CI
- [ ] Branch protection rules configured
- [ ] CD workflow (deploy-sandbox.yml) created
- [ ] PR merged and CD pipeline executed successfully
- [ ] Deployment verified in target org

---

## Lab Takeaways

**What you've built:** A two-workflow CI/CD pipeline that:
1. Validates every PR against a real Salesforce org (CI) with PMD analysis
2. Deploys every merge to main into a sandbox (CD) with smoke tests
3. Uses JWT auth — no browser interaction required
4. Enforces quality gates via branch protection

**What makes this production-ready:**
- Add environment-specific secrets for SIT, UAT, Staging, Production (different Connected Apps)
- Add `sf project deploy validate` → store validation ID → `sf project deploy quick-deploy` pattern for production
- Add GitHub Environment protection (required reviewers) for production deployment workflow
- Add Jest test job for LWC components
- Add code coverage threshold check (fail if < 80%)

---

## Troubleshooting Reference

| Error | Likely Cause | Fix |
|---|---|---|
| `INVALID_CREDENTIALS` in workflow | Secrets not set correctly | Check GitHub Secrets, re-enter without extra spaces |
| `certificate_invalid` | Wrong certificate in Connected App | Ensure you uploaded `server.crt` (not `server.key`) |
| `user hasn't approved connected app` | Pre-authorization not set | Edit Connected App policies → Admin approved users |
| `CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY` | Trigger/validation rule fires during deploy | Include all related components in the same deploy |
| `No tests ran in test run` | Test classes not in source | Verify test classes are in `force-app/` and have `@isTest` |
| `Deployment timed out` | `--wait` value too low | Increase `--wait 60` or higher |
| `rate limit exceeded` on GitHub Actions | Free tier limits | GitHub Free: 2,000 min/month for private repos |
