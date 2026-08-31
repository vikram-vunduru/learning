# L27: Chatter & Collaboration

## 🎯 Learning Objectives
- Explain Chatter features including posts, groups, mentions, and hashtags
- Configure Chatter groups (public, private, unlisted) and manage Chatter files
- Describe Chatter licensing (Chatter Free vs full licenses) and admin configuration options

## 📊 SLIDES

### Slide 1: What Is Chatter?
**Visual:** Chatter feed screenshot showing posts, comments, likes, file attachments, and @mentions on a record
**Content:**
- Chatter is Salesforce's enterprise social collaboration platform
- Allows users to post updates, share files, comment, and @mention colleagues
- Available on: record feeds, profile feeds, group feeds, and the home Chatter tab
- Key Chatter features: Posts, Comments, Likes, @Mentions, # Topics, Files
- Chatter is enabled by default in most Salesforce orgs
- Setup path: Setup → Chatter Settings → Enable Chatter
**Speaker Notes:** Chatter transforms Salesforce from a data entry system into a collaborative workspace. Instead of emailing your colleague about an Opportunity update, you post it directly on the Opportunity record where it's visible to everyone with access. This creates a contextual, searchable conversation history tied to the record.

### Slide 2: Chatter Feed Types
**Visual:** Three feed types displayed side by side: Record Feed (on a Case), Profile Feed (on a User), Group Feed (in a Chatter Group)
**Content:**
- **Record Feed:** Conversations and updates attached to a specific Salesforce record (Case, Opportunity, Contact, etc.)
- **Profile Feed:** Posts on a user's personal profile; similar to a social media wall
- **Group Feed:** Discussion threads within a Chatter Group (team collaboration space)
- **Home/Chatter Tab:** Aggregated feed showing all posts from followed records, people, and groups
- Record feed posts and field changes (tracked fields) appear together in one timeline
- Field tracking in Chatter: enabled per object to show field change history in the feed
**Speaker Notes:** The aggregated Chatter feed on the home tab is the user's personalized news feed — they see updates from everything they follow. Record feeds are the most business-relevant: they keep conversations attached to the records they're about, creating institutional knowledge that doesn't disappear into email inboxes.

### Slide 3: Posts, Comments, Likes & @Mentions
**Visual:** Chatter post showing: author avatar, post text with @mention highlighted, hashtag, Like count, Comment thread below
**Content:**
- **Posts:** Text updates, links, files, polls, or questions posted to a feed
- **Comments:** Replies threaded under a post (keeps conversation organized)
- **Likes:** Simple endorsement of a post (similar to social media)
- **@Mention:** Tag a specific user or group (e.g., @JaneDoe) — notifies them immediately
- **# Hashtags/Topics:** Categorize posts with a topic (e.g., #ProductFeedback) — searchable across the org
- Mentioned users receive a Chatter notification and email notification (configurable)
**Speaker Notes:** @Mentions are particularly powerful for getting someone's attention on a specific record. If you @mention a colleague on an Opportunity, they receive an in-app notification and typically an email, and the Opportunity now appears in their Chatter feed. This is much more effective than a general email because the context lives on the record.

### Slide 4: Chatter Groups
**Visual:** Group type comparison table showing Public, Private, and Unlisted groups with visibility and join-ability differences
**Content:**
- **Public Group:** Visible to all users; anyone can join and post; content searchable org-wide
- **Private Group:** Visible to all users (they can see it exists); must REQUEST to join; content only visible to members
- **Unlisted Group:** Invisible to non-members; only accessible via direct invitation or URL
- Groups have: Name, Description, Members, Files, and Feed
- Group owners and managers can add/remove members, change settings, post announcements
- Chatter Groups are different from Salesforce Public Groups (used for sharing/queues)
**Speaker Notes:** The three group types address different collaboration needs. Public groups are for open, company-wide discussions. Private groups are for team-specific collaboration where membership is controlled but the group's existence is known. Unlisted groups are for sensitive topics — executive discussions, HR matters — where even the existence of the group shouldn't be publicly visible.

### Slide 5: Chatter Files
**Visual:** File shared in Chatter feed showing file name, preview thumbnail, version history link, and share options
**Content:**
- Users can attach files to Chatter posts directly or share from Salesforce Files library
- File size limits: up to 2 GB per file for files stored in Salesforce Files (CRM Content)
- Chatter post attachment limit: 25 MB per file attached directly to a post
- Files shared in Chatter are stored in Salesforce Files (Content) and can be versioned
- File sharing permissions follow the feed visibility — if you can see the post, you can download the file
- Files can be shared with a specific record, group, or person
**Speaker Notes:** The distinction between file size limits matters for the exam: 2 GB for files in Salesforce Files library, 25 MB per file attached directly to a Chatter post. Files shared in Chatter automatically benefit from Salesforce Files version control — when someone uploads a new version, old versions are preserved and accessible.

