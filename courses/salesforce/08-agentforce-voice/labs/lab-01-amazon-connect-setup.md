# Lab 01: Amazon Connect Setup for Service Cloud Voice

## Overview

In this lab you will stand up the complete infrastructure required for Service Cloud Voice using Amazon Connect as the telephony provider. By the end of this lab, you will have a working phone number that rings through Amazon Connect into Salesforce, with a basic Contact Flow that transfers callers to a Salesforce Omni-Channel queue.

This lab covers the full integration stack: creating an Amazon Connect instance, installing the Salesforce managed package for Voice, configuring the Contact Flow in Amazon Connect, creating the Voice Call Center in Salesforce, and making a verified test call.

## Prerequisites

- Salesforce org with Service Cloud Voice enabled (Service Cloud license + Voice add-on)
- AWS account with permissions to create Amazon Connect instances and IAM roles
- Salesforce administrator profile in your org
- A web browser with both the Salesforce Setup and AWS Console open in separate tabs
- A phone for making test calls (mobile phone or softphone)

## Estimated Time

90 minutes

---

## Lab Steps

### Step 1: Create an Amazon Connect Instance

1. Log in to the AWS Management Console at https://console.aws.amazon.com and navigate to the **Amazon Connect** service.
2. Click **Create instance**.
3. On the **Identity management** page, select **Store users within Amazon Connect** (appropriate for lab environments; production may use SAML/Active Directory).
4. Enter an **Access URL** identifier — for example, `certcorp-voice-lab` — which becomes part of your Connect instance URL (e.g., `certcorp-voice-lab.awsapps.com/connect`).
5. Click **Next step**.
6. On the **Administrator** page, create an admin account for Amazon Connect. Enter a username (e.g., `connect-admin`) and a secure password. Record these credentials.
7. Click **Next step** and skip the telephony options page (leave defaults). Click **Next step** again.
8. On the **Data storage** page, leave the default S3 bucket names for call recordings and chat transcripts. These will be auto-generated (e.g., `amazon-connect-xxxxxxxxx`).
9. Click **Next step**, review the summary, and click **Create instance**.
10. Wait approximately 2-3 minutes for the instance to provision. When status changes to **Active**, click the instance name to open the Connect instance settings.

**Expected Result:** Your Amazon Connect instance is active and accessible at your chosen URL. The main Amazon Connect dashboard is visible.

---

### Step 2: Claim a Phone Number in Amazon Connect

1. From the Amazon Connect instance home screen, click **Log in** to open the Connect administration console.
2. Sign in with the admin credentials you created in Step 1.
3. In the left navigation, go to **Channels > Phone numbers**.
4. Click **Claim a number**.
5. Select the **DID (Direct Inward Dialing)** tab for a regular phone number.
6. Select your country (e.g., United States), choose a state/area code, and select any available number from the list.
7. Under **Contact flow / IVR**, leave this as **Default inbound flow** for now — you will update it in Step 4.
8. Click **Save** to claim the number. Record the phone number for use in testing.

**Expected Result:** A DID phone number appears in your Phone Numbers list with status **In service**. Calling the number will currently connect to the Default inbound flow.

---

### Step 3: Install the Salesforce Voice for Amazon Connect Managed Package

1. Switch to your Salesforce browser tab. Go to **Setup > Apps > AppExchange Marketplace** or navigate directly to the AppExchange at https://appexchange.salesforce.com.
2. Search for **"Service Cloud Voice for Amazon Connect"** in the AppExchange search bar.
3. Locate the official Salesforce-published managed package for Service Cloud Voice (Amazon Connect).
4. Click **Get It Now** and authenticate with your Salesforce credentials when prompted.
5. On the installation page, select **Install in This Org** (not a sandbox, for this lab).
6. Choose **Install for Admins Only** for the security access level.
7. Click **Install** and accept the third-party access prompt if it appears.
8. Installation takes 3-5 minutes. You will receive a confirmation email when complete. Click **Done** to return to Salesforce Setup.

**Verification:** Go to **Setup > Apps > Installed Packages** and confirm that the Amazon Connect CTI Adapter (or "Service Cloud Voice for Amazon Connect") package appears with a green status indicator.

