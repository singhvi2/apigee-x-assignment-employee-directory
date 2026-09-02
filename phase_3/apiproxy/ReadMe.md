## Phase 03 — Security :

--> implement VerifyAPIKey policy

--> https://docs.cloud.google.com/apigee/docs/api-platform/develop/policy-attachment-and-enforcement?utm_source=chatgpt.com#bestpracticescommonpolicysets  
--> following policy order accordingly 
## client should send like this : 
GET /v1/employees
X-API-Key: abc123



# Phase 03 — Security

## Objective

Secure the Employee Directory API by requiring API-key validation before requests are forwarded to the backend.

## Security Mechanism

The proxy uses the Apigee `VerifyAPIKey` policy.

The API key is expected in the HTTP request header:
X-API-Key


## Policy Configuration

Policy: VerifyAPIKey
API key location: request.header.X-API-Key


## Request Flow


Client
   |
   | X-API-Key
   v
ProxyEndpoint
   |
   v
Spike Arrest
   |
   v
Verify API Key
   |
   +---- Invalid / Missing
   |          |
   |          v
   |        Fault
   |
   +---- Valid
              |
              v
            Quota
              |
              v
        TargetEndpoint
              |
              v
        JSONPlaceholder


## Why API Key Authentication?

API-key validation is suitable for demonstrating application-level access control for this assignment.

The client must provide a key before the request is allowed to continue to the backend.

## Why Use a Header?

The key is supplied using:

X-API-Key


rather than a query parameter.

This avoids exposing the key directly in the URL.

## Implementation

The `VerifyAPIKey` policy was created manually as an Apigee policy XML file using VS Code.

The policy was attached to the ProxyEndpoint request PreFlow.

## Runtime Verification

A live API-key validation test cannot be performed because an Apigee X runtime/environment is not available for this assignment.

A real API key requires Apigee developer/application/API-product configuration.

The policy configuration has therefore been implemented and documented locally without claiming a live runtime result.

## Expected Runtime Behaviour

### Valid API key


Client
  |
  | X-API-Key: valid-key
  v
VerifyAPIKey
  |
  v
Request continues


### Missing API key


Client
  |
  | No API key
  v
VerifyAPIKey
  |
  v
Request rejected


### Invalid API key

Client
  |
  | X-API-Key: invalid-key
  v
VerifyAPIKey
  |
  v
Request rejected


## Learning

The VerifyAPIKey policy performs API-key validation at the API gateway layer.

The backend does not need to implement this validation itself.

The policy also produces flow variables that can be used by subsequent policies, which is useful when implementing application-specific quotas and other gateway behaviour.


## 2. Verify API Key

Determine whether the client is authorized.

## Expected Runtime Behaviour

Valid API key
Client
|
| X-API-Key: valid-key
v
VerifyAPIKey
|
v
Request continues
Missing API key
Client
|
| No API key
v
VerifyAPIKey
|
v
Request rejected
Invalid API key
Client
|
| X-API-Key: invalid-key
v
VerifyAPIKey
|
v
Request rejected




apigee-x-employee-directory-api/
│
├── phase-00-project-setup/
│
├── phase-01-api-proxy-creation/
│
├── phase-02-traffic-management/
│   ├── screenshots/
│   ├── policies/
│   │   ├── SpikeArrest.xml
│   │   └── Quota.xml
│   └── notes.md
│
├── phase-03-security/
│   ├── screenshots/
│   ├── policies/
│   │   └── VerifyAPIKey.xml
│   └── notes.md
│
├── proxy-bundles/
│   └── employee-directory-api-v1/
│       └── apiproxy/
│           ├── employee-directory-api-v1.xml
│           ├── policies/
│           │   ├── SpikeArrest.xml
│           │   ├── Quota.xml
│           │   └── VerifyAPIKey.xml
│           ├── proxies/
│           │   └── default.xml
│           └── targets/
│               └── default.xml
│
└── ...