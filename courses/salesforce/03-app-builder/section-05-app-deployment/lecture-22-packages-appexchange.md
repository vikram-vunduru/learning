# L22: Packages & AppExchange

## Exam Domain
App Deployment — 10% of exam weight

---

## Core Concepts

### Three Package Types
Packages are containers of metadata that can be installed into Salesforce orgs. The three types: (1) **Unmanaged Package** — all source code visible, no upgrade path, no namespace required; good for templates and internal sharing. (2) **Managed Package** — Apex code obfuscated, upgradeable, namespace required, required for public AppExchange listings; the commercial ISV model. (3) **Unlocked Package** — Salesforce DX-based, source visible, upgradeable, optional namespace, for internal enterprise modular development; not AppExchange eligible.

### Managed Package Key Properties
Managed packages protect the ISV's intellectual property by obfuscating Apex code. A **namespace prefix** is required — every component in the package gets the prefix appended (e.g., `myns__Project__c`, `myns.MyApexClass`). This prevents naming conflicts with the customer's existing components. Managed packages support **upgrades** — new versions can be installed on top of existing installations without data loss. Only managed packages can be listed on the public AppExchange.

### AppExchange Security Review
All apps listed publicly on AppExchange must pass a **mandatory security review** by Salesforce. This review checks for code vulnerabilities, data exposure risks, and compliance with platform guidelines. It cannot be skipped. Listed apps can include full applications (managed packages), Lightning components, pre-built Flows, and consultant/service listings.

### Package Installation Options
When installing a package, you choose who gets access: **Install for Admins Only** (safest — lets admins configure before rollout), **Install for All Users** (broad access), or **Install for Specific Profiles** (granular control). The direct install URL format is `https://login.salesforce.com/packaging/installPackage.apx?p0=<version_id>`.

### Uninstall = Data Loss Warning
Uninstalling a managed or unmanaged package removes ALL package components, including any custom objects the package introduced. Any data records stored in those custom objects are also deleted. Always export data from package custom objects before uninstalling. Managed and unlocked packages can be upgraded (install new version over old) — upgrade doesn't lose data. Unmanaged packages have no upgrade path; you must uninstall and reinstall.

---

## PTA / SA Relevance

**ISV architecture:** If a customer is building a product for AppExchange, they need a Managed Package with a namespace. This is fundamentally different from building a custom org — you can't use the same metadata patterns, and the development lifecycle (1GP packaging org or 2GP DX-based) affects the entire team workflow. Early architectural decisions about namespace and package structure are very hard to change later.

**Namespace conflicts:** When a customer installs a managed package with namespace `myns`, any component named `myns__Something__c` in their own org would conflict. In practice, Salesforce prevents this — you can't have a component with a namespace prefix unless you registered that namespace. But it's worth knowing that installed packages coexist cleanly with customer metadata.

**Unlocked packages for enterprise:** For large enterprise customers building modular implementations, unlocked packages let them split a large org into independent modules (e.g., Core CRM, Sales Module, Service Module) each with their own package version, CI/CD pipeline, and promotion path. This is the modern alternative to monolithic change-set deployments.

**License Management App (LMA):** ISV partners use the LMA (installed in their own Salesforce org) to see which orgs have their package installed and how many licenses are being used. The LMA is not relevant to customers — it's a partner tool.

---

## Architecture / How It Works

```
Package Type Comparison:
┌──────────────────────┬─────────────┬─────────────┬─────────────┐
│ Property             │ Unmanaged   │ Managed     │ Unlocked    │
├──────────────────────┼─────────────┼─────────────┼─────────────┤
│ Source visibility    │ Full        │ Obfuscated  │ Full        │
│ Apex protection      │ No          │ Yes         │ No          │
│ Upgradeable          │ No          │ Yes         │ Yes         │
│ Namespace required   │ No          │ Yes         │ Optional    │
│ AppExchange eligible │ No          │ Yes         │ No          │
│ Use case             │ Templates,  │ Commercial  │ Enterprise  │
│                      │ demos       │ ISV apps    │ modules     │
│ Source control       │ No (native) │ 1GP: no     │ Yes (DX)    │
│                      │             │ 2GP: yes    │             │
└──────────────────────┴─────────────┴─────────────┴─────────────┘
```

