# Lab 01 — SFDX Project Setup and Source Control

## Lab Overview

In this lab, you will set up a Salesforce DX project from scratch, connect it to a Dev Hub and scratch org, create and push metadata, pull changes back, initialize Git, and configure proper ignore files. This lab operationalizes the concepts from Lectures 01-04.

**Estimated Time:** 90-120 minutes

**Difficulty:** Intermediate (assumes basic Salesforce familiarity)

---

## Objectives

By the end of this lab, you will be able to:
1. Install and verify the Salesforce CLI (sf)
2. Create a Salesforce DX project with correct structure
3. Authenticate to a Dev Hub org
4. Create a scratch org from a definition file
5. Push metadata to a scratch org
6. Make changes in the scratch org and pull them back
7. Initialize a Git repository with proper `.gitignore` and `.forceignore`
8. Make an initial commit with meaningful metadata

---

## Prerequisites

- Salesforce Developer Edition org (free at developer.salesforce.com) — this will be your Dev Hub
- Node.js v18+ installed (`node --version` to check)
- Git installed (`git --version` to check)
- VS Code installed (recommended)
- Salesforce Extension Pack installed in VS Code (optional but recommended)

---

## Lab Setup — Enable Dev Hub

Before you can create scratch orgs, you must enable Dev Hub in your Developer Edition org.

**Steps:**
1. Log in to your Developer Edition org
2. Navigate to Setup → Settings → Dev Hub
3. Enable Dev Hub (click "Enable")
4. Enable Source Tracking (click "Enable")

**Verification:** Setup → Dev Hub should show "Dev Hub Enabled: Yes"

---

## Part 1: Install and Verify Salesforce CLI

### Step 1.1 — Install the CLI

Visit https://developer.salesforce.com/tools/salesforcecli and download the installer for your platform, OR install via npm:

```bash
npm install -g @salesforce/cli@latest
```

### Step 1.2 — Verify Installation

```bash
sf --version
```

Expected output:
```
@salesforce/cli/2.x.x darwin-arm64 node-v20.x.x
```

### Step 1.3 — Update Plugins

```bash
sf plugins update
```

### Expected Outcome
Running `sf --version` returns a version number without errors.

---

## Part 2: Create the SFDX Project

### Step 2.1 — Create Project Directory

```bash
# Navigate to where you keep your projects
cd ~/projects

# Create the SFDX project
sf project generate --name my-salesforce-project

# Move into the project directory
cd my-salesforce-project
```

### Step 2.2 — Examine the Generated Structure

```bash
ls -la
```

You should see:
```
.
├── .forceignore
├── .gitignore (not always generated — you may need to create it)
├── README.md
├── force-app/
│   └── main/
│       └── default/
├── config/
│   └── project-scratch-def.json
└── sfdx-project.json
```

### Step 2.3 — Review sfdx-project.json

Open `sfdx-project.json` in VS Code:

```bash
code sfdx-project.json
```

You should see:
```json
{
  "packageDirectories": [
    {
      "path": "force-app",
      "default": true
    }
  ],
  "namespace": "",
  "sfdcLoginUrl": "https://login.salesforce.com",
  "sourceApiVersion": "62.0"
}
```

**Lab exercise:** Change `sourceApiVersion` to match your Dev Hub org's API version. (Check Setup → Company Information → Salesforce.com API Version.)

### Step 2.4 — Review Scratch Org Definition File

Open `config/project-scratch-def.json`:

```json
{
  "orgName": "My Dev Org",
  "edition": "Developer"
}
```

**Lab exercise:** Update the definition file to match a more realistic configuration:

```json
{
  "orgName": "My Salesforce Project Dev",
  "edition": "Developer",
  "features": [
    "EnableSetPasswordInApi"
  ],
  "settings": {
    "lightningExperienceSettings": {
      "enableS1DesktopEnabled": true
    }
  },
  "hasSampleData": false
}
```

### Expected Outcome
Project directory exists with correct structure. `sfdx-project.json` reviewed and updated. Scratch org definition file updated.

---

## Part 3: Authenticate to Dev Hub

### Step 3.1 — Log In to Dev Hub

```bash
sf org login web \
  --instance-url https://login.salesforce.com \
  --alias DevHub
```

This opens your browser. Log in with your Developer Edition credentials.

### Step 3.2 — Set Default Dev Hub

```bash
sf config set target-dev-hub DevHub
```

### Step 3.3 — Verify Authentication

```bash
sf org list
```

You should see your Dev Hub listed with type "DevHub".

### Troubleshooting
- **"Please authorize an org first"** — The `sf org login web` command didn't complete. Try again, ensure the browser redirect completes.
- **"Dev Hub not found"** — Ensure Dev Hub is enabled in Setup (Part 0).
- **"Login URL mismatch"** — If your Dev Hub is a sandbox, use `--instance-url https://test.salesforce.com`

---

## Part 4: Create a Scratch Org

### Step 4.1 — Create the Scratch Org

```bash
sf org create scratch \
  --definition-file config/project-scratch-def.json \
  --alias MyScratchOrg \
  --duration-days 7 \
  --target-dev-hub DevHub
```

This will take 1-3 minutes. You should see output like:
```
Creating scratch org... Done
Successfully created scratch org: 00D...
Your scratch org was created with username test-xxxx@example.com
```

### Step 4.2 — Open the Scratch Org

```bash
sf org open --target-org MyScratchOrg
```

This opens the scratch org in your browser. Explore it — it should be a clean, empty Developer Edition org.

### Step 4.3 — View Scratch Org Details

```bash
sf org display --target-org MyScratchOrg
```

Note the username, instance URL, and expiry date.

### Step 4.4 — Set as Default Org

```bash
sf config set target-org MyScratchOrg
```

### Troubleshooting
- **"Scratch org creation limit exceeded"** — You've hit the daily scratch org creation limit. Wait until tomorrow or delete existing scratch orgs: `sf org delete scratch --target-org <alias>`
- **"Dev Hub is not enabled"** — Return to the Dev Hub setup in Prerequisites.

---

## Part 5: Create Metadata and Push to Scratch Org

### Step 5.1 — Create a Custom Object

Create the directory structure:

```bash
mkdir -p force-app/main/default/objects/Project__c/fields
```

Create the object metadata file at `force-app/main/default/objects/Project__c/Project__c.object-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomObject xmlns="http://soap.sforce.com/2006/04/metadata">
    <deploymentStatus>Deployed</deploymentStatus>
    <enableActivities>false</enableActivities>
    <enableBulkApi>true</enableBulkApi>
    <enableFeeds>false</enableFeeds>
    <enableHistory>false</enableHistory>
    <enableLicensing>false</enableLicensing>
    <enableReports>true</enableReports>
    <enableSearch>true</enableSearch>
    <enableSharing>true</enableSharing>
    <label>Project</label>
    <nameField>
        <label>Project Name</label>
        <type>Text</type>
    </nameField>
    <pluralLabel>Projects</pluralLabel>
    <searchLayouts/>
    <sharingModel>ReadWrite</sharingModel>
    <visibility>Public</visibility>
</CustomObject>
```

### Step 5.2 — Create a Custom Field

