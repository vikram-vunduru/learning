# Lab 02: Integration Callouts

## Lab Overview

**Estimated Time:** 2 hours  
**Prerequisites:** Developer Edition org, Named Credential configured (or use mock for testing)  
**Covers:** Outbound REST callout, inbound Apex REST, HttpCalloutMock, Named Credentials, error handling

---

## Scenario

Build a bidirectional integration between Salesforce and a fictional external Order Management System (OMS). Salesforce sends Account data to OMS (outbound) and exposes an Apex REST endpoint for OMS to create Orders in Salesforce (inbound).

---

## Part 1: Outbound REST Callout with Named Credential

**Step 1: Create Named Credential** (in Setup)
- Name: `Order_Management_API`
- URL: `https://api.your-oms.example.com` (use a mock service like httpbin.org for testing)
- Identity Type: Named Principal
- Authentication Protocol: Password (Basic Auth) for this lab
- Username/Password: your test credentials

**Step 2: Write the OMS Integration Service**

```apex
public with sharing class OMSIntegrationService {

    private static final String OMS_ENDPOINT = 'callout:Order_Management_API';

    // Outbound: Sync Account to OMS
    public static OMSSyncResult syncAccount(Id accountId) {
        Account acc = [
            SELECT Id, Name, Industry, AnnualRevenue, Phone, BillingCity, BillingCountry
            FROM Account
            WHERE Id = :accountId
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];

        // Build request body
        Map<String, Object> payload = new Map<String, Object>{
            'salesforceId' => acc.Id,
            'companyName' => acc.Name,
            'industry' => acc.Industry,
            'annualRevenue' => acc.AnnualRevenue,
            'phone' => acc.Phone,
            'address' => new Map<String, String>{
                'city' => acc.BillingCity,
                'country' => acc.BillingCountry
            }
        };

        HttpRequest req = new HttpRequest();
        req.setEndpoint(OMS_ENDPOINT + '/v1/customers');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/json');
        req.setBody(JSON.serialize(payload));
        req.setTimeout(30000);

        HttpResponse res;
        try {
            res = new Http().send(req);
        } catch (System.CalloutException e) {
            return OMSSyncResult.failure('Callout failed: ' + e.getMessage());
        }

        if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
            Map<String, Object> responseData = (Map<String, Object>)
                JSON.deserializeUntyped(res.getBody());
            String omsId = (String) responseData.get('customerId');

            // Update Salesforce with OMS ID
            update new Account(Id = accountId, OMS_Customer_Id__c = omsId);
            return OMSSyncResult.success(omsId);
        } else if (res.getStatusCode() == 409) {
            return OMSSyncResult.failure('Duplicate: Account already exists in OMS');
        } else {
            return OMSSyncResult.failure('OMS error ' + res.getStatusCode() + ': ' + res.getBody());
        }
    }

    // Result wrapper
    public class OMSSyncResult {
        public Boolean isSuccess { get; private set; }
        public String omsId { get; private set; }
        public String errorMessage { get; private set; }

        private OMSSyncResult() {}

        public static OMSSyncResult success(String omsId) {
            OMSSyncResult r = new OMSSyncResult();
            r.isSuccess = true;
            r.omsId = omsId;
            return r;
        }

        public static OMSSyncResult failure(String message) {
            OMSSyncResult r = new OMSSyncResult();
            r.isSuccess = false;
            r.errorMessage = message;
            return r;
        }
    }
}
```

**Step 3: Create the Custom Field**

Add `OMS_Customer_Id__c` (Text, 50) to Account object.

---

## Part 2: Mock the Callout for Testing