---

### Step 4: Configure the Amazon Connect Contact Flow for Salesforce Integration

1. Return to your Amazon Connect console tab.
2. In the left navigation, click **Routing > Contact flows**.
3. Click **Create contact flow**.
4. Name the flow `Salesforce-Voice-Inbound-Lab`.
5. From the flow element palette on the left, find and drag the **Invoke Lambda function** block (you will use this for Salesforce CTI handshake in advanced setups — for this lab, use a simpler approach).
6. Instead, use the following minimal Contact Flow for the lab:
   - Add a **Set contact attributes** block. Set attribute Key = `SourceSystem`, Value = `Salesforce`. Click **Save**.
   - Add a **Transfer to phone number** block configured for your Salesforce telephony endpoint (this transfers the voice stream to Salesforce). For lab purposes, add a **Transfer to queue** block instead and select the **BasicQueue** default queue.
   - Connect: Entry point → Set contact attributes → Transfer to queue → End flow.
7. Click **Save** in the top-right corner, then click **Publish**.
8. Return to **Channels > Phone numbers**, click your claimed number, and change the **Contact flow** dropdown from Default inbound flow to `Salesforce-Voice-Inbound-Lab`. Click **Save**.

**Expected Result:** The Contact Flow is published and assigned to your phone number. Calls to that number will now be processed by your custom flow.

---

### Step 5: Create the Voice Call Center in Salesforce

1. In Salesforce Setup, search for **"Call Centers"** in the Quick Find box and click **Call Centers**.
2. Click **Import** (you will import a Call Center Definition file from the Amazon Connect managed package).
3. If an import file was installed with the managed package, it appears in your org's Static Resources. Navigate to **Setup > Custom Code > Static Resources** and search for a resource named something like `AmazonConnectCallCenterDefinition`. Download the XML file.
4. Return to **Call Centers > Import** and upload the XML file. Click **Import**.
5. After import, the new Call Center appears in the list. Click the Call Center name to open its settings.
6. Update the following fields:
   - **CTI Adapter URL:** Enter your Amazon Connect instance URL from Step 1 (e.g., `https://certcorp-voice-lab.awsapps.com/connect/ccp-v2`)
   - **Use Amazon Connect:** Set to `true`
   - **Softphone Layout:** Select the default layout (or create one — see next step)
7. Click **Save**.

**Expected Result:** A Voice-enabled Call Center record exists in Salesforce with your Amazon Connect CTI adapter URL configured.

---

### Step 6: Create a Softphone Layout and Add Agents to the Call Center

1. In Setup Quick Find, search for **"Softphone Layouts"** and click **Softphone Layouts**.
2. Click **New** to create a layout.
3. Name it `Voice Lab Softphone Layout`.
4. Under **Screen Pop Settings**, configure:
   - **No Matching Records:** Open to New Case
   - **Single Matching Record:** Open the record detail page
   - **Multiple Matching Records:** Open a disambiguation list
5. Under **Screen Pop Log Calls**, check **Log Calls** to ensure a Task record is created for each call.
6. Click **Save**.
7. Return to **Call Centers** and open your Voice Lab Call Center.
8. Click the **Manage Call Center Users** button.
9. Click **Add More Users**. Search for your own user (and any test agent users) and add them to the Call Center.
10. On the Call Center detail page, update the **Softphone Layout** field to `Voice Lab Softphone Layout`.
11. Click **Save**.

**Expected Result:** Your user (and test agents) are members of the Voice Lab Call Center. Each member can access the CTI adapter and will receive screen pops according to the layout rules.

---

### Step 7: Configure the Voice Channel and Omni-Channel Queue

1. In Setup, search for **"Service Channels"** and click **Service Channels**.
2. If a Voice service channel does not exist, click **New**:
   - Channel Name: `Voice`
   - Salesforce Object: `VoiceCall`
   - Enable **Reduce wait time by matching routing model** (optional for lab)
   - Click **Save**
3. In Setup, search for **"Queues"** and click **Queues**.
4. Click **New** to create a Voice queue:
   - Label: `Voice Support Queue`
   - Queue Email: your email address
   - Supported Objects: `VoiceCall`
   - Add your user to the Queue Members section
   - Click **Save**
