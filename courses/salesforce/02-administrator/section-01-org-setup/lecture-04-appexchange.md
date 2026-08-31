# L04: AppExchange

## 🎯 Learning Objectives
- Explain what AppExchange is and how it fits into the Salesforce ecosystem
- Distinguish between managed and unmanaged packages and their implications
- Describe the AppExchange security review process and license management

## 📊 SLIDES

### Slide 1: What Is AppExchange?
**Visual:** Screenshot of the AppExchange homepage (appexchange.salesforce.com) showing the search bar, category tiles (Sales, Service, Marketing, IT), and featured app listings with star ratings.
**Content:**
- **AppExchange** is Salesforce's marketplace for pre-built apps, components, and solutions
- Hosted at **appexchange.salesforce.com**
- Listings include: Apps, Components, Lightning Bolt Solutions, Flow Templates, and more
- Over 7,000 solutions available; includes both free and paid listings
- Published by Salesforce, Salesforce partners (ISVs), and community developers
**Speaker Notes:** Think of AppExchange as the App Store or Google Play for Salesforce. Instead of building every feature from scratch, you can find pre-built solutions for common business needs — HR management, document generation, e-signatures, marketing automation, and thousands more. Some are free, some are paid, and many offer a free trial period so you can test before you buy.

### Slide 2: Types of AppExchange Content
**Visual:** Icon grid with four quadrants: App (puzzle pieces), Component (building block), Lightning Bolt (lightning bolt icon), Flow Template (flow arrows) — each with a one-line description.
**Content:**
- **Apps:** Full-featured applications (e.g., a complete HR management app)
- **Components:** Individual Lightning Web Components or Aura components to embed in pages
- **Lightning Bolt Solutions:** Industry-specific starter templates (community + app + flows)
- **Flow Templates:** Pre-built flows for automation that you can install and customize
- **Consultants:** Salesforce-certified implementation partners (also listed on AppExchange)
**Speaker Notes:** Not everything on AppExchange is a full app. Components are smaller building blocks you drop onto a page in Lightning App Builder. Lightning Bolt Solutions are end-to-end templates designed for specific industries like Financial Services or Healthcare. Flow Templates are ready-made automations you can deploy immediately or use as a starting point. The exam may ask you to identify the right AppExchange asset type for a given scenario.

### Slide 3: Managed vs. Unmanaged Packages
**Visual:** Two-column comparison: Managed Package (padlocked code icon, ISV logo, version number) vs. Unmanaged Package (open code icon, editable pencil). Key rows: Code Visibility, Upgradable, Support, Namespace.
**Content:**
- **Managed Package:** Code is protected (components hidden); upgradable; has a namespace prefix; supported by the publisher
- **Unmanaged Package:** Code is fully visible and editable; NOT upgradable; no namespace; used for open sharing of components
- Managed packages can be distributed commercially on AppExchange
- Unmanaged packages are commonly used to share developer templates, sample code, or Trailhead labs
**Speaker Notes:** This distinction is heavily tested on the exam. Managed packages are what ISVs use to distribute commercial products. Because the code is protected, the vendor can push upgrades without exposing their intellectual property. Unmanaged packages expose all the components and code, making them great for learning and customization but not for commercial software. If you install an unmanaged package and the publisher updates it, you won't automatically get those updates — you'd have to reinstall.

### Slide 4: Installing a Package
**Visual:** Step-by-step flow diagram: AppExchange listing → "Get It Now" button → Login to Salesforce → Choose org type (Production / Sandbox) → Set security settings → Install for Admins / All Users / Specific Profiles → Installation complete.
**Content:**
- Click **Get It Now** on any AppExchange listing to begin installation
- Choose whether to install in **Production** or a **Sandbox**
- Best practice: Always test installs in a **Sandbox first**, then deploy to Production
- Installation security options: Install for Admins Only, Install for All Users, Install for Specific Profiles
- Post-install: Check Setup > Installed Packages to manage or uninstall
**Speaker Notes:** The installation security option during install is important — it controls which profiles get access to the new app's components immediately. Choosing "Install for Admins Only" is the safest choice during initial testing. You can always expand access later. The Installed Packages page in Setup is where you manage everything after installation, including uninstalling packages you no longer need.

### Slide 5: AppExchange Security Review
**Visual:** Shield icon in the center with five surrounding labels: "Static Code Analysis," "Manual Testing," "Penetration Testing," "Data Security Check," "Salesforce Trust Review."
**Content:**
- All commercial listings on AppExchange must pass Salesforce's **Security Review**
- Review includes: static code analysis, manual testing, penetration testing
- Ensures the app doesn't compromise org security or user data
- Passing the review earns the **Security Reviewed** badge on the listing
- Free/open-source listings may bypass the full security review
**Speaker Notes:** The Security Review is what differentiates AppExchange from random code you might find online. When you see the Security Reviewed badge, it means Salesforce has run that app through a rigorous testing process. This is a meaningful assurance for companies in regulated industries. Note that free and open-source listings don't always carry this badge, so you should evaluate them more carefully before installing in Production.

### Slide 6: License Management App (LMA)
**Visual:** Diagram showing the relationship: ISV's Org → AppExchange Listing → Customer Org, with the LMA sitting in the ISV's org and arrows showing subscriber information flowing back.
**Content:**
- **License Management App (LMA):** Used by ISVs (not end customers) to manage subscriber licenses
- Allows ISVs to see who has installed their app and how many licenses each customer has
- End admins manage their own installed package licenses at: **Setup > Installed Packages > [Package] > Manage Licenses**
- Admins can assign or revoke package licenses to individual users from this page
**Speaker Notes:** If you're an admin at a company that installs AppExchange apps, the License Management App is not something you interact with directly — that's the ISV's tool. What you do interact with is the Manage Licenses section within your own Installed Packages page. From there you can see how many seats your company purchased and assign them to specific users. Running out of seats means users won't be able to access the app until you purchase more or revoke a license from someone else.

### Slide 7: Trailhead and AppExchange Learning
**Visual:** Split screen: Trailhead GO app on a phone, with the Trailhead mascot Astro, alongside a "Trailmix" screen showing a curated learning path.
**Content:**
- **Trailhead:** Salesforce's free, gamified learning platform (trailhead.salesforce.com)
- **Trailhead GO:** Mobile app for Salesforce learning on iOS and Android
- Trailhead modules use Developer Edition orgs (Trailhead Playgrounds) for hands-on practice
- Content covers admin, developer, architect, and business user topics
- Completing Trailhead content earns badges and superbadges; many link to certification preparation
**Speaker Notes:** Trailhead is free and frankly one of the best learning platforms in enterprise software. If you haven't set up a Trailhead account yet, do it now. The hands-on challenges — called Trailhead Playgrounds — give you a real Salesforce environment to practice in. Superbadges are longer, scenario-based challenges that simulate real admin work and are excellent preparation for the CRT-101 exam.

### Slide 8: Key AppExchange Exam Facts
**Visual:** Reference card cheat sheet.
**Content:**
- Managed packages: code protected, upgradable, have namespace prefix
- Unmanaged packages: code visible, NOT upgradable, no namespace
- Always install in **Sandbox first**, then Production
- Security Review badge = Salesforce has tested the app for security
- Manage user licenses for installed packages at: **Setup > Installed Packages > Manage Licenses**
- Installation options: Admins Only, All Users, Specific Profiles
**Speaker Notes:** These are the AppExchange facts most likely to appear on the exam. The managed vs. unmanaged distinction is the most tested topic from this lecture. Always default to sandbox-first for any package installation. And remember where to manage licenses for packages your company has installed.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 4 — AppExchange. This lecture covers Salesforce's marketplace for pre-built apps and components, the important distinction between package types, and how the security review and licensing processes work.

AppExchange is Salesforce's version of an app store. You'll find it at appexchange.salesforce.com. Over seven thousand solutions are available, ranging from simple Lightning components to full enterprise applications for HR, finance, legal, and more. Some listings are free. Many are paid. Most offer a trial. Publishers include Salesforce itself, certified partner companies called ISVs — Independent Software Vendors — and individual community developers.

