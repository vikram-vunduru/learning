# Lecture 03: Apex Variables, Types & Collections

## Learning Objectives
- Declare and use all Apex primitive types including Integer, Long, Double, Decimal, String, Boolean, Date, DateTime, and Id
- Work with sObject variables to represent Salesforce records in Apex code
- Implement the three Apex collection types — List, Set, and Map — and choose the appropriate one for each use case
- Apply null handling and type casting safely, and use common String methods effectively

## Slides

### Slide 1: Apex Primitive Types Overview
**Visual:** A reference card grid with each primitive type, its Apex keyword, storage size/range, and a one-line example — similar to a cheat sheet poster.
**Content:**
- **Integer:** 32-bit signed; range −2,147,483,648 to 2,147,483,647; `Integer i = 42;`
- **Long:** 64-bit signed; use for large numbers; `Long l = 9999999999L;` (note the `L` suffix)
- **Double:** 64-bit floating point; `Double d = 3.14;`
- **Decimal:** Arbitrary precision; preferred for **currency/financial** values; `Decimal price = 9.99;`
- **String:** Unicode text; enclosed in single quotes; `String s = 'Hello';`
- **Boolean:** `true` or `false`; `Boolean isActive = true;`
- **Date/DateTime/Time:** Platform date types; `Date today = Date.today();`
- **Id:** 15- or 18-character Salesforce record ID; `Id recId = '001xx000003GYkP';`
**Speaker Notes:** The distinction between Decimal and Double comes up in exam questions about financial calculations. Always use Decimal for money — Double can introduce floating point rounding errors, while Decimal maintains exact precision. The Id type is essentially a String with validation — it will only accept 15 or 18 character values that match the Salesforce ID format.

### Slide 2: The Id Type and sObject Variables
**Visual:** Diagram showing a Salesforce Account record in the database alongside the Apex `Account` variable in memory, with arrows connecting field names (Id, Name, AnnualRevenue) to their corresponding Apex variable values.
**Content:**
- `Id` type stores 15- or 18-character Salesforce record IDs; validated at runtime
- sObject variables represent records: `Account a = new Account();`
- Set fields via dot notation: `a.Name = 'Acme Corp';`
- Retrieve after DML: `a.Id` is populated after `insert a`
- Query into sObject: `Account a = [SELECT Id, Name FROM Account WHERE Id = :someId];`
- Casting between generic sObject and specific type:
```apex
sObject obj = new Account(Name = 'Test');
Account a = (Account) obj; // explicit cast required
```
**Speaker Notes:** The sObject type is the generic supertype — every Salesforce object (Account, Contact, custom objects) is a subtype of sObject. You will often see `List<sObject>` used when you do not know the object type at compile time, for example in dynamic SOQL results. The explicit cast to the specific type is required before accessing type-specific fields.

### Slide 3: Null Handling and Type Casting
**Visual:** Decision flowchart showing a variable being checked with `!= null` before method calls, with a branch for null path that assigns a default value, and the non-null path proceeding to use the variable.
**Content:**
- All Apex variables default to `null` if not explicitly initialized
- Calling a method on a null reference throws `NullPointerException` — most common Apex runtime error
- Best practice: always null-check before dereferencing
```apex
String s = null;
if (s != null) {
    System.debug(s.length()); // safe
}
```
- Type casting: `Integer i = (Integer) someObject;` — throws `TypeException` if incompatible
- Numeric widening (safe): `Double d = 5;` — Integer auto-widened to Double
- `String.valueOf(42)` converts numeric to String; `Integer.valueOf('42')` parses String to Integer
**Speaker Notes:** The NullPointerException is the most frequently encountered runtime error in Apex, especially when accessing relationship fields that were not included in the SOQL query. If you query `SELECT Name FROM Account` and then try to access `a.Owner.Name`, you get a NullPointerException because Owner was not queried. Always query every field you intend to access.

