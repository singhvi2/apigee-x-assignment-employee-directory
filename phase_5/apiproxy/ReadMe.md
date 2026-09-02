# Phase 05 — Error Handling

## Objective

Implement centralized error handling for the Employee Directory API so that clients receive consistent and meaningful error responses instead of raw Apigee or backend error messages.

## Error Scenarios

The following error scenarios are covered:

| Scenario                    | HTTP Status | Error Code            |
| --------------------------- | ----------: | --------------------- |
| Missing/invalid API key     |         401 | `INVALID_API_KEY`     |
| Spike Arrest violation      |         429 | `RATE_LIMIT_EXCEEDED` |
| Quota exceeded              |         429 | `QUOTA_EXCEEDED`      |
| Backend unavailable/failure |         502 | `BACKEND_UNAVAILABLE` |
| Unexpected error            |         500 | `INTERNAL_ERROR`      |

## Error Response Format

The API uses a consistent JSON structure:

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "A valid API key is required."
  }
}
```

This provides a predictable response format for API consumers.

## Policies

The following `RaiseFault` policies were created:


RaiseFault.InvalidApiKey.xml
RaiseFault.SpikeArrest.xml
RaiseFault.Quota.xml
RaiseFault.BackendError.xml
RaiseFault.Generic.xml


Each policy defines the appropriate HTTP status code, reason phrase, response headers, and JSON error payload.

## Error Handling Flow


Client
   |
   v
ProxyEndpoint
   |
   +-- Spike Arrest
   |       |
   |       +-- Violation → 429
   |
   +-- Verify API Key
   |       |
   |       +-- Invalid/Missing → 401
   |
   +-- Quota
   |       |
   |       +-- Exceeded → 429
   |
   v
TargetEndpoint
   |
   +-- Backend Failure → 502
   |
   v
Response Transformation
   |
   v
Client


Unexpected faults are intended to be handled by the `DefaultFaultRule` and returned as a generic `500 Internal Server Error`.

## Why Custom Error Responses?

Returning a controlled error response prevents consumers from depending on internal gateway or backend implementation details.

For example, instead of exposing a backend-specific failure, the API provides:

```json
{
  "error": {
    "code": "BACKEND_UNAVAILABLE",
    "message": "The employee service is currently unavailable."
  }
}
```

This keeps the public API contract consistent even if the backend implementation changes.

## Error Response Headers

Custom error responses use:
Content-Type: application/json

This ensures that clients can consistently interpret the error payload as JSON.

## Fault Handling

Apigee policy failures generate faults that can be handled through `FaultRules` and `DefaultFaultRule`.

Specific fault conditions are intended to route to the corresponding custom error response, while the default fault rule provides a fallback for unexpected errors.

## Implementation

The error-handling configuration was created manually in VS Code as part of the Apigee proxy bundle.

The actual policy files are maintained under:


proxy-bundles/employee-directory-api-v1/apiproxy/policies/


Documentation copies are maintained under:


phase-05-error-handling/policies/


## Runtime Limitation

A live Apigee X runtime is not available for this assignment.

Therefore, the fault policies cannot be triggered and verified through an actual deployed Apigee proxy.

The XML configuration and expected runtime behavior are documented without claiming live Apigee execution.

## Expected Behaviour

### Invalid API Key


Request
   |
   v
VerifyAPIKey
   |
   v
401 Unauthorized


Response:

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "A valid API key is required."
  }
}
```

### Spike Arrest Violation


Request
   |
   v
SpikeArrest
   |
   v
429 Too Many Requests


### Quota Violation


Request
   |
   v
Quota
   |
   v
429 Too Many Requests


### Backend Failure


Apigee
   |
   v
Backend
   X
Failure
   |
   v
502 Bad Gateway


### Unexpected Error


Unexpected Fault
       |
       v
DefaultFaultRule
       |
       v
500 Internal Server Error


## Learning

This phase demonstrates how API gateway faults can be handled separately from successful request processing.

The main concepts covered are:

* `FaultRules`
* `DefaultFaultRule`
* `RaiseFault`
* HTTP error status codes
* Consistent JSON error contracts
* Separation of internal errors from public API responses