**Limitations:**
- Unmanaged packages have no upgrade path — new version requires uninstall + reinstall (data loss risk)
- Managed packages cannot be fully deleted once installed — only uninstalled by customers
- Unlocked packages require Salesforce DX tooling and developer skills
- Namespace registration is permanent — you cannot change or reassign a namespace once registered

```
Namespace Prefix Behavior:
                                                               
  Package namespace: "myns"                                    
                                                               
  Custom Object in package:     Project__c                    
  After installation:           myns__Project__c              
                                                               
  Apex class in package:        ProjectHelper                 
  After installation:           myns.ProjectHelper            
                                                               
  Customer's own Object:        Project__c                    
  No conflict — different names:                               
  ┌──────────────────┬───────────────────────────────────┐    
  │ Customer's       │ myns__Project__c (package)        │    
  │ Project__c       │ Project__c (customer's own)       │    
  └──────────────────┴───────────────────────────────────┘    
  Both coexist without conflict.                               
```

**Limitations:**
- All Apex, objects, fields, and flows in the package get the namespace prefix — EVERY component
- Namespace cannot be changed after registration — choose carefully
- References within the package must use fully namespaced names in code

```
AppExchange Listing Types:
┌────────────────────────────────────────────────────────────────┐
│  AppExchange (appexchange.salesforce.com) contains:            │
│                                                                │
│  • Apps (managed packages) — full applications                 │
│  • Components — LWC/Aura components                            │
│  • Flows — pre-built automation flows                          │
│  • Bolt Solutions — industry templates                         │
│  • Consultants — partner service listings                      │
│                                                                │
│  All PUBLIC listings require Salesforce Security Review.       │
│  Security review is mandatory — not optional.                  │
└────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Security review takes weeks and requires the package to pass Salesforce's security scanner
- A listing can be sold or free — pricing is up to the ISV
- Free AppExchange apps still require security review

---

## Key Facts to Memorize
- Three package types: Unmanaged (visible, no upgrade, no namespace) / Managed (obfuscated, upgradeable, namespace required, AppExchange) / Unlocked (visible, upgradeable, optional namespace, internal use)
- Only Managed packages can be on the public AppExchange
- Namespace prefix format: `namespace__ComponentName__c` (objects/fields), `namespace.ClassName` (Apex)
- Security Review is mandatory for ALL public AppExchange listings
- Install options: Admins Only / All Users / Specific Profiles
- Uninstall = all components AND data deleted from custom objects
- LMA = License Management App — ISV tool to track package installations (in ISV's own org)
- Upgrade (managed/unlocked): install new version over old — no data loss; no uninstall needed

---

## Exam Traps
- **Only managed packages on AppExchange.** Unmanaged and unlocked packages cannot be listed on AppExchange.
- **Security review is mandatory.** Every public AppExchange listing — paid or free — requires Salesforce security review.
- **Namespace is permanent.** Once registered, you cannot change or reassign a namespace. This is a real risk for ISVs — choose wisely.
- **Uninstall ≠ upgrade.** Managed and unlocked packages are upgraded by installing a new version — no uninstall. Only unmanaged packages require uninstall+reinstall for a new version.
- **Uninstall causes data loss.** If custom objects from the package have data, uninstalling deletes that data. Export first.
- **LMA is for the ISV, not the customer.** Customers don't install the LMA — it's the ISV's tool.

---

## Practice Questions

**Q:** A software company wants to sell an app on AppExchange where customers cannot read the Apex source code and can receive automatic version updates. Which package type should be used?
**A:** Managed Package — it provides Apex code obfuscation (protecting intellectual property), supports in-place upgrades (customers install new versions without data loss), and is required for public AppExchange listings.

**Q:** A customer installs a managed package with namespace "acme" that includes a custom object "Ticket__c." The customer already has their own custom object named "Ticket__c." What happens after installation?
**A:** Both objects coexist — the installed package object appears as "acme__Ticket__c" in the customer's org, while the customer's existing object remains "Ticket__c." The namespace prefix prevents any naming conflict.

**Q:** An admin uninstalls a managed AppExchange package that had 5,000 support tickets stored in a package custom object. What happens to those records?
**A:** The records are deleted — uninstalling a package removes all package components including custom objects and any data records stored in those objects. The admin should have exported the data before uninstalling.