The content types on AppExchange go beyond just "apps." There are individual Lightning Components you can drop onto a record page. There are Lightning Bolt Solutions, which are industry-specific starter kits with a prebuilt community, app, and flows bundled together. There are Flow Templates — ready-to-deploy automations. And there are consultant listings for when you need a Salesforce implementation partner.

Now let's get into the exam's favorite AppExchange topic: managed packages versus unmanaged packages. A managed package is what commercial ISVs use to distribute their products. The code is protected — you can use the components but you can't see the underlying Apex code or modify the metadata. This protection allows the vendor to push upgrades to you over time. Managed packages also have a namespace prefix to prevent conflicts with your own customizations.

An unmanaged package is the opposite. All components are fully exposed and editable. They're commonly used to share developer resources, sample code, or Trailhead lab exercises. But because there's no protection, there's no upgrade path. If you install an unmanaged package and the author releases a new version, you don't automatically get those changes — you'd have to reinstall manually. This is the key distinction: managed packages are upgradable; unmanaged packages are not.

When you're ready to install something from AppExchange, the process starts with clicking "Get It Now" on the listing. You'll log into your Salesforce account, choose whether to install in a Production org or a Sandbox, and then set the installation security — who gets access right away. Best practice is always to install in a Sandbox first, validate it, and then install in Production. The Installed Packages page in Setup is where you manage everything post-installation.

Every commercial listing on AppExchange must pass Salesforce's Security Review — a process that includes static code analysis, manual testing, and penetration testing. When you see the Security Reviewed badge, you know Salesforce has vetted that app. Free and open-source listings don't always carry this badge, so do your own due diligence before installing those in a Production environment.

After installation, you manage user licenses for the package at Setup > Installed Packages > click the package > Manage Licenses. This is where you assign access to specific users and track how many seats you've consumed versus how many you've purchased.

That wraps up the Org Setup section. Next we move into User Management, starting with how to create and manage user accounts.

## 🔔 EXAM TIPS
- **Managed vs. Unmanaged:** Managed = protected code, upgradable, has namespace. Unmanaged = open code, not upgradable, no namespace. This distinction appears on almost every practice exam.
- **Sandbox first:** The best practice answer for AppExchange installation is always to test in a sandbox before installing in Production. If a question asks what to do before installing a package, "test in sandbox" is almost always correct.
- **Manage Licenses path:** To assign AppExchange package licenses to users, go to Setup > Installed Packages > [Package Name] > Manage Licenses.

## ✅ LECTURE SUMMARY
- AppExchange is Salesforce's marketplace for apps, components, Lightning Bolt Solutions, and flow templates
- Managed packages have protected code, support upgrades, and have a namespace prefix; unmanaged packages are fully open but not upgradable
- All commercial AppExchange listings must pass Salesforce's Security Review
- Best practice: always install packages in a Sandbox before installing in Production
- Post-install license management is done at Setup > Installed Packages > Manage Licenses

## ❓ MINI QUIZ

**Q1:** A company installs an app from AppExchange. Six months later, the app publisher releases a new version with bug fixes. Which package type allows the admin to receive these upgrades automatically?
- A) Unmanaged Package
- B) Managed Package
- C) Both package types support automatic upgrades
- D) Upgrades require reinstalling any package type
**Answer:** B — Managed packages support version upgrades from the publisher. Unmanaged packages cannot be upgraded and would require a full reinstallation to get the new version.

**Q2:** Before installing a new AppExchange app in Production, what is the recommended best practice?
- A) Review the app in Trailhead first
- B) Install it for Admins Only to limit initial access
- C) Install and test it in a Sandbox environment first
- D) Contact Salesforce Support to approve the installation
**Answer:** C — Best practice is always to install and validate an AppExchange package in a Sandbox before deploying to Production. This prevents unexpected impacts to your live environment.

**Q3:** An administrator installs an AppExchange managed package. Where can they assign the package licenses to specific users?
- A) Setup > Users > Manage Licenses
- B) Setup > Permission Sets > [Package Permission Set]
- C) Setup > Installed Packages > [Package Name] > Manage Licenses
- D) The AppExchange portal at appexchange.salesforce.com
**Answer:** C — Package license assignment is done at Setup > Installed Packages > click the specific package > Manage Licenses. This page shows how many licenses are available and allows the admin to assign or revoke them.