```apex
@isTest
global class OMSCalloutMock implements HttpCalloutMock {
    private Integer statusCode;
    private String body;

    global OMSCalloutMock(Integer statusCode, String body) {
        this.statusCode = statusCode;
        this.body = body;
    }

    global HttpResponse respond(HttpRequest req) {
        // Validate request structure (optional but thorough)
        System.assertEquals('POST', req.getMethod());
        System.assert(req.getEndpoint().contains('/v1/customers'));
        System.assertNotEquals(null, req.getBody());

        HttpResponse res = new HttpResponse();
        res.setStatusCode(statusCode);
        res.setBody(body);
        res.setHeader('Content-Type', 'application/json');
        return res;
    }
}

@isTest
private class OMSIntegrationServiceTest {

    @TestSetup
    static void setup() {
        insert new Account(Name = 'Test Corp', Industry = 'Technology');
    }

    @isTest
    static void testSyncAccountSuccess() {
        String mockResponse = '{"customerId": "OMS-001", "status": "created"}';
        Test.setMock(HttpCalloutMock.class, new OMSCalloutMock(201, mockResponse));

        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Corp' LIMIT 1];

        Test.startTest();
        OMSIntegrationService.OMSSyncResult result = OMSIntegrationService.syncAccount(acc.Id);
        Test.stopTest();

        System.assertEquals(true, result.isSuccess, 'Sync should succeed');
        System.assertEquals('OMS-001', result.omsId, 'OMS ID should be set');

        Account updated = [SELECT OMS_Customer_Id__c FROM Account WHERE Id = :acc.Id];
        System.assertEquals('OMS-001', updated.OMS_Customer_Id__c, 'Account should have OMS ID');
    }

    @isTest
    static void testSyncAccountDuplicate() {
        String mockResponse = '{"error": "Customer already exists"}';
        Test.setMock(HttpCalloutMock.class, new OMSCalloutMock(409, mockResponse));

        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Corp' LIMIT 1];

        Test.startTest();
        OMSIntegrationService.OMSSyncResult result = OMSIntegrationService.syncAccount(acc.Id);
        Test.stopTest();

        System.assertEquals(false, result.isSuccess);
        System.assert(result.errorMessage.contains('Duplicate'));
    }

    @isTest
    static void testSyncAccountNetworkError() {
        // Use a mock that throws a CalloutException
        Test.setMock(HttpCalloutMock.class, new FailingMock());
        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Corp' LIMIT 1];

        Test.startTest();
        OMSIntegrationService.OMSSyncResult result = OMSIntegrationService.syncAccount(acc.Id);
        Test.stopTest();

        System.assertEquals(false, result.isSuccess);
        System.assert(result.errorMessage.contains('Callout failed'));
    }
}

@isTest
global class FailingMock implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        throw new System.CalloutException('Simulated network failure');
    }
}
```

---

## Part 3: Inbound Apex REST — Order Creation

**Objective**: Build an Apex REST endpoint so OMS can create Orders in Salesforce.

**Create Custom Object**: `Order__c` with fields:
- `External_Order_Id__c` (Text, External ID, Unique)
- `Account_External_Id__c` (Text)
- `Order_Amount__c` (Currency)
- `Order_Status__c` (Picklist: New, Processing, Shipped, Cancelled)

```apex
@RestResource(urlMapping='/orders/*')
global with sharing class OrdersRestResource {

    // POST /services/apexrest/orders — Create a new order
    @HttpPost
    global static OrderResponse createOrder(
        String externalOrderId,
        String accountExternalId,
        Decimal amount,
        String status
    ) {
        RestResponse response = RestContext.response;
        OrderResponse result = new OrderResponse();

        // Validate required fields
        if (String.isBlank(externalOrderId) || String.isBlank(accountExternalId)) {
            response.statusCode = 400;
            result.error = 'externalOrderId and accountExternalId are required';
            return result;
        }

        // Idempotency check
        List<Order__c> existing = [
            SELECT Id FROM Order__c
            WHERE External_Order_Id__c = :externalOrderId
            LIMIT 1
        ];
        if (!existing.isEmpty()) {
            response.statusCode = 200;
            result.salesforceId = existing[0].Id;
            result.message = 'Order already exists (idempotent)';
            return result;
        }

        // Resolve Account by external ID
        List<Account> accounts = [
            SELECT Id FROM Account
            WHERE OMS_Customer_Id__c = :accountExternalId
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
        if (accounts.isEmpty()) {
            response.statusCode = 404;
            result.error = 'Account not found for OMS ID: ' + accountExternalId;
            return result;
        }

        // CRUD check
        if (!Schema.sObjectType.Order__c.isCreateable()) {
            response.statusCode = 403;
            result.error = 'Insufficient permissions to create Order';
            return result;
        }

        Order__c order = new Order__c(
            External_Order_Id__c = externalOrderId,
            Account__c = accounts[0].Id,
            Order_Amount__c = amount,
            Order_Status__c = status ?? 'New'
        );
        insert order;

        response.statusCode = 201;
        result.salesforceId = order.Id;
        result.message = 'Order created successfully';
        return result;
    }

    // GET /services/apexrest/orders/<externalOrderId>
    @HttpGet
    global static OrderResponse getOrder() {
        RestRequest req = RestContext.request;
        String externalId = req.requestURI.substring(req.requestURI.lastIndexOf('/') + 1);

        OrderResponse result = new OrderResponse();
        List<Order__c> orders = [
            SELECT Id, External_Order_Id__c, Order_Amount__c, Order_Status__c
            FROM Order__c
            WHERE External_Order_Id__c = :externalId
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];

        if (orders.isEmpty()) {
            RestContext.response.statusCode = 404;
            result.error = 'Order not found';
        } else {
            result.salesforceId = orders[0].Id;
            result.message = 'Found';
        }
        return result;
    }

    global class OrderResponse {
        webservice String salesforceId;
        webservice String message;
        webservice String error;
    }
}
```