### Slide 6: Chatter Email Digest
**Visual:** Email digest preview showing summary of Chatter activity with frequency options: Daily, Weekly, Never
**Content:**
- Chatter Email Digest sends a summary of new Chatter activity via email
- Frequency options: Every Post (immediate), Daily Digest, Weekly Digest, Never
- Users configure their own digest frequency in personal settings
- Admins can set default email notification preferences org-wide
- @Mention notifications are always immediate (cannot be delayed to digest)
- Setup: Setup → Chatter Settings → Default Email Notification Settings
**Speaker Notes:** Email Digest is how Chatter bridges the gap between Salesforce users who live in the app all day and those who don't. For occasional users, a daily digest catches them up on relevant conversations. Remember that @mention notifications are always real-time — they bypass the digest schedule to ensure important callouts are seen promptly.

### Slide 7: Enabling Chatter & Admin Settings
**Visual:** Setup → Chatter Settings page showing toggles: Enable Chatter, Allow Records Without Feeds, Allow Coworker Invitations, Feed Tracking
**Content:**
- Enable Chatter: Setup → Chatter Settings → Enable Chatter
- **Feed Tracking:** Configure which objects and fields have Chatter feeds and tracked field changes
- Setup → Feed Tracking: Select object → Select fields to track in the feed
- Chatter can be disabled per profile: profile → Chatter permission → remove "Use Chatter" permission
- Allow Coworker Invitations: Let existing users invite non-Salesforce employees to Chatter Free
- Chatter REST API available for external application integration
**Speaker Notes:** Feed Tracking is an important admin configuration. Not every object has feed tracking enabled by default, and you can choose which field changes appear in the record's Chatter feed. For example, tracking "Stage" changes on Opportunities means every stage change gets recorded as a Chatter feed update visible to followers.

### Slide 8: Chatter Free License vs Full Salesforce License
**Visual:** Comparison table: Chatter Free (limited to Chatter, Files, Profiles, Groups) vs Full License (all CRM + Chatter features)
**Content:**
- **Chatter Free License:** Free; allows access to Chatter features only — posts, groups, files, profiles; NO access to standard Salesforce objects (Accounts, Contacts, Cases, etc.)
- **Chatter External License:** For external users outside the company (customers, partners) with restricted Chatter access
- **Full Salesforce License (CRM):** Includes all Chatter features plus full access to Salesforce objects
- Chatter Free users can collaborate on files and posts but cannot view or edit CRM records
- Use case: onboarding new employees before assigning full licenses; external collaborators
- License comparison: Help → Salesforce Help for current pricing and availability
**Speaker Notes:** Chatter Free licenses are a cost-effective way to give employees collaboration capabilities while they're waiting for full CRM license allocation, or for users who only need to participate in discussions — like marketing or HR — without needing to access sales data. For the exam, know that Chatter Free users CANNOT see standard Salesforce CRM objects.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 27 — Chatter and Collaboration. Chatter is Salesforce's built-in social collaboration tool, and while it might seem simple on the surface, there's meaningful admin configuration knowledge tested on the CRT-101 exam.

Let's start with the basics. Chatter lets users post updates, share files, comment on posts, like things, tag colleagues with @mentions, and organize content with hashtag topics. It works across three main surfaces: record feeds attached to specific Salesforce records, profile feeds on user pages, and group feeds within Chatter Groups.

Record feeds are the most powerful use case. When you post a comment on an Opportunity, it lives on that Opportunity forever. Anyone following that Opportunity sees it. Compare that to sending an email — the context lives in someone's inbox, invisible to the rest of the team. Chatter keeps collaboration in context.

@Mentions are the most important notification mechanism. When you type @JaneDoe in a post, Jane gets an immediate in-app and email notification pointing her directly to that post. This is how you loop in a colleague who needs to see something specific. Topics — the hashtag feature — let you tag posts with keywords like #PriceList or #SupportIssue, making them searchable across the org.

Chatter Groups are collaboration spaces for teams. There are three types. Public groups are visible to everyone and open for anyone to join. Private groups are visible (you can see the group exists) but require a join request — membership is controlled. Unlisted groups are completely hidden from non-members — they're for sensitive discussions where even the group's existence shouldn't be advertised. Important note: Chatter Groups are completely separate from Salesforce Public Groups, which are used for record sharing and queue membership.

