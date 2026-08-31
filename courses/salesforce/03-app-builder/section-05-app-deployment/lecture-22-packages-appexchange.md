# L22: Packages & AppExchange

## 🎯 Learning Objectives
- Distinguish between Unmanaged, Managed (1GP/2GP), and Unlocked Package types and their appropriate use cases
- Understand the AppExchange ecosystem including security review requirements, licensing, and installation options
- Know how namespace prefixes work and how package installation and uninstallation behave in Salesforce

## 📊 SLIDES

### Slide 1: What Are Packages?
**Visual:** Diagram showing a "Package" container holding metadata components (objects, fields, Apex, flows) with arrows pointing to multiple target orgs labeled "Install"
**Content:**
- A **package** is a container of metadata components that can be installed into a Salesforce org
- Packages enable reuse: build once, install many times across different orgs
- Use cases:
  - **ISVs (Independent Software Vendors):** distribute apps on AppExchange to customers
  - **Internal teams:** share reusable components or templates across multiple orgs
  - **Partners:** distribute pre-built industry solutions
- Packages come in three types: Unmanaged, Managed, and Unlocked
- Each type has different rules around visibility, upgradeability, and namespace requirements
**Speaker Notes:** Packages are a distribution mechanism — think of them as a ZIP file of Salesforce metadata that can be installed and run in another org. The package type determines how much protection the source code gets, whether the package can be upgraded, and whether it can appear on AppExchange. The exam focuses primarily on distinguishing the three types and their properties.

---

### Slide 2: Unmanaged Packages
**Visual:** Icon of an "open box" with visible code/config inside, labeled "Full Source Visible," "No Upgrade Path," "Good for Templates"
**Content:**
- **All source code is fully visible** to the installer — no obfuscation or protection
- Components can be freely modified by the installing org after installation
- **Cannot be upgraded** — if the package creator releases a new version, the installer must uninstall the old version and install the new one
- **No namespace prefix required** — components keep their original API names
- Best use cases:
  - Starter templates and sample apps
  - Internal distribution within a company
  - Training and demo orgs
  - Open-source Salesforce solutions
- Not eligible for AppExchange public listings
**Speaker Notes:** Unmanaged packages are like sharing raw metadata. The installer gets everything and can change anything. This is great when you want someone to take your work and customize it freely — like sharing a data model template with a partner org. However, because there's no namespace and no upgrade path, they're not suitable for commercial distribution where you want to maintain and update a product over time.

---

### Slide 3: Managed Packages (1GP & 2GP)
**Visual:** Two-column comparison: 1st Gen Packaging (1GP) vs 2nd Gen Packaging (2GP) — rows for: Development Org, Namespace, Source Control, Scratch Org Support, AppExchange
**Content:**
- **Apex code is obfuscated/protected** — installers cannot see or modify the source code
- **Namespace prefix required** — all components get a prefix (e.g., `myns__Field__c`, `myns__MyClass`)
- **Upgradeable** — package creator can release new versions; installers can upgrade without losing data
- **Required for public AppExchange listings** — Salesforce's commercial marketplace
- **1st Generation (1GP):**
  - Built in a dedicated Developer Edition org ("packaging org")
  - Older model, still supported
- **2nd Generation (2GP):**
  - Built using Salesforce DX and scratch orgs
  - Source stored in version control (Git)
  - More flexible, recommended for new ISV development
- **Beta vs Released versions:** Beta = testing only, not for production; Released = ready for customers
**Speaker Notes:** The key managed package distinction is that the code is protected — a customer installs your app but cannot read your Apex logic. The namespace is critical because it prevents component naming conflicts between the package and the installer's org. When a customer updates from version 1.0 to 1.5, Salesforce handles the upgrade without requiring a reinstall or data loss. The exam does not go deep on 1GP vs 2GP mechanics but does test the overall managed package concepts.

---

