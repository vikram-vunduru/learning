# Apex Integration and Callouts

## Learning Objectives
- Write HTTP callouts using the HttpRequest, HttpResponse, and Http classes
- Explain the difference between Named Credentials and hardcoded endpoints and when to use each
- Serialize and deserialize JSON using JSON.serialize(), JSON.deserialize(), and JSON.deserializeUntyped()
- Identify the constraints on callouts in triggers and the mock testing requirements for callout code

## Slides

### Slide 1: Why Apex Callouts?
**Visual:** Architecture diagram showing Salesforce on the left making an outbound HTTP arrow to an external REST API on the right, with request and response labels
**Content:**
- Salesforce can send HTTP requests to external systems directly from Apex
- Common uses: ERP sync, payment processing, external CRM, weather/mapping APIs
- Apex supports REST (HTTP) and SOAP (web service) callouts
- This lecture focuses on REST callouts using the Http, HttpRequest, HttpResponse classes
- All callouts require the external endpoint to be registered or use Named Credentials
**Speaker Notes:** Integration is a core part of Salesforce development. Most modern integrations use REST APIs over HTTP, and Apex provides a clean set of classes for making those calls. The key classes are Http (executes the call), HttpRequest (configures the outbound request), and HttpResponse (holds the inbound response). Together, they handle the complete request-response lifecycle.

### Slide 2: The Http, HttpRequest, HttpResponse Classes
**Visual:** Three-step code block: HttpRequest req built with setEndpoint/setMethod/setBody, Http http created, HttpResponse res = http.send(req)
**Content:**
- `HttpRequest`: configure the outbound request (endpoint, method, headers, body, timeout)
- `Http`: executes the request via `http.send(req)`; returns an `HttpResponse`
- `HttpResponse`: access status code (`getStatusCode()`), body (`getBody()`), headers
- Common methods: `req.setEndpoint()`, `req.setMethod()`, `req.setHeader()`, `req.setBody()`
- Set timeout with `req.setTimeout(milliseconds)` — max 120,000 ms (120 seconds)
**Speaker Notes:** The pattern is always the same: create an HttpRequest, configure it, create an Http instance, call send(), and process the HttpResponse. The HTTP method is a string: 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'. For POST and PUT requests that send a JSON body, set the Content-Type header to 'application/json' and serialize your data using JSON.serialize() before calling setBody(). Always check getStatusCode() on the response — a 200 doesn't mean the data was valid; a 4xx or 5xx means the request failed.

### Slide 3: Named Credentials vs. Remote Site Settings
**Visual:** Two-panel comparison: left shows Named Credentials path in Setup with URL and authentication configured centrally; right shows Remote Site Settings with a URL allowlist entry
**Content:**
- **Remote Site Settings**: whitelists an external URL so Salesforce allows outbound connections; required for hardcoded endpoints in code
- **Named Credentials**: stores the endpoint URL AND authentication credentials centrally; referenced in code as `callout:NamedCredentialName`
- Named Credentials are the preferred approach — authentication is managed outside code
- Hardcoded endpoints with Remote Site Settings expose credentials in Apex code
- Named Credentials support OAuth, Basic Auth, and Certificate-based authentication
**Speaker Notes:** The PDI exam expects you to know the difference between these two mechanisms. Remote Site Settings just open the firewall for a URL — your code still handles authentication. Named Credentials go further: they manage both the URL and the authentication, so your Apex code never contains usernames, passwords, or tokens. Using Named Credentials makes code more secure, easier to manage across sandboxes and production, and prevents credential exposure in source control.

### Slide 4: JSON Serialization
**Visual:** Code snippet showing a custom Apex class being serialized with JSON.serialize() to a string, and a JSON string being deserialized back to a typed object with JSON.deserialize()
**Content:**
- `JSON.serialize(apexObject)` — converts any Apex object to a JSON string
- `JSON.deserialize(jsonString, MyClass.class)` — maps JSON to a typed Apex class
- `JSON.deserializeUntyped(jsonString)` — returns `Map<String, Object>` for dynamic structures
- Field names in Apex class must match JSON keys (case-sensitive)
- Use `@JsonAccess` annotation for fine-grained serialization control
**Speaker Notes:** JSON serialization is the workhorse of REST integration. For strongly typed responses where you know the schema, deserialize into a custom Apex class — this gives you compile-time property access and is cleaner than navigating a Map. For dynamic JSON where the structure varies or is not known at compile time, use deserializeUntyped() which returns an Object that you cast to Map<String, Object> and navigate using string key access. The class used in deserialize() must match the JSON structure exactly, including nested objects.