**Test the Inbound Endpoint:**

```apex
@isTest
private class OrdersRestResourceTest {

    @TestSetup
    static void setup() {
        Account acc = new Account(Name = 'OMS Corp', OMS_Customer_Id__c = 'OMS-001');
        insert acc;
    }

    @isTest
    static void testCreateOrderSuccess() {
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/orders/';
        req.httpMethod = 'POST';
        RestContext.request = req;
        RestContext.response = res;

        Test.startTest();
        OrdersRestResource.OrderResponse result = OrdersRestResource.createOrder(
            'EXT-ORD-001', 'OMS-001', 5000.00, 'New'
        );
        Test.stopTest();

        System.assertEquals(201, res.statusCode);
        System.assertNotEquals(null, result.salesforceId);
        System.assertEquals('Order created successfully', result.message);

        List<Order__c> orders = [SELECT Id FROM Order__c WHERE External_Order_Id__c = 'EXT-ORD-001'];
        System.assertEquals(1, orders.size());
    }

    @isTest
    static void testCreateOrderIdempotency() {
        // Create first time
        OrdersRestResource.createOrder('EXT-ORD-001', 'OMS-001', 5000.00, 'New');

        // Create again with same external ID — should not create duplicate
        RestResponse res = new RestResponse();
        RestContext.response = res;
        OrdersRestResource.OrderResponse result = OrdersRestResource.createOrder(
            'EXT-ORD-001', 'OMS-001', 5000.00, 'New'
        );

        System.assertEquals(200, res.statusCode);
        System.assertEquals('Order already exists (idempotent)', result.message);

        Integer orderCount = [SELECT COUNT() FROM Order__c WHERE External_Order_Id__c = 'EXT-ORD-001'];
        System.assertEquals(1, orderCount, 'Should still have only one order');
    }
}
```

---

## Lab Completion Checklist

- [ ] `OMSIntegrationService` writes callout using Named Credential prefix (`callout:Order_Management_API`)
- [ ] Service returns a wrapper class result with isSuccess / omsId / errorMessage
- [ ] `OMSCalloutMock` validates request method and endpoint in respond()
- [ ] Three test scenarios: success (201), duplicate (409), network error
- [ ] `OrdersRestResource` handles POST for create and GET for retrieve
- [ ] Create checks idempotency using `External_Order_Id__c`
- [ ] Create enforces CRUD (`Schema.sObjectType.Order__c.isCreateable()`)
- [ ] All test methods set `RestContext.request` and `RestContext.response` before calling the resource

---

## PTA/SA Reflection

After completing this lab:
- You can defend Named Credential usage vs hardcoded URLs in a security review
- You understand idempotency in REST APIs — critical for retry-safe integrations
- You can explain why CRUD checks are mandatory in Apex REST endpoints accessible to external systems
- You can walk a customer's architect through the difference between their callout test without a mock (breaks) vs with a mock (correct)
