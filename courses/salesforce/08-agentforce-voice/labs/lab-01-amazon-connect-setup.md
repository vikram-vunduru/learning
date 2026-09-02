# Lab 01 — Amazon Connect Setup

## What You Need to Be Able to Do

This lab tests your ability to connect an Amazon Connect instance to Salesforce Service Cloud Voice and verify the integration end-to-end.

---

### Pre-Lab: AWS Prerequisites
- [ ] Confirm you have AWS console access with appropriate IAM permissions (Amazon Connect admin)
- [ ] Identify or create an Amazon Connect instance
- [ ] Note the Amazon Connect Instance ARN (format: `arn:aws:connect:<region>:<account-id>:instance/<instance-id>`)
- [ ] Enable Amazon Connect Contact Lens on the instance (required for real-time transcription)
- [ ] Confirm the Amazon Connect phone number is claimed and assigned to a Contact Flow

---

### Part 1: Service Cloud Voice Setup in Salesforce

- [ ] Navigate to Setup → Quick Find: "Voice Settings" → enable Service Cloud Voice at the org level
- [ ] Navigate to Setup → Company Information → confirm Service Cloud Voice feature license is present
- [ ] Navigate to Setup → Users → [Admin User] → Permission Set Licenses → assign "Service Cloud Voice (Partner Telephony)" permission set license
- [ ] Navigate to Setup → Named Credentials → create a Named Credential for the Amazon Connect integration (authentication type: Amazon Web Services)
- [ ] Enter the AWS Access Key ID and Secret Access Key with Amazon Connect API permissions

---

### Part 2: Create the Voice Call Center

- [ ] Navigate to Setup → Voice Call Centers → New
- [ ] Select telephony partner: Amazon Connect
- [ ] Enter the Call Center Name (e.g., "US Contact Center")
- [ ] Paste the Amazon Connect Instance ARN (copied from AWS console)
- [ ] Save the Call Center
- [ ] Verify: no error on save (ARN format validation)
- [ ] Add your user to the Call Center: Voice Call Centers → [Call Center] → Manage Call Center Users → Add

---

### Part 3: Configure Omni-Channel for Voice

- [ ] Setup → Omni-Channel Settings → enable Omni-Channel
- [ ] Setup → Omni-Channel → Service Channels → New → create a Voice Service Channel (Object: VoiceCall)
- [ ] Setup → Omni-Channel → Routing Configurations → New → create a Voice Routing Config (Model: Most Available; Capacity: 100)
- [ ] Setup → Omni-Channel → Queues → New → create a Voice Queue → assign the Routing Config
- [ ] Setup → Omni-Channel → Presence Configurations → New → add "Available for Voice" presence status
- [ ] Setup → Omni-Channel → Presence Statuses → New → create "Available for Voice" status → assign to relevant profiles

---

### Part 4: Add Softphone Widget to Lightning App

- [ ] Setup → App Manager → [Service Console app] → Edit → Utility Items → Add: Voice Softphone
- [ ] Configure the widget label and size
- [ ] Save the app

---

### Part 5: Test the Integration

- [ ] Set your Omni-Channel status to "Available for Voice" in the Service Console
- [ ] From a mobile phone, call the Amazon Connect claimed phone number
- [ ] Verify: the softphone widget shows an incoming call notification
- [ ] Accept the call from the softphone widget
- [ ] Verify: the real-time transcript starts populating (requires Contact Lens to be enabled)
- [ ] Speak a few sentences; verify each sentence appears as a ConversationEntry
- [ ] End the call
- [ ] Wait 30–60 seconds, then verify the VoiceCall record shows:
  - [ ] Status = Completed
  - [ ] Duration populated
  - [ ] ConversationEntry records with speaker labels and confidence scores
  - [ ] VoiceCallRecording URL populated (if recording is enabled in Amazon Connect)
- [ ] Verify screen pop: if your user's phone number is stored as a Contact, verify the Contact record opened automatically

---

### Lab Complete Checklist

- [ ] Amazon Connect instance connected to Salesforce without ARN errors
- [ ] Named Credential valid (no authentication errors in Named Credential test)
- [ ] Softphone widget visible in Service Console
- [ ] Inbound test call received and accepted via softphone
- [ ] Real-time transcript appeared during the call
- [ ] VoiceCall record fully populated after call ended
- [ ] ConversationEntry records present with correct speaker labels

---

### Common Failure Points to Remember

| Symptom | Root Cause | Fix |
|---|---|---|
| Softphone widget not visible | Utility item not added to app OR missing per-user permission set | Add utility item in App Manager; assign SCV permission set license |
| Transcript not appearing | Contact Lens not enabled on Amazon Connect instance | Enable Contact Lens in AWS Amazon Connect Settings |
| No screen pop | Phone number format mismatch (ANI = E.164, Contact = national format) | Standardize Contact.Phone to E.164 |
| ARN error on Call Center save | ARN copied incorrectly or missing a segment | Copy ARN directly from Amazon Connect console → Instance settings |
| VoiceCall record shows Error | Named Credential invalid or expired | Re-enter AWS credentials in Named Credential |