### Slide 5: Callouts in Triggers — @future(callout=true)
**Visual:** Trigger code calling an @future(callout=true) static method, with an annotation showing why direct callouts from triggers are blocked
**Content:**
- Triggers execute during DML — there is an uncommitted transaction open
- Salesforce blocks callouts during an uncommitted transaction to prevent partial state exposure
- Solution: invoke a `@future(callout=true)` method from the trigger
- The @future method runs after the transaction commits, then makes the callout
- Alternatively, use a Queueable class implementing `Database.AllowsCallouts`
**Speaker Notes:** This is one of the most tested callout scenarios on the PDI exam. The rule is: you cannot make a callout after uncommitted DML in the same transaction. A trigger always has an open DML transaction. Therefore, a callout from a trigger must be deferred to a @future method or a Queueable. Both approaches run after the triggering transaction commits. Pass record IDs to the @future method — retrieve the current data inside the method, after commit.

### Slide 6: Callout Limits
**Visual:** Limit counter graphic showing: 100 callouts per transaction, 120-second individual timeout, 6 MB response body size limit
**Content:**
- Maximum callouts per transaction: **100**
- Maximum timeout per individual callout: **120 seconds** (120,000 ms)
- Maximum response body size: **6 MB**
- Callouts count toward the same 100-callout limit as SOQL queries? — NO, they are separate limits
- Cannot mix callouts and DML in the same synchronous transaction without committing first
**Speaker Notes:** The 100-callout limit and 120-second timeout are specific numbers that appear on the exam. The timeout is configured with setTimeout() on the HttpRequest object in milliseconds; the maximum you can set is 120,000. If the external server doesn't respond within your configured timeout, Salesforce throws a CalloutException. Plan for this: always wrap callouts in try/catch(CalloutException e) blocks so a timeout doesn't crash the entire transaction.

### Slide 7: Testing Callouts with HttpCalloutMock
**Visual:** Test class code showing a static resource mock or implementing HttpCalloutMock interface, then Test.setMock() registering it before calling the class under test
**Content:**
- Apex test classes cannot make real HTTP callouts — they are blocked in test context
- Solution: implement `HttpCalloutMock` interface with `respond(HttpRequest req)` method
- Register the mock: `Test.setMock(HttpCalloutMock.class, new MyMock())`
- The mock intercepts the callout and returns a fabricated `HttpResponse`
- `StaticResourceCalloutMock` lets you store mock response body in a Static Resource
**Speaker Notes:** This is a critical exam topic: if your test calls code that makes an HTTP callout without first setting a mock, Salesforce throws a "You have uncommitted work pending" or "Methods defined as TestMethod do not support web service callouts" error. The fix is always to implement HttpCalloutMock, register it with Test.setMock(), and then run your test. The mock's respond() method receives the actual HttpRequest your code sends — you can assert on it to verify your code set the right endpoint, method, and headers.

### Slide 8: SOAP and Wsdl2Apex
**Visual:** Diagram showing a WSDL file being imported into Salesforce Developer Console and generating a typed Apex stub class used to make SOAP calls
**Content:**
- SOAP callouts use the `WebServiceCallout` class, not Http
- Generate stub classes from WSDL using Wsdl2Apex (Setup → Apex Classes → Generate from WSDL)
- Generated classes contain typed methods matching the WSDL operations
- Set endpoint and credentials on the generated stub class instance before calling
- SOAP callouts count against the same 100-callout-per-transaction limit
**Speaker Notes:** SOAP is less common in modern integrations but still appears on the PDI exam. The Wsdl2Apex tool does the hard work — it reads the WSDL and generates an Apex class with typed methods you can call directly. You don't need to manually construct XML. The generated class handles serialization and deserialization. The exam may ask which tool generates stub classes from a WSDL — the answer is Wsdl2Apex.

## Recording Script

Welcome to Lecture 14 on Apex Integration and Callouts. Being able to connect Salesforce to external systems is a core developer skill, and this lecture covers everything the PDI exam expects you to know about making outbound HTTP calls from Apex.

Let's start with the three classes you need. HttpRequest is where you configure your outbound call: set the endpoint URL with setEndpoint(), the HTTP method with setMethod() — GET, POST, PUT, etc. — request headers with setHeader(), and the request body with setBody(). Http is the class that executes the call — you create an instance and call send(req). That returns an HttpResponse, which gives you getStatusCode() for the HTTP status and getBody() for the response content.