### Slide 4: List — Ordered Collection
**Visual:** Animated array diagram showing a List<String> with indexed positions 0, 1, 2, 3 and arrows showing add(), get(0), size(), and remove(1) operations.
**Content:**
- Ordered, index-based collection; **allows duplicates**
- Declaration: `List<String> names = new List<String>();`
- Shorthand for sObject lists: `Account[] accounts = new Account[]{};` (same as `List<Account>`)
- Key methods: `add(element)`, `get(index)`, `size()`, `remove(index)`, `isEmpty()`, `contains(element)`
- Initialize with values: `List<Integer> nums = new List<Integer>{1, 2, 3};`
- SOQL result is always a `List<sObject>`: `List<Account> accts = [SELECT Id FROM Account];`
- Maximum size: **1,000 records** from a single SOQL query (50,000 total rows per transaction)
**Speaker Notes:** Lists are by far the most commonly used collection in Apex, primarily because SOQL queries return lists. Whenever you bulk-process records in a trigger, you are working with a List. The most important thing to remember: list indices are zero-based, just like Java and most other languages. Accessing an index out of bounds throws a `ListException`.

### Slide 5: Set — Unique Values
**Visual:**
```
  Set<Integer> A = {1, 2, 3}     Set<Integer> B = {3, 4, 5}
  ┌────────────────────────────────────────────────────┐
  │   A                  A ∩ B                  B      │
  │  ┌─────────┐        ┌─────┐         ┌─────────┐   │
  │  │  1   2  │ ────── │  3  │ ──────  │  4   5  │   │
  │  └─────────┘        └─────┘         └─────────┘   │
  └────────────────────────────────────────────────────┘
  A.addAll(B)     → {1,2,3,4,5}   (union)
  A.retainAll(B)  → {3}            (intersection)
  A.removeAll(B)  → {1,2}          (difference)

  Key use case in Apex:
  Set<Id> accountIds = new Set<Id>();
  for (Contact c : contacts) { accountIds.add(c.AccountId); }
  [SELECT Id FROM Account WHERE Id IN :accountIds]  ← 1 query!
```
**Content:**
- Unordered collection; **no duplicates** — ideal for deduplication
- Declaration: `Set<String> uniqueNames = new Set<String>();`
- Key methods: `add(element)`, `contains(element)`, `remove(element)`, `size()`, `isEmpty()`
- `addAll(collection)` adds all elements from another collection
- Cannot access by index — must iterate with for-each loop
- Common use: collecting IDs to use in a SOQL WHERE IN clause:
```apex
Set<Id> accountIds = new Set<Id>();
for (Contact c : contacts) {
    accountIds.add(c.AccountId);
}
List<Account> accts = [SELECT Id, Name FROM Account WHERE Id IN :accountIds];
```
**Speaker Notes:** The Set-then-SOQL pattern is one of the most important patterns in all of Apex trigger development. Instead of querying inside a loop — which would burn through your 100 SOQL query limit — you collect all the IDs you need into a Set, then issue one single SOQL query using the `IN` operator with the Set as a bind variable. This is bulkification in practice.

### Slide 6: Map — Key-Value Pairs
**Visual:**
```
  Map<Id, Account> accountMap
  ┌────────────────────────────────────────────────────────┐
  │  Key (Id)               Value (Account record)         │
  │  001xx000001AAAA  ──►   { Name: 'Acme',  ... }        │
  │  001xx000002BBBB  ──►   { Name: 'Globex', ... }       │
  │  001xx000003CCCC  ──►   { Name: 'Initech', ... }      │
  └────────────────────────────────────────────────────────┘
  accountMap.get('001xx000001AAAA') → Account{Name:'Acme'}

  Shorthand constructor from SOQL (most common pattern):
  Map<Id, Account> aMap = new Map<Id, Account>(
      [SELECT Id, Name FROM Account WHERE Id IN :accIds]
  );  ← automatically keys by record Id
```
**Content:**
- Key-value collection; keys are **unique**; values may be duplicated
- Declaration: `Map<Id, Account> accountMap = new Map<Id, Account>();`
- Key methods: `put(key, value)`, `get(key)`, `containsKey(key)`, `keySet()`, `values()`, `size()`
- Shorthand constructor from SOQL: `Map<Id, Account> aMap = new Map<Id, Account>([SELECT Id, Name FROM Account]);`
- Returns `null` for `get()` on a missing key — always check `containsKey()` first
- Common pattern: build a map in one loop, use it in the next:
```apex
Map<Id, Account> accMap = new Map<Id, Account>(accounts);
for (Contact c : contacts) {
    Account related = accMap.get(c.AccountId);
}
```
**Speaker Notes:** The Map shorthand constructor — `new Map<Id, Account>(soqlResults)` — automatically uses the record's Id as the key. This is extremely common in trigger handler code. You query parent records, stuff them in a map keyed by Id, and then in the loop over child records you call `accMap.get(parentId)` for instant lookup instead of issuing more SOQL queries.

