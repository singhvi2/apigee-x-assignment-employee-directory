# Phase 06 — Debug, Trace & Analytics

## Objective

Understand how the Employee Directory API can be debugged, traced, and
monitored using Apigee runtime capabilities.

Unlike previous phases, this phase does not introduce new API proxy policies.

Debug/Trace and Analytics are Apigee platform/runtime capabilities.

## Debug / Trace

Debug/Trace can be used to inspect an individual request as it moves through
the API proxy.

For the Employee Directory API, the expected flow is:

```text
Client
   |
   v
ProxyEndpoint
   |
   +-- SpikeArrest.EmployeeDirectory.ControlTraffic
   |
   +-- VerifyAPIKey.EmployeeDirectory.VerifyAPIKey
   |
   +-- Quota.EmployeeDirectory.DailyLimit
   |
   v
TargetEndpoint
   |
   v
JSONPlaceholder
   |
   v
JavaScript.EmployeeDirectory.TransformEmployeeResponse
   |
   v
Client

```

## Trace Information

A trace session can be used to inspect:

Request method
Request URL
Request headers
Policy execution
Flow variables
Target request
Target response
Response transformation
Final response
Fault information

## Trace Test Scenarios

Successful Request
GET /v1/employees
X-API-Key: <VALID_API_KEY>

Expected:

Spike Arrest PASS
Verify API Key PASS
Quota PASS
Target PASS
Transformation PASS
HTTP Status 200
Invalid API Key
GET /v1/employees
X-API-Key: <INVALID_API_KEY>

Expected:

Spike Arrest PASS
Verify API Key FAIL
Fault Rule EXECUTED
HTTP Status 401
Backend Failure

Expected:

Spike Arrest PASS
Verify API Key PASS
Quota PASS
Target FAIL
Backend FaultRule EXECUTED
HTTP Status 502
