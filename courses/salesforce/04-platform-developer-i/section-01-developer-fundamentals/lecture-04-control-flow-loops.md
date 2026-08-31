# Lecture 04: Control Flow & Loops

## Learning Objectives
- Write conditional logic using if/else chains and switch statements in Apex
- Use all three Apex for loop variants — traditional, enhanced for-each, and SOQL for loop — and explain when each is appropriate
- Implement while and do-while loops with proper termination conditions
- Use break and continue to control loop flow, and explain why the SOQL for loop prevents heap limit issues

## Slides

### Slide 1: if / else — Conditional Branching
**Visual:** Flowchart with a diamond decision node at the top branching left (false) and right (true), with action boxes at the ends of each branch, reconverging below — a classic if/else structure with an else-if branch added in the middle.
**Content:**
- Standard if/else syntax:
```apex
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else {
    grade = 'F';
}
```
- Condition must be a Boolean expression — no implicit truthy/falsy (unlike JavaScript)
- Curly braces are optional for single-line bodies but always recommended
- Ternary operator: `String label = (isActive) ? 'Active' : 'Inactive';`
- Nested if statements are allowed but deeply nested code signals a need for refactoring
**Speaker Notes:** In Apex, the condition inside an if statement must evaluate to a Boolean — there is no implicit conversion from Integer or Object to Boolean. `if (myInteger)` is a compile error. You must write `if (myInteger != 0)`. This is a common mistake for JavaScript developers moving to Apex.

### Slide 2: switch Statement
**Visual:** Parallel comparison showing a multi-branch if/else-if chain on the left versus the equivalent switch statement on the right, with color highlighting showing how each condition maps to a when clause.
**Content:**
- Apex `switch` uses `when` clauses instead of `case`
- Works with Integer, Long, String, sObject type, and Enum values
- `when else` is the default branch (like `default` in Java)
- No fall-through between branches — no `break` needed
```apex
switch on accountType {
    when 'Customer' {
        discount = 0.10;
    }
    when 'Partner', 'Reseller' {
        discount = 0.20;
    }
    when else {
        discount = 0.0;
    }
}
```
- Can switch on sObject type:
```apex
switch on myObj {
    when Account a { System.debug(a.Name); }
    when Contact c { System.debug(c.Email); }
}
```
**Speaker Notes:** The Apex switch statement does not have fall-through — unlike Java or C, you do not need a break statement. Multiple values in a single when clause are separated by commas. The ability to switch on sObject type is unique to Apex and is very useful when working with generic sObject lists where you need to process records differently based on their type.

### Slide 3: Traditional for Loop
**Visual:** Annotated for loop code block with arrows labeling each part: initialization expression, condition expression, increment expression, and loop body, with a trace showing variable value at each iteration.
**Content:**
- Syntax: `for (init; condition; increment) { body }`
- Use when you need the **index** or need to iterate a specific number of times
- Access list element by index: `myList.get(i)` or `myList[i]`
```apex
List<String> names = new List<String>{'Alice', 'Bob', 'Charlie'};
for (Integer i = 0; i < names.size(); i++) {
    System.debug('Index ' + i + ': ' + names[i]);
}
```
- Common pitfall: off-by-one error — use `i < list.size()`, not `i <= list.size()`
- Can iterate backwards: `for (Integer i = list.size() - 1; i >= 0; i--)`
**Speaker Notes:** The traditional for loop is the right choice when you need the index — for example, if you are comparing adjacent elements in a list, or if you need to process elements starting from the end. In most other cases, the enhanced for-each loop is cleaner and preferred. Off-by-one errors are the most common bug with traditional for loops — always double-check your boundary condition.