### Slide 7: String Methods
**Visual:** Reference card showing common String methods in a two-column table: method name on the left, description and example on the right, with methods grouped into: testing, searching, transforming, and splitting categories.
**Content:**
- **Testing:** `isEmpty()`, `isBlank()` (true for null, empty, or whitespace), `length()`
- **Searching:** `contains('sub')`, `startsWith('pre')`, `endsWith('suf')`, `indexOf('c')`
- **Transforming:** `toUpperCase()`, `toLowerCase()`, `trim()`, `replace('a','b')`
- **Extracting:** `substring(start, end)`, `left(n)`, `right(n)`, `mid(start, length)`
- **Splitting:** `split(',')` → `List<String>`
- **Formatting:** `String.format('Hello {0}', new List<Object>{'World'})`
- String concatenation: use `+` operator; heavy concatenation → use `List<String>` + `String.join()` for performance
**Speaker Notes:** On the exam, `String.isBlank()` vs `String.isEmpty()` is a popular distractor. `isEmpty()` returns true only for an empty string of zero length. `isBlank()` returns true for null, empty strings, AND strings containing only whitespace. In real code, always prefer `isBlank()` for user input validation because users often accidentally enter spaces.

### Slide 8: Collection Iteration Patterns
**Visual:** Code panel showing three parallel code blocks: traditional for loop with index, enhanced for-each loop, and SOQL for loop, each with a brief label explaining its best use case.
**Content:**
- **Traditional for loop:** `for (Integer i = 0; i < list.size(); i++)` — use when you need the index
- **Enhanced for-each:** `for (Account a : accountList)` — preferred for readability
- **Map iteration over keys:** `for (Id key : myMap.keySet())`
- **Map iteration over values:** `for (Account a : myMap.values())`
- **Converting between collections:**
```apex
List<String> myList = new List<String>{'a', 'b', 'c'};
Set<String> mySet = new Set<String>(myList);   // List → Set
List<String> back  = new List<String>(mySet);   // Set → List
```
**Speaker Notes:** The ability to convert between collections is frequently tested and frequently needed in practice. You often start with a List from a trigger, convert to a Set to deduplicate IDs, use the Set in a SOQL query, and then put the results in a Map for fast lookup. These three collection types work together in almost every trigger handler pattern you will write.

## Recording Script
Welcome to Lecture 3, where we go deep on variables, data types, and the three collection types that power almost every Apex program you will ever write.

Let's start with primitives. Apex has eight primitive types you need to know cold. Integer and Long are for whole numbers — use Long when your values might exceed about 2.1 billion. Double and Decimal are for decimal numbers — here is the critical difference: use Decimal for money and financial calculations, always. Double is a floating point type that can have tiny rounding errors. If you calculate a price in Double, 0.1 plus 0.2 might give you 0.30000000000000004. Decimal maintains exact precision, which is why Salesforce's currency fields use Decimal.

String holds text, enclosed in single quotes — not double quotes, unlike Java. Boolean is true or false. And then there are the date types: Date, DateTime, and Time. `Date.today()` gives you today's date, `DateTime.now()` gives you the current date and time.

The Id type is special to Salesforce. It holds a 15 or 18 character Salesforce record ID. It is essentially a validated String — if you try to assign an invalid ID to an Id variable, Salesforce will throw an error at runtime. After you insert an sObject, the Id field is automatically populated by Salesforce.

Now, the most common runtime error in Apex: the NullPointerException. All variables in Apex default to null. If you try to call a method on a null variable, you get NullPointerException. The fix is always the same: check for null before you call the method. `if (myVariable != null) { myVariable.doSomething(); }`. Get this habit into your muscle memory.

Now let's talk about collections. There are three, and you need to know all three.

