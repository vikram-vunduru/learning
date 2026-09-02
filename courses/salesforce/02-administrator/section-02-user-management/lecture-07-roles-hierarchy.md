# Roles & Role Hierarchy

## Exam Domain
Configuration & Setup — 20% of exam

## Core Concepts

Roles control record visibility — not what you can do, but what records you can SEE. This is the opposite of profiles/permission sets (which control what you can do). The role hierarchy determines who can see whose records.

**The key rule:** A user can see all records owned by users BELOW them in the role hierarchy. Visibility only flows UPWARD — managers see subordinates' records, not the other way around.

**Roles vs Profiles — don't confuse them:**
| | Profile | Role |
|---|---|---|
| Controls | What you CAN DO | What you CAN SEE |
| Required? | Yes (1 per user) | No (optional) |
| Mechanism | Object/field permissions | Record visibility |
| Hierarchy effect | None | Upward visibility |

**Role hierarchy — how it works:**
- Assign every user a role (optional but strongly recommended for orgs with Private OWD)
- The hierarchy is a tree: CEO → VP Sales → Regional Manager → Sales Rep
- A Regional Manager sees all records owned by their Sales Reps
- The VP Sales sees all records owned by all Regional Managers (and their reps)
- Going UP the hierarchy = more visibility; going DOWN = restricted to what OWD + sharing gives you

**Roles ≠ job titles:** You can have a role called "VP Sales" but it's really just a position in the visibility hierarchy. The name is for human readability.

**Sharing Stack reminder:**
1. OWD (floor) → sets the minimum access baseline
2. Role Hierarchy → opens up access for managers
3. Sharing Rules → opens up to specific groups/roles/criteria
4. Manual Sharing → individual record grants

## PTA / SA Relevance

Role hierarchy design is one of the most consequential decisions in a Salesforce implementation. Get it wrong, and you spend years dealing with "why can't I see this record?" tickets.

**Common mistakes:**
1. **Modeling the org chart exactly:** The role hierarchy should model DATA visibility requirements, not the org chart. A company's HR VP might rank below the CTO in the org chart but should see all employee records — their role hierarchy position should reflect their data access needs.
2. **Too flat:** A completely flat hierarchy with no roles means the sharing model falls entirely on Sharing Rules, which hit the 300-rule limit and become unmanageable.
3. **Too deep:** Deep hierarchies mean everyone at the top sees everything, defeating the purpose of any Private OWD setting.

**For territory-heavy orgs:** Account-based territory management is a separate feature from the role hierarchy. Enterprise Sales customers often have geographic and product-line territory models that don't map to management hierarchy. These need Territory Management, not just role hierarchy.

## Architecture / How It Works

```
Role Hierarchy — Visibility Model
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

          CEO
          ║
    ┌─────╩──────┐
  VP Sales   VP Service
    ║              ║
  ┌─╩──┐        ┌──╩──┐
  RM1  RM2    SM1   SM2
  ║              ║
  SR1           SE1

  SR1 (Sales Rep) owns Record A
  RM1 (Regional Manager) CAN SEE Record A ✓ (above SR1)
  VP Sales CAN SEE Record A ✓ (above RM1)
  CEO CAN SEE Record A ✓ (above VP Sales)
  
  SM1 (Service Manager) CANNOT SEE Record A ✗
    (different branch — not above SR1)
  SR2 (another Sales Rep) CANNOT SEE Record A ✗
    (same level — no upward visibility to peers)

  Visibility flows UPWARD only:
  ──────────────────────────────
  ↑ Manager sees subordinate records
  ✗ Subordinate does NOT see manager's records
  ✗ Peers do NOT see each other's records
```

**Limitations:**
- Role hierarchy is bypassed if OWD is set to Public Read/Write (everyone sees everything anyway)
- Users without a role assigned only see records they own (if OWD is Private) — no hierarchy benefit
- Role hierarchy alone doesn't grant edit access — you still need the right Profile/OWD permissions
- Maximum roles in an org: 500 (standard limit)
- Role hierarchy does NOT apply to all objects equally — some standard objects ignore it; custom objects respect it based on OWD

## Key Facts to Memorize

- Roles control record VISIBILITY, not permissions (that's profiles)
- Visibility flows UPWARD only — managers see subordinates' records
- Users at the same level in the hierarchy do NOT see each other's records
- Roles are OPTIONAL — a user without a role sees only their own records (if OWD = Private)
- Role hierarchy + OWD Private = managers see their team's records
- Role hierarchy is ignored if OWD = Public Read/Write (already full access)
- Sharing Rules and Manual Sharing can extend access beyond the hierarchy
- Roles ≠ Profiles: Roles = visibility, Profiles = permissions

## Exam Traps

- **"Roles control what users can do"** — FALSE. Roles control what records users can see. Profiles control what they can do.
- **"A sales rep can see their manager's records because of the role hierarchy"** — FALSE. Hierarchy visibility is upward only. Reps don't see managers' records.
- **"You must assign every user a role"** — FALSE. Roles are optional. But without a role, users only see records they own (when OWD is Private).
- **"Role hierarchy and profiles are the same thing"** — FALSE. Profile = do; Role = see.
- **"Users at the same role level can see each other's records through the hierarchy"** — FALSE. Same-level peers don't grant each other visibility. They're treated as separate branches.

## Practice Questions

**Q:** A Regional Manager complains that they can't see any of their sales reps' accounts, even though the reps are assigned to the manager in the role hierarchy. The Account OWD is set to Private. What is likely missing?
**A:** The Regional Manager's role might not be positioned above the Sales Reps' roles in the role hierarchy. Or the users haven't been assigned to the correct roles. Check that the hierarchy is correct and users are assigned.

**Q:** A Sales Rep is complaining they can't see their Regional Manager's Opportunities. The OWD is Private. Is this expected behavior?
**A:** Yes. Role hierarchy visibility flows upward only — managers see subordinates' records, not the other way around. The Sales Rep should only see their own Opportunities (unless granted via sharing rules or manual sharing).

**Q:** What happens to record visibility when OWD is set to Public Read/Write?
**A:** Everyone can read and edit all records regardless of ownership or role hierarchy. The role hierarchy effectively doesn't matter because access is already fully open.

**Q:** A company has 50 sales reps at the same role level. Can they see each other's Opportunities (OWD = Private)?
**A:** No. Same-level peers in the hierarchy do not grant each other visibility. Each rep sees only their own Opportunities unless a Sharing Rule or Manual Share grants access.