For files, users can attach files to Chatter posts. The file size limit for direct post attachments is 25 MB. Files stored in the Salesforce Files library (Content) can be up to 2 GB each. Files shared through Chatter benefit from version control — uploading a new version preserves previous versions.

Chatter Email Digest keeps users in the loop even when they're not logged into Salesforce. Users can set their digest frequency — every post, daily, weekly, or never — based on how often they want updates. One critical exception: @mention notifications are always immediate. They don't wait for the digest. If someone @mentions you, you get notified right away.

From an admin configuration perspective, Chatter is enabled at Setup → Chatter Settings. Feed Tracking is the configuration that controls which objects have record feeds and which field changes get displayed in those feeds. You enable it per object and select which fields to track. For example, enable Stage tracking on Opportunity so every stage change shows up as a feed update.

Finally, licensing. Chatter Free is a free license type that gives users access to Chatter features — posts, groups, files, profiles — but NO access to CRM records like Accounts, Contacts, or Cases. Full Salesforce licenses include all CRM functionality plus Chatter. Chatter Free is useful for users who need to collaborate but don't need CRM access — like someone in HR or Facilities.

That's Chatter and Collaboration! You've now completed the entire Sales Marketing, Service Support, and Activity Chatter sections of the Admin course. You're well-positioned for the CRT-101 exam.

## 🔔 EXAM TIPS
- **Chatter Groups have 3 types:** Public (open, visible, joinable by anyone), Private (visible but request-to-join), Unlisted (invisible to non-members).
- **Chatter Groups ≠ Salesforce Public Groups:** Chatter Groups are for collaboration; Public Groups are for sharing rules and queue membership.
- **Chatter Free users cannot see CRM objects:** They have access to Chatter features only — no Accounts, Contacts, Opportunities, etc.
- **@Mention notifications are always immediate:** They bypass email digest frequency settings.
- **File attachment limit on posts is 25 MB:** The Files library supports up to 2 GB per file.
- **Feed Tracking must be configured per object:** Enabling Chatter doesn't automatically track field changes — you configure Feed Tracking separately.

## ✅ LECTURE SUMMARY
- Chatter is Salesforce's built-in social collaboration tool; active on record feeds, profile feeds, and group feeds
- Features: Posts, Comments, Likes, @Mentions (immediate notification), # Topics/Hashtags
- Chatter Groups: Public (anyone can join), Private (request required), Unlisted (hidden from non-members)
- File attachments on posts: 25 MB limit; Salesforce Files library: up to 2 GB per file
- Chatter Email Digest frequency: Every Post, Daily, Weekly, Never; @mentions always send immediate notifications
- Enable Chatter: Setup → Chatter Settings; configure Feed Tracking per object in Setup → Feed Tracking
- Chatter Free License: Chatter access only, no CRM objects; Full License includes Chatter + CRM

## ❓ MINI QUIZ

**Q1:** A department wants a Chatter group for executive discussions that should not be discoverable by general employees — not even its existence should be visible in the group directory. Which group type should the administrator set up?
- A) Private Group
- B) Public Group with restricted membership
- C) Unlisted Group
- D) Org-Wide Chatter Group with view permission removed
**Answer:** C — Unlisted Groups are completely hidden from non-members. They don't appear in the group directory and cannot be searched by users who are not members. They're the appropriate choice when the group's existence itself is sensitive.

**Q2:** An administrator notices that when the Stage field on an Opportunity changes, the change does NOT appear in the Opportunity's Chatter feed. Chatter is enabled for the org. What must the administrator configure?
- A) Enable "Track Field Changes" in Opportunity Settings
- B) Add Stage to Feed Tracking for the Opportunity object in Setup → Feed Tracking
- C) Enable the "Record Feed" permission on all user profiles
- D) The Stage field automatically appears in the feed when Chatter is enabled; no extra configuration is needed
**Answer:** B — Feed Tracking must be explicitly configured for each object. The administrator must navigate to Setup → Feed Tracking, select Opportunity, and add the Stage field to the list of tracked fields. Only after this configuration will Stage changes appear as feed updates on Opportunity records.

**Q3:** A company wants to give its Marketing team the ability to collaborate in Chatter, share files, and participate in Chatter groups — but Marketing does not need access to Accounts, Contacts, Opportunities, or Cases. Which license type is most appropriate?
- A) Platform License
- B) Full Salesforce CRM License
- C) Chatter Free License
- D) Service Cloud License
**Answer:** C — Chatter Free License gives users access to Chatter features (posts, groups, files, profile) without granting access to standard CRM objects. It is free and appropriate for users who only need collaboration capabilities, not CRM data access.