For the endpoint URL, you have two options. Remote Site Settings simply whitelists a URL so Salesforce allows the outbound connection. Your code still has to handle authentication. Named Credentials go further — they store both the URL and the authentication credentials in Setup, and you reference them in code as callout:CredentialName. Named Credentials are the correct approach for production code because credentials never appear in Apex code or source control.

JSON is the lingua franca of REST APIs. JSON.serialize() converts any Apex object to a JSON string for the request body. JSON.deserialize() maps a JSON response string back to a typed Apex class — pass the class type as the second argument. For dynamic or unknown JSON structures, JSON.deserializeUntyped() returns a Map<String, Object> you can navigate at runtime.

Now the trigger restriction. A trigger always runs inside an open database transaction. Salesforce prohibits callouts when there's an uncommitted transaction — this prevents the external system from seeing data that might be rolled back. The solution: delegate the callout to an @future(callout=true) method or a Queueable class that implements Database.AllowsCallouts. Both run after the triggering transaction commits.

Callout limits: 100 callouts per transaction, 120-second maximum timeout per callout, 6 MB maximum response size.

For testing: Apex test classes cannot make real callouts. You must implement HttpCalloutMock, write a respond() method that returns a fake HttpResponse, and register it with Test.setMock() before running your test. If you forget the mock, the test throws an error.

SOAP callouts use Wsdl2Apex to generate a stub class from a WSDL file. The generated class has typed methods you call directly.

## Exam Tips
- Callouts from triggers require `@future(callout=true)` or a Queueable implementing `Database.AllowsCallouts` — you cannot make a direct callout inside a trigger
- Named Credentials reference syntax in code is `callout:NamedCredentialName` — the prefix is always `callout:` followed by the credential's developer name
- The maximum callout timeout is **120 seconds** (set via `req.setTimeout(120000)`)
- In test classes, register a callout mock with `Test.setMock(HttpCalloutMock.class, mockInstance)` before calling code that makes callouts — failing to do so causes the test to throw a runtime error
- `JSON.deserialize()` maps JSON to a typed Apex class; `JSON.deserializeUntyped()` returns `Map<String, Object>` for unstructured or dynamic JSON

## Lecture Summary
Apex callouts use the Http, HttpRequest, and HttpResponse classes to make outbound REST calls, with Named Credentials being the preferred approach for managing endpoints and authentication securely outside of code. JSON.serialize() and JSON.deserialize() handle the conversion between Apex objects and JSON strings, with JSON.deserializeUntyped() available for dynamic structures. Callouts from triggers must be deferred to @future(callout=true) methods or Queueable classes because Salesforce prohibits callouts during uncommitted DML transactions. Testing callout code requires implementing the HttpCalloutMock interface and registering it with Test.setMock() because real callouts are blocked in test execution contexts.

## Mini Quiz

**Q1:** A developer needs to call an external REST API from an Account after-insert trigger. The call must happen synchronously with the trigger. Which approach is valid?
A) Call the Http class directly inside the trigger body
B) Create a @future(callout=true) method and call it from the trigger
C) Create a Schedulable class and schedule it to run immediately
D) Use Platform Events to trigger the callout

**Answer:** B — You cannot make a callout directly inside a trigger because there is an uncommitted DML transaction open. A @future(callout=true) method defers the callout until after the transaction commits. Option A will throw a runtime error. Option C and D would work technically but are not "synchronous with the trigger" — @future is the standard answer for this scenario.

**Q2:** A developer references an external API endpoint as `callout:PaymentService/api/charge`. What does this syntax indicate?
A) The developer is using Remote Site Settings with a URL prefix
B) The developer is using a Named Credential named PaymentService
C) The developer is constructing an endpoint using Apex string concatenation
D) The developer is using a Custom Metadata record named PaymentService

**Answer:** B — The `callout:` prefix followed by a name indicates a Named Credential reference. The name after the colon is the Named Credential's developer name, and anything following a slash is appended to the credential's base URL.

**Q3:** Which interface must be implemented to test Apex code that makes HTTP callouts?
A) `Database.Batchable`
B) `System.Schedulable`
C) `HttpCalloutMock`
D) `CalloutMockable`

**Answer:** C — The `HttpCalloutMock` interface must be implemented and registered via `Test.setMock(HttpCalloutMock.class, instance)` to intercept and fake HTTP callouts during Apex test execution. `Database.Batchable` is for batch Apex, and `System.Schedulable` is for scheduled Apex. `CalloutMockable` is not a Salesforce interface.