Create `force-app/main/default/objects/Project__c/fields/Status__c.field-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Status__c</fullName>
    <externalId>false</externalId>
    <label>Status</label>
    <required>false</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Planning</fullName>
                <default>true</default>
                <label>Planning</label>
            </value>
            <value>
                <fullName>Active</fullName>
                <default>false</default>
                <label>Active</label>
            </value>
            <value>
                <fullName>Completed</fullName>
                <default>false</default>
                <label>Completed</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

### Step 5.3 — Create an Apex Class

Create `force-app/main/default/classes/ProjectService.cls`:

```apex
public with sharing class ProjectService {
    
    public static List<Project__c> getActiveProjects() {
        return [
            SELECT Id, Name, Status__c 
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
}
```

Create `force-app/main/default/classes/ProjectService.cls-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>62.0</apiVersion>
    <status>Active</status>
</ApexClass>
```

### Step 5.4 — Create an Apex Test Class

Create `force-app/main/default/classes/ProjectServiceTest.cls`:

```apex
@isTest
public class ProjectServiceTest {
    
    @testSetup
    static void setupData() {
        List<Project__c> projects = new List<Project__c>{
            new Project__c(Name = 'Project Alpha', Status__c = 'Active'),
            new Project__c(Name = 'Project Beta', Status__c = 'Planning'),
            new Project__c(Name = 'Project Gamma', Status__c = 'Completed')
        };
        insert projects;
    }
    
    @isTest
    static void testGetActiveProjects() {
        Test.startTest();
        List<Project__c> activeProjects = ProjectService.getActiveProjects();
        Test.stopTest();
        
        System.assertEquals(1, activeProjects.size(), 'Should return 1 active project');
        System.assertEquals('Project Alpha', activeProjects[0].Name, 'Active project should be Alpha');
    }
    
    @isTest
    static void testActivateProject() {
        Project__c planningProject = [SELECT Id FROM Project__c WHERE Status__c = 'Planning' LIMIT 1];
        
        Test.startTest();
        ProjectService.activateProject(planningProject.Id);
        Test.stopTest();
        
        Project__c updated = [SELECT Status__c FROM Project__c WHERE Id = :planningProject.Id];
        System.assertEquals('Active', updated.Status__c, 'Project should now be Active');
    }
}
```

Create `force-app/main/default/classes/ProjectServiceTest.cls-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>62.0</apiVersion>
    <status>Active</status>
</ApexClass>
```

### Step 5.5 — Deploy (Push) to Scratch Org

```bash
sf project deploy start --source-dir force-app --target-org MyScratchOrg
```

Expected output:
```
Deploying v62.0 metadata to MyScratchOrg using the v62.0 SOAP API
...
Status: Succeeded   
Component: ApexClass - ProjectService
Component: ApexClass - ProjectServiceTest
Component: CustomObject - Project__c
```

### Step 5.6 — Run Tests in Scratch Org

```bash
sf apex test run \
  --test-level RunLocalTests \
  --target-org MyScratchOrg \
  --result-format human \
  --wait 10
```

Expected outcome: Both test methods in `ProjectServiceTest` pass.

### Troubleshooting
- **"Compile error in ProjectService.cls"** — Check XML formatting in the cls-meta.xml file; API version must match.
- **"Object Project__c does not exist"** — Push the object before the class that references it, or push them together with `--source-dir force-app`.
- **"Test failure: List has no rows"** — Check that @testSetup data is correct and the test query matches.

---

## Part 6: Make Changes in Scratch Org and Pull Back

### Step 6.1 — Make a Change in the Org UI

1. Open the scratch org: `sf org open --target-org MyScratchOrg`
2. Navigate to Setup → Objects → Project → Fields
3. Create a new custom field: `Priority__c` (Picklist: High, Medium, Low)
4. Save the field

### Step 6.2 — Check for Changes

```bash
sf project retrieve preview --target-org MyScratchOrg
```

This shows what has changed in the org (would be retrieved).

### Step 6.3 — Pull Changes Back to Source

```bash
sf project retrieve start --target-org MyScratchOrg
```

### Step 6.4 — Verify the Retrieved File

```bash
ls force-app/main/default/objects/Project__c/fields/
```

You should see `Priority__c.field-meta.xml` as a new file.

### Expected Outcome
`Priority__c.field-meta.xml` exists in the fields directory with the picklist values you created in the UI.

---

## Part 7: Set Up Git and .forceignore

### Step 7.1 — Initialize Git Repository

```bash
git init
git branch -m main
```

### Step 7.2 — Create or Update .gitignore

Review the existing `.gitignore` (likely generated by `sf project generate`). Ensure it includes:

```
# Salesforce CLI
.sfdx/
.localdevserver/
.sf/

# Node modules
node_modules/
npm-debug.log

# IDE
.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Credentials (NEVER commit these)
.env
*.pem
server.key
config/jwt/
```

### Step 7.3 — Review .forceignore

Open `.forceignore`. Add entries to protect environment-specific metadata:

```
# .forceignore
# Profiles - deploy carefully, not wholesale
**/profiles/

# Installed managed package components
**/installedPackages/

# Named Credentials (environment-specific)
**/namedCredentials/
```

### Step 7.4 — Stage and Commit

```bash
# Check status first
git status

# Add all files (review the list carefully)
git add force-app/
git add config/
git add sfdx-project.json
git add .gitignore
git add .forceignore

# Create initial commit
git commit -m "feat: initial project setup with Project__c object and ProjectService class

- Add Project__c custom object with Status__c and Priority__c picklist fields
- Add ProjectService Apex class with active project query and activation method
- Add ProjectServiceTest with testSetup pattern and bulk-safe tests
- Configure sfdx-project.json for Developer edition
- Configure scratch org definition file with Lightning Experience enabled"
```

### Step 7.5 — Verify Git History

```bash
git log --oneline
git status
```

Expected: One commit in history, no uncommitted changes.

---

## Part 8: Practice Commands — Scratch Org Lifecycle

### Step 8.1 — View Current Org List

```bash
sf org list
```

### Step 8.2 — Deploy a Specific Component

```bash
# Deploy only the Apex class
sf project deploy start --metadata ApexClass:ProjectService --target-org MyScratchOrg
```

### Step 8.3 — Retrieve Specific Metadata Type

```bash
# Retrieve all Apex classes
sf project retrieve start --metadata ApexClass --target-org MyScratchOrg
```

### Step 8.4 — Run a Specific Test

```bash
sf apex test run \
  --tests ProjectServiceTest \
  --target-org MyScratchOrg \
  --code-coverage \
  --result-format human
```

### Step 8.5 — Delete the Scratch Org (After Lab)

```bash
sf org delete scratch --target-org MyScratchOrg --no-prompt
```

**Important:** Only do this when you're done with the lab. The scratch org will be permanently deleted.

---

## Lab Completion Checklist

- [ ] Salesforce CLI installed and verified (`sf --version`)
- [ ] Dev Hub enabled and authenticated
- [ ] SFDX project created with correct structure
- [ ] Scratch org definition file updated with settings
- [ ] Scratch org created and accessible
- [ ] Project__c object with Status__c and Priority__c fields deployed to scratch org
- [ ] ProjectService.cls and ProjectServiceTest.cls deployed and tests pass
- [ ] Changes made in scratch org UI successfully pulled back via `sf project retrieve start`
- [ ] Git repository initialized with meaningful initial commit
- [ ] `.gitignore` and `.forceignore` correctly configured
- [ ] Scratch org cleaned up (deleted)

---

## Key Commands Summary

```bash
# Install CLI
npm install -g @salesforce/cli@latest

# Authenticate
sf org login web --alias DevHub
sf config set target-dev-hub DevHub

# Project
sf project generate --name my-project
sf config set target-org MyScratchOrg

# Scratch Org
sf org create scratch --definition-file config/project-scratch-def.json --alias MyScratchOrg --duration-days 7
sf org open --target-org MyScratchOrg
sf org display --target-org MyScratchOrg
sf org delete scratch --target-org MyScratchOrg

# Deploy/Retrieve
sf project deploy start --source-dir force-app
sf project deploy validate --source-dir force-app
sf project retrieve start
sf project retrieve preview

# Tests
sf apex test run --test-level RunLocalTests --result-format human --wait 10
sf apex run --file scripts/seed.apex
```

---

## Extension Exercises (Optional)

1. **Create a Lightning Web Component:** Add a simple `projectList` LWC that queries `ProjectService` and displays results. Push to the scratch org and view in App Builder.

2. **Set up npm + Jest:** Run `npm init` and `npm install @salesforce/lwc-jest --save-dev`. Create a Jest test file for your LWC.

3. **Multiple scratch orgs:** Create a second scratch org `MyScratchOrg2` with a different alias. Practice switching between orgs using `sf config set target-org`.

4. **Conflict simulation:** Make a change to `ProjectService.cls` in both the scratch org (via Execute Anonymous) and in the local file, then observe the conflict on retrieve.