### Slide 4: Enhanced For-Each Loop
**Visual:** Side-by-side showing a traditional for loop iterating a list of Accounts using index access on the left, and the cleaner equivalent enhanced for-each loop on the right, with the for-each version highlighted as "preferred".
**Content:**
- Syntax: `for (Type variable : collectionOrArray) { body }`
- Works with: Lists, Sets, arrays, and SOQL query results (inline)
- No index available — cannot access adjacent elements
- Preferred for readability; compiler can optimize it
```apex
for (Account acc : accountList) {
    acc.Description = 'Reviewed';
}
```
- Can iterate over a Set:
```apex
for (String name : nameSet) {
    System.debug(name);
}
```
- Can iterate inline SOQL (see SOQL for loop slide)
**Speaker Notes:** The enhanced for-each is the loop you will write most often in Apex. It is cleaner, less error-prone, and works with every collection type. The one limitation is that you cannot modify the collection you are iterating — you must work on a separate list if you need to add or remove elements. Always collect changes in a separate list and apply them after the loop.

### Slide 5: while and do-while Loops
**Visual:** Two flowcharts side by side — the while loop checks the condition first (may execute zero times), while the do-while loop executes the body first then checks the condition (always executes at least once). Each has a labeled condition box and body box.
**Content:**
- **while loop:** Checks condition before each iteration; body may never execute
```apex
Integer count = 0;
while (count < 5) {
    System.debug('Count: ' + count);
    count++;
}
```
- **do-while loop:** Executes body at least once; checks condition after
```apex
do {
    fetchNextBatch();
    processed++;
} while (processed < total && !hasError);
```
- Use while when iteration count is unknown; use do-while when you always need at least one execution
- Infinite loop risk: always ensure the condition can become false
- Counted by Apex CPU governor — complex while loops can hit the 10,000 ms CPU limit
**Speaker Notes:** While and do-while loops are less common in Apex than for loops, but they appear in the exam and in real code when you do not know how many iterations are needed upfront. The key distinction: while checks the condition first, so if the condition is false before the first iteration, the body never runs. Do-while always runs the body at least once. Be careful of infinite loops — they will hit the CPU time governor limit.

### Slide 6: break and continue
**Visual:** Flowchart of a loop with two labeled exit points: `continue` shows an arrow that skips the rest of the loop body and jumps to the next iteration, while `break` shows an arrow that exits the loop entirely. Both are annotated with their use cases.
**Content:**
- **break:** Immediately exits the innermost loop; execution continues after the loop's closing brace
- **continue:** Skips the remaining body of the current iteration; moves to the next iteration
```apex
for (Integer i = 0; i < 10; i++) {
    if (i == 3) continue; // skip 3
    if (i == 7) break;    // stop at 7
    System.debug(i);      // prints 0,1,2,4,5,6
}
```
- Only affects the **innermost loop** in nested loops
- **break** is needed in switch statements in Java/JavaScript but NOT in Apex (no fall-through)
- Use sparingly — excessive break/continue can make code harder to follow
**Speaker Notes:** Break and continue are simple but appear on the exam, usually in a "what is the output" style question. Remember that break exits the entire innermost loop, while continue only skips the rest of the current iteration. In nested loops, break only exits the innermost loop — you cannot directly break out of an outer loop without additional conditional logic.

### Slide 7: SOQL for Loop — Preventing Heap Limits
**Visual:** Two diagrams showing memory usage: on the left, a standard List<Account> query loading all 50,000 records into heap at once (heap bar nearly full). On the right, the SOQL for loop processing one chunk at a time (heap bar stays low), with arrows showing Salesforce delivering records in batches of 200.
**Content:**
- Standard query: `List<Account> accts = [SELECT Id FROM Account];` — loads ALL records into heap
- SOQL for loop: processes records in **chunks of 200**, significantly reducing heap usage
```apex
// Iterates in batches of 200 — heap-efficient
for (Account a : [SELECT Id, Name FROM Account WHERE IsActive__c = true]) {
    // process each account
}
```
- Use when processing large data sets that could exceed the **6 MB heap limit**
- Still counts as **one SOQL query** against the 100-query governor limit
- DML inside a SOQL for loop — collect in a list, bulk DML outside the loop
- Best practice: collect records for DML, then update/insert in bulk after the loop
**Speaker Notes:** The SOQL for loop is specifically designed to handle large volumes of records without blowing the heap limit. Salesforce delivers records in chunks of 200, and the JVM garbage collects each chunk before loading the next. For Batch Apex processing millions of records, however, you use the Batch Apex framework — the SOQL for loop is for moderate volumes where a batch class would be overkill. This distinction appears on the exam.