5. In Setup, search for **"Routing Configurations"** and click **Routing Configurations**.
6. Click **New**:
   - Routing Configuration Name: `Voice Routing`
   - Overflow Assignee: `Voice Support Queue`
   - Routing Model: `Least Active`
   - Units of Capacity: `1.00`
   - Priority: `1`
   - Click **Save**
7. Return to your Voice Support Queue and edit it to associate the `Voice Routing` routing configuration.

**Expected Result:** A Voice Omni-Channel Service Channel, queue, and routing configuration exist and are linked. Agents in the queue will receive VoiceCall work items when calls arrive.

---

### Step 8: Make a Test Call

1. In Salesforce, open the **Service Console** app (or App Launcher > Service Console).
2. In the lower-left utility bar, you should see the **Phone (CTI)** softphone widget. Click it to expand.
3. Set your agent status to **Available** in the Omni-Channel widget (also in the utility bar).
4. From your mobile phone (or any external phone), dial the Amazon Connect phone number you claimed in Step 2.
5. Observe the following in Salesforce:
   - The CTI softphone widget rings and shows the incoming call
   - Accept the call in the softphone widget by clicking the green Accept button
   - After accepting: check whether a screen pop fires (it may show a new Case or Contact form if no record matches your mobile number)
6. Say something into the phone and confirm audio is two-way.
7. Click **Disconnect** in the softphone to end the call.
8. After the call ends, navigate to **App Launcher > VoiceCall** (or use the Search bar to find VoiceCall records) and confirm a VoiceCall record was created with the call details.

**Expected Result:** The end-to-end call path works: Amazon Connect → CTI adapter → Salesforce routing → agent desktop ring → screen pop → VoiceCall record creation.

---

## Verification

Confirm all of the following before considering this lab complete:

- [ ] Amazon Connect instance is Active and accessible at your instance URL
- [ ] A DID phone number is claimed and In Service in Amazon Connect
- [ ] The Service Cloud Voice managed package is installed in your Salesforce org
- [ ] A Voice Call Center exists in Salesforce with the correct CTI Adapter URL
- [ ] Your user is a member of the Call Center
- [ ] A Voice Service Channel, Voice Support Queue, and Routing Configuration are configured and linked
- [ ] A test call successfully rang the agent desktop and was accepted
- [ ] A VoiceCall record was created in Salesforce after the test call

---

## Troubleshooting

**CTI widget does not appear in Service Console:** Ensure you are a member of the Call Center (Step 6). Also check that the Softphone Layout is assigned to your profile in Setup > Softphone Layouts.

**Test call goes to voicemail / rings but does not reach Salesforce:** Verify that the Contact Flow in Amazon Connect is published (not just saved) and that it is assigned to the phone number in Channels > Phone Numbers.

**Screen pop does not fire:** Screen pop requires a matching phone number in Salesforce. On first test, your mobile number likely has no match — this is expected. The screen pop should open a New Case form. If nothing opens, check the Softphone Layout Screen Pop settings in Step 6.

**Audio is one-way (you can hear caller but they cannot hear you):** This is usually a microphone permissions issue in the browser. Click the padlock icon in the browser address bar and ensure microphone access is granted for the Salesforce domain.

**VoiceCall record not created:** Check that your Voice Service Channel is configured with `VoiceCall` as the Salesforce Object (Step 7). Also confirm the managed package installed correctly — VoiceCall is a standard object added by the package.

---

## Lab Summary

In this lab you completed the foundational infrastructure for Service Cloud Voice with Amazon Connect:

- Created and configured an Amazon Connect instance with a claimed DID phone number
- Installed the Salesforce Voice for Amazon Connect managed package
- Built a basic Amazon Connect Contact Flow and assigned it to a phone number
- Created the Salesforce Call Center record with CTI Adapter URL and Softphone Layout
- Added agents to the Call Center and configured the Omni-Channel Voice queue and routing
- Validated the end-to-end path with a live test call and confirmed VoiceCall record creation

This infrastructure is the foundation for all subsequent Agentforce Voice configuration. In Lab 02, you will build an Agentforce agent on top of this voice channel.