### Slide 4: Unlocked Packages (Salesforce DX)
**Visual:** Modular architecture diagram showing one org split into three unlocked packages: "Core Data Model," "Sales Module," "Service Module" — each deployed independently
**Content:**
- **Part of Salesforce DX (2nd Generation Packaging)**
- Source code is visible (like unmanaged packages), but the package is version-controlled and upgradeable
- **No namespace required** (unlike managed packages) — optional namespace
- Designed for **modular development** within a single company
- Use case: split a large org into independent deployable modules that can be versioned and promoted separately
- Source lives in **Git** — packages are built from source and promoted through environments
- Supports **patch versions, scratch orgs, CI/CD pipelines**
- Not suitable for AppExchange public listings (no code protection)
- Better for **internal enterprise teams** than for ISV distribution
**Speaker Notes:** Unlocked packages bridge the gap between change sets (no version control, no modularity) and managed packages (code protection, ISV-focused). They're the recommended approach for large enterprise teams who want modular, version-controlled deployments without the commercial ISV overhead. The key differentiator from managed packages: no code obfuscation, no namespace requirement, internal use only.

---

### Slide 5: AppExchange Overview
**Visual:** AppExchange homepage screenshot showing "Apps," "Components," "Consultants," and "Solutions" categories with featured listings and star ratings
**Content:**
- **AppExchange** is Salesforce's official marketplace for pre-built apps and components
- URL: appexchange.salesforce.com
- Listing types:
  - **Apps** — full applications (managed packages)
  - **Components** — Lightning Web Components, Aura components
  - **Flows** — pre-built automation flows
  - **Consultants** — partner service listings
- **Free and paid** listings — pricing varies by ISV
- Listings can be installed directly from AppExchange into any Salesforce org
- **Security Review** by Salesforce is **mandatory** for all public listings before they can be published
- Listings can be reviewed, rated, and trialed before purchase
**Speaker Notes:** AppExchange is a key differentiator for the Salesforce platform — the ability to install a pre-built, Salesforce-native solution in minutes is a major selling point. For the exam, know that AppExchange only contains managed packages (or officially reviewed components), the security review is not optional for public listings, and AppExchange covers apps, components, flows, and consultant listings.

---

### Slide 6: Namespace Prefix
**Visual:** Before/after table showing a custom object API name "Project__c" becoming "myns__Project__c" after namespace registration, and an Apex class "ProjectHelper" becoming "myns.ProjectHelper"
**Content:**
- A **namespace prefix** is a unique identifier registered with Salesforce and prepended to all component API names in a managed package
- Format: `namespace__ComponentName__c` for objects/fields, `namespace.ClassName` for Apex
- **Prevents naming conflicts:** if the installing org has its own "Project__c" object, the package's object appears as "myns__Project__c" — no collision
- Namespace is registered once per Developer Edition org and cannot be changed
- Required for: 1GP and 2GP Managed Packages, optional for Unlocked Packages
- Not required for: Unmanaged Packages, Change Sets
- All API references in the package code must use the fully namespaced name
**Speaker Notes:** Namespace prefixes are essential to managed package architecture. Because Salesforce allows each org to use the same API names for their own components, namespaces ensure installed packages don't collide with the customer's existing customizations. Once a namespace is registered and tied to a package, it's permanent — you cannot change it or reuse it. This is why naming your namespace carefully matters.

---

### Slide 7: Installing Packages
**Visual:** Installation wizard showing three options: Install for Admins Only, Install for All Users, Install for Specific Profiles — with radio buttons
**Content:**
- **How to install:**
  - Click the AppExchange "Get It Now" button and follow prompts
  - Use a direct install URL: `https://login.salesforce.com/packaging/installPackage.apx?p0=<package_version_id>`
  - Setup → Installed Packages → Install a Package
- **Installation options:**
  - **Install for Admins Only** — only System Administrators can see and use the package components
  - **Install for All Users** — all profiles get access (use with caution — may expose unwanted features)
  - **Install for Specific Profiles** — granularly assign access profile by profile (recommended)