### Slide 8: Governor Limits and Loop Best Practices
**Visual:** Two code panels side-by-side — "Bad" code shows SOQL and DML inside a for loop with red X marks. "Good" code shows the collect-then-bulk-DML pattern with green checkmarks. A governor limit counter at the top shows how fast it fills in the bad example.
**Content:**
- **NEVER** put SOQL queries inside a loop — exhausts the 100-query limit with just 101 records
- **NEVER** put DML statements inside a loop — exhausts the 150-DML limit
- Collect records that need updating in a List, then DML the List after the loop:
```apex
List<Account> toUpdate = new List<Account>();
for (Contact c : contacts) {
    Account a = accMap.get(c.AccountId);
    if (a != null) {
        a.Description = 'Has Contacts';
        toUpdate.add(a);
    }
}
update toUpdate; // single DML statement for all records
```
- `Limits.getQueries()` tells you how many SOQL queries you have used so far
- CPU limit (10,000 ms) can be consumed by complex logic inside large loops
**Speaker Notes:** The no-SOQL-in-loops and no-DML-in-loops rules are the two most important rules in Apex development. They are non-negotiable. If you put a SOQL query inside a loop that processes 200 records, you have just issued 200 SOQL queries in one transaction — you will hit the governor limit at record 101. The fix is always the same: do all your querying before the loop using the Set-Map pattern, and collect all your DML into a List to be executed after the loop.

## Recording Script
Welcome to Lecture 4, our last lecture in the Developer Fundamentals section. Today we cover control flow and loops — the constructs that give your Apex programs their logic. And at the end, I am going to show you why the way you write loops has life-or-death consequences for your governor limits.

Let's start with the basics. If/else in Apex works exactly like Java. The condition must be a Boolean expression — not a number, not an object, just true or false. Remember: in JavaScript you can write `if (myString)` and it works because JavaScript coerces non-empty strings to true. In Apex, that is a compile error. You must write `if (myString != null && !myString.isEmpty())`.

The switch statement in Apex uses `when` instead of `case`, and there is no fall-through between branches — you do not need break statements. You can combine multiple values in one `when` clause separated by commas. And the ability to switch on sObject type is unique to Apex — incredibly useful when you have a List of generic sObjects and need to process Accounts differently from Contacts.

Now for loops. You have three flavors in Apex. The traditional for loop — `for (Integer i = 0; i < list.size(); i++)` — use this when you need the index. The enhanced for-each — `for (Account a : accountList)` — use this for everything else. It is cleaner, less error-prone, and the preferred style. Then there is the SOQL for loop, which I will cover in a moment because it is special.

While and do-while loops are your tools when you do not know the iteration count upfront. The while loop checks the condition before executing — if the condition is false on entry, the body never runs. The do-while loop executes first, then checks — so the body always runs at least once. Be careful of infinite loops: always make sure the condition can eventually become false, otherwise your code will hit the CPU time governor limit.

Break and continue are control modifiers inside loops. Continue skips the rest of the current iteration and moves to the next. Break exits the loop entirely. They only affect the innermost loop in nested loops. These are simple but they show up on the exam in "what is the output" questions.

Now, the SOQL for loop — and this is the important part. When you write a standard SOQL query like `List<Account> allAccounts = [SELECT Id FROM Account]`, all matching records are loaded into heap memory at once. If there are 50,000 accounts, that is 50,000 records in heap simultaneously. With a 6 MB heap limit, you can run out very quickly.

