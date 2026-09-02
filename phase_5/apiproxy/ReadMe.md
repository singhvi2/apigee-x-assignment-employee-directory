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

phase-05-error-handling/
│
├── screenshots/
│
├── policies/
│ ├── AssignMessage.EmployeeDirectory.InvalidApiKey.xml
│ ├── AssignMessage.EmployeeDirectory.SpikeArrestViolation.xml
│ ├── AssignMessage.EmployeeDirectory.QuotaExceeded.xml
│ ├── AssignMessage.EmployeeDirectory.BackendError.xml
│ └── AssignMessage.EmployeeDirectory.GenericError.xml
│
└── ReadMe.md

apiproxy/
├── policies/
│ ├── JavaScript.EmployeeDirectory.TransformEmployeeResponse.xml
│ ├── Quota.EmployeeDirectory.DailyLimit.xml
│ ├── SpikeArrest.EmployeeDirectory.ControlTraffic.xml
│ ├── VerifyAPIKey.EmployeeDirectory.VerifyAPIKey.xml
│ │
│ ├── AssignMessage.EmployeeDirectory.InvalidApiKey.xml
│ ├── AssignMessage.EmployeeDirectory.SpikeArrestViolation.xml
│ ├── AssignMessage.EmployeeDirectory.QuotaExceeded.xml
│ ├── AssignMessage.EmployeeDirectory.BackendError.xml
│ └── AssignMessage.EmployeeDirectory.GenericError.xml
│
├── proxies/
│ └── default.xml
│
├── resources/
│ └── jsc/
│ └── TransformEmployeeResponse.js
│
└── targets/
  └── default.xml

Each policy defines the appropriate HTTP status code, reason phrase, response headers, and JSON error payload.

## Error Handling Flow

```text
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
```

Unexpected faults are intended to be handled by the `DefaultFaultRule` and returned as a generic `500 Internal Server Error`.

This keeps the public API contract consistent even if the backend implementation changes

## Fault Handling

Apigee policy failures generate faults that can be handled through `FaultRules` and `DefaultFaultRule`.

Specific fault conditions are intended to route to the corresponding custom error response, while the default fault rule provides a fallback for unexpected errors.


## Learning

This phase demonstrates how API gateway faults can be handled separately from successful request processing.

The main concepts covered are:

- `FaultRules`
- `DefaultFaultRule`
- `RaiseFault`
- HTTP error status codes
- Consistent JSON error contracts
- Separation of internal errors from public API responses
- Fault flow in proxyEndpoint and targetEndPOint