- After installation, manage licenses (for paid apps) and configure any required setup steps
- New package versions can be installed on top of existing installations to upgrade
**Speaker Notes:** The three installation profile options are commonly tested. "Install for Admins Only" is the safest starting point — it lets admins configure the package before rolling it out to users. "Install for All Users" is rarely the right answer in a production environment unless the package is simple and broadly applicable. The direct install URL pattern using the package version ID is used by ISVs for customer distribution and is worth recognizing.

---

### Slide 8: License Management & Uninstalling Packages
**Visual:** License Management App (LMA) screenshot showing installed orgs list with subscriber count and license usage; below it, an "Uninstall" confirmation dialog with a warning about data loss
**Content:**
- **License Management App (LMA):**
  - A Salesforce-provided tool for ISV partners who distribute managed packages on AppExchange
  - Tracks how many orgs have installed the package
  - Manages seat licenses (how many users can use the package per subscriber org)
  - Installed in the ISV's own Salesforce org
- **Uninstalling a package:**
  - Setup → Installed Packages → Uninstall
  - Removes all package components from the org
  - **Warning:** if records exist in the package's custom objects, you can choose to export data first, but the objects and records will be deleted
  - Unmanaged packages can be fully removed; managed packages can also be uninstalled (but data is lost)
- **Upgrading:** for managed/unlocked packages, install the new version over the existing one — no uninstall needed
**Speaker Notes:** The data loss warning on uninstall is important for the exam: if a package includes a custom object with customer records stored in it, uninstalling the package deletes those records. This is why you should export data before uninstalling. The LMA is specifically for ISVs — it's not something a customer installs; the ISV installs it in their own org to manage their subscriber base.

## 🎙️ RECORDING SCRIPT

Welcome to Lecture 22 on Packages and AppExchange. This topic covers how Salesforce metadata gets distributed and installed across orgs — both internally within companies and commercially through the AppExchange marketplace.

Let's start with package types because the exam loves testing the differences.

Unmanaged packages are the simplest. They're a bundle of metadata that you can install into another org. Everything is fully visible — the installer can see all the source code, all the configuration, and they can modify anything they want. But there's no upgrade path. If you release version 2, the installer has to uninstall the old version and install the new one manually. No namespace required. These are great for templates, demos, or sharing starting points with partners.

Managed packages are the commercial-grade option. The Apex source code is obfuscated — customers install your app but can't read your code. A namespace prefix is required, which gets appended to every component API name in the package. This prevents naming collisions with the customer's own customizations. And critically, managed packages are upgradeable — you can push new versions to your customers, and they can upgrade without losing their data. Managed packages are required for public AppExchange listings. There are two generations: 1GP, which uses a dedicated packaging org, and 2GP, which uses Salesforce DX and source control. Both are on the exam at a conceptual level.

Unlocked packages are the third type — a Salesforce DX innovation. They're source-controlled, version-controlled, and upgradeable like managed packages, but the code is visible like unmanaged packages. No namespace required. They're designed for large internal enterprise teams who want to split their org into modular, independently deployable pieces. Not for AppExchange — no code protection.

Now, AppExchange. It's Salesforce's official marketplace at appexchange.salesforce.com. You'll find full apps, Lightning components, pre-built flows, and consultant listings. Before any app can be published publicly on AppExchange, Salesforce runs a mandatory security review — they scan for vulnerabilities and ensure the package meets their security standards. This is not optional.

When you install a package, you choose who gets access: admins only, all users, or specific profiles. "Admins only" is the safe starting point because it lets you configure before rolling out. The direct install URL using the package version ID is how ISVs distribute packages outside of AppExchange.

Namespace prefixes are worth a moment. When a managed package with namespace "myns" installs a custom object called "Project__c," it appears in the customer's org as "myns__Project__c." This prevents it from conflicting with any "Project__c" the customer already has. Every component in the package — fields, classes, triggers — gets that prefix.

Finally, uninstalling: if you uninstall a package that has records stored in its custom objects, those records get deleted. Always export the data first. Upgrading managed and unlocked packages doesn't require uninstall — you just install the new version on top.

## 🔔 EXAM TIPS
- **Three Package Types:** Unmanaged (visible code, no upgrade, no namespace), Managed (obfuscated code, upgradeable, namespace required, AppExchange eligible), Unlocked (visible code, upgradeable, optional namespace, internal use).
- **Managed Package = AppExchange Eligible:** Only managed packages can be listed on the public AppExchange. Unmanaged and unlocked packages cannot.
- **Namespace Required For:** Managed packages (both 1GP and 2GP). Optional for unlocked packages. Not required for unmanaged packages or change sets.
- **Security Review:** Mandatory for all public AppExchange listings — Salesforce reviews the package for security vulnerabilities before publishing.
- **Installation Options:** Three choices — Admins Only, All Users, Specific Profiles. Know when each is appropriate.
- **Uninstall = Data Loss:** Uninstalling a package removes all package components including any records stored in the package's custom objects.
- **LMA (License Management App):** Used by ISVs (package publishers) to track installations and manage licenses. Installed in the ISV's own org.
- **Upgrade Path:** Managed and unlocked packages can be upgraded by installing a new version over the existing one. Unmanaged packages have no upgrade path.

## ✅ LECTURE SUMMARY
- Three package types: Unmanaged (visible code, no upgrade, templates/internal use), Managed (obfuscated, upgradeable, namespace required, AppExchange), Unlocked (visible code, upgradeable, modular internal development)
- Managed packages require a namespace prefix that is prepended to all component API names (e.g., `myns__Object__c`) to prevent naming conflicts
- AppExchange is Salesforce's marketplace for apps, components, and flows — all public listings require a mandatory security review by Salesforce
- Package installation offers three profile options: Admins Only, All Users, or Specific Profiles
- The License Management App (LMA) is used by ISVs to track and manage package installations and licenses across subscriber orgs
- Uninstalling a package removes all components and any data records stored in the package's custom objects — export data first
- Managed and unlocked packages support in-place upgrades; unmanaged packages have no upgrade path and require uninstall/reinstall

## ❓ MINI QUIZ

**Q1:** A Salesforce ISV partner wants to sell an app on the AppExchange. The app contains Apex code that should not be visible to customers, and customers should be able to receive updates without reinstalling. Which package type should the ISV use?
- A) Unmanaged Package
- B) Unlocked Package
- C) Managed Package
- D) Change Set

**Answer:** C — Managed packages are the only type that provides code obfuscation (protecting Apex source), supports upgrades (customers can install new versions without data loss), and is eligible for public AppExchange listings. Unmanaged packages expose source code and cannot be upgraded; unlocked packages expose source code and cannot be listed on AppExchange.

---

**Q2:** A company installs an AppExchange package with the setting "Install for Admins Only." A sales rep reports that they cannot see the new app in their App Launcher. What is the most likely cause and solution?
- A) The package was not installed correctly — reinstall with "Install for All Users"
- B) The sales rep's profile was not included during installation — edit the package installation settings to include their profile
- C) The package requires a managed license to be assigned to the sales rep
- D) The sales rep needs the "Customize Application" permission to view installed packages

**Answer:** B — "Install for Admins Only" restricts access to System Administrators. To give the sales rep access, the admin should go to Setup > Installed Packages, find the package, and update the profile access settings to include the sales rep's profile (or change to "Install for Specific Profiles" and select the relevant profile).

---

**Q3:** An admin installs a managed package that includes a custom object "myns__Project__c." After installation, the admin notices their org already had its own "Project__c" custom object. What is true about this situation?
- A) The installation fails because the API name conflicts with the existing object
- B) The existing Project__c object is replaced by the package's version
- C) Both objects coexist — the package object has a namespace prefix preventing a naming conflict
- D) The package object is renamed to "Project2__c" automatically

**Answer:** C — The namespace prefix (myns__) is specifically designed to prevent naming conflicts. The installed package object is "myns__Project__c" and the org's existing object remains "Project__c" — they are entirely separate objects with no conflict. This is one of the primary purposes of namespace prefixes in managed packages.