The SOQL for loop syntax looks like this: `for (Account a : [SELECT Id, Name FROM Account])`. Instead of loading everything at once, Salesforce delivers the records in chunks of 200 — it processes one chunk, garbage collects it, processes the next chunk. Your heap usage stays low regardless of how many records match.

But here is the critical rule that everything builds toward: never, under any circumstances, put a SOQL query or DML statement inside a loop. If your loop runs 200 times and you query inside it, that is 200 SOQL queries — you hit the limit at 101. Instead, collect IDs before the loop, run one SOQL query using the Set-Map pattern, and do all your DML outside the loop on a collected List.

This is not just a best practice — it is the rule that separates code that works from code that crashes on production data. We will practice this pattern extensively starting in the Apex Core section.

## Exam Tips
- Apex if/else conditions must be explicit Boolean expressions — Apex does not perform implicit truthiness conversion like JavaScript. `if (myString)` is a compile error; write `if (myString != null)`.
- Apex switch uses `when` (not `case`) and has **no fall-through** — `break` is not needed or valid inside when clauses.
- The SOQL for loop processes records in **chunks of 200** to reduce heap usage, but still counts as **one SOQL query** against the 100-query governor limit.
- Putting SOQL queries inside any loop will quickly exhaust the **100 SOQL query governor limit** — this is one of the most common anti-patterns the exam tests.
- The CPU time governor limit is **10,000 ms for synchronous** and **60,000 ms for asynchronous** transactions — complex logic inside large loops can hit this limit even without SOQL/DML violations.

## Lecture Summary
Apex provides if/else, ternary, and switch (with `when` clauses and no fall-through) for conditional logic, and three loop types — traditional for (indexed), enhanced for-each (preferred), and SOQL for (heap-safe for large data sets) — plus while and do-while for indeterminate iteration. The most critical practical rule is to never place SOQL queries or DML statements inside loops: collect IDs before the loop, query once using the Set-Map pattern, and execute bulk DML after the loop completes. Break and continue provide fine-grained loop control but only affect the innermost loop in nested structures.

## Mini Quiz

**Q1:** A developer writes the following loop over a list of 500 Contact records, querying the related Account inside the loop. What is the most likely outcome when this code runs?
```apex
for (Contact c : contacts) {
    Account a = [SELECT Name FROM Account WHERE Id = :c.AccountId];
    c.Description = a.Name;
}
```
A) The code runs successfully for all 500 records
B) The code throws a LimitException after 100 iterations because the SOQL governor limit is exceeded
C) The code throws a NullPointerException on the first iteration
D) The code compiles but only processes the first record
**Answer:** B — Each iteration issues one SOQL query. After 100 iterations, the 100 SOQL query governor limit is hit and a LimitException is thrown, rolling back the entire transaction. The correct approach is to collect AccountIds into a Set, query once, store in a Map, and look up in the loop.

**Q2:** Which loop type is specifically designed to process large SOQL result sets without exhausting the heap size governor limit?
A) Traditional for loop with an index counter
B) Enhanced for-each loop over a List<sObject>
C) SOQL for loop: `for (Account a : [SELECT Id FROM Account])`
D) while loop with a SOQL query in the condition
**Answer:** C — The SOQL for loop processes records in batches of 200, allowing Salesforce to garbage collect each batch before loading the next. This keeps heap usage low regardless of the total result set size, unlike loading all records into a List at once.

**Q3:** What does the following code print?
```apex
for (Integer i = 0; i < 5; i++) {
    if (i == 2) continue;
    if (i == 4) break;
    System.debug(i);
}
```
A) 0, 1, 2, 3
B) 0, 1, 3
C) 0, 1, 3, 4
D) 0, 1, 2, 3, 4
**Answer:** B — When i=2, `continue` skips the debug and moves to i=3. When i=4, `break` exits the loop before the debug. So only 0, 1, and 3 are printed.