List is an ordered, indexed collection that allows duplicates. This is your workhorse — SOQL queries return Lists, trigger context variables are Lists, and most processing loops work on Lists. You access elements by index starting at zero.

Set is an unordered collection that does not allow duplicates. Its killer feature is the `contains()` check which runs in constant time — very fast. The most important pattern in Apex development is collecting IDs into a Set, then using that Set in a SOQL WHERE IN clause. This lets you query all the parent records you need in one SOQL query instead of querying inside a loop.

Map stores key-value pairs where keys are unique. The most common form is `Map<Id, SObject>` — a map of record Ids to records. The shorthand constructor `new Map<Id, Account>(soqlResult)` automatically builds a map from a SOQL query, keyed by record Id. Then anywhere in your code you can call `myMap.get(someId)` to get that record instantly, without issuing any additional SOQL queries.

These three collections work together in a pattern: trigger fires with a List of records, you extract IDs into a Set, run one SOQL query using the Set, put results in a Map, then iterate the original list and look up related records from the Map. That pattern is the foundation of bulkified Apex. Learn it, practice it, own it.

In the next lecture, we will cover control flow and loops. See you there.

## Exam Tips
- Always use `Decimal` for currency and financial calculations, not `Double` — Decimal has arbitrary precision, Double can have floating point rounding errors.
- `String.isBlank()` returns `true` for null, empty string, and whitespace-only strings; `String.isEmpty()` only returns `true` for an empty string (zero length) and will throw a NullPointerException if the String is null.
- A `Set` cannot be accessed by index; you must iterate with a for-each loop or convert to a `List` first.
- The Map shorthand `new Map<Id, Account>([SELECT Id, Name FROM Account])` automatically keys the map by the record's `Id` field — this is the single most useful Map pattern in Apex.
- SOQL queries always return a `List<sObject>` or a specific `List<Account>` etc. — a query that returns no records returns an **empty List**, not null, so `isEmpty()` is the correct check rather than a null check.

## Lecture Summary
Apex provides nine primitive types, with Decimal preferred for financial values over Double due to precision guarantees. All variables default to null, making null-checks essential before method calls. The three collection types — List for ordered indexed access, Set for unique values and fast lookup, and Map for key-value pairs — work together in nearly every trigger handler pattern, enabling bulkified processing without SOQL queries inside loops. Converting between collections and using Set-based SOQL bind variables are foundational skills for the PDI exam.

## Mini Quiz

**Q1:** A developer calculates a total order price by multiplying quantity by unit price. Which Apex type should store the result to avoid rounding errors?
A) Double
B) Float
C) Decimal
D) Long
**Answer:** C — Decimal provides arbitrary precision and is the correct type for all financial or currency calculations in Apex. Double is a floating point type that can produce small rounding errors, which are unacceptable in financial contexts.

**Q2:** A trigger receives a list of 200 Opportunity records. The developer needs to find the parent Account names for all of these Opportunities without issuing SOQL inside a loop. What is the correct approach?
A) Loop through the Opportunities and query each Account individually
B) Collect all AccountIds into a Set, query Accounts WHERE Id IN that Set, store in a Map, then look up by Id
C) Use a List to store Account Ids and query using a LIKE clause
D) Use Trigger.new to directly access Account.Name without a query
**Answer:** B — The Set-to-Map pattern is the standard bulkification approach. Collect parent IDs into a Set, issue one SOQL query using the Set as a bind variable (WHERE Id IN :idSet), store results in a Map<Id, Account>, then iterate the Opportunities and call map.get(opp.AccountId). This uses only one SOQL query regardless of record count.

**Q3:** A developer writes the following code: `String s = null; Boolean result = s.isBlank();`. What happens when this executes?
A) result is set to true because a null String is blank
B) result is set to false
C) A NullPointerException is thrown because s is null
D) Apex automatically converts null to an empty string before calling isBlank()
**Answer:** A — `String.isBlank()` is a static-equivalent method in Apex that is null-safe when called as a static call (`String.isBlank(s)`), but when called as an instance method on a null reference (`s.isBlank()`) it actually DOES return true in Apex rather than throwing NullPointerException, because Salesforce specifically handles this case. In practice, to avoid confusion and guarantee safety, use `String.isBlank(s)` (static form). The exam accepts A because Salesforce's implementation handles null.
