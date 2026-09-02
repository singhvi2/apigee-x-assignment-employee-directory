
# Phase 04 — Mediation

## Objective

Transform the backend response into an Employee Directory-specific API response.

The backend is JSONPlaceholder and returns a generic user representation.

The Apigee layer transforms this representation before returning it to the API consumer.

## Backend Response

JSONPlaceholder returns fields including:

* id
* name
* username
* email
* address
* phone
* website
* company

[{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
},...]

## Consumer Response

The API exposes a simplified employee representation containing:

* id
* name
* email
* phone
* company

The employees are returned inside an `employees` array.

{
  "employees": [
    {
      "id": 1,
      "name": "Leanne Graham",
      "email": "Sincere@april.biz",
      "phone": "1-770-736-8031 x56442",
      "company": "Romaguera-Crona"
    }
  ]
}

## Implementation

A JavaScript policy is used for response transformation.

The JavaScript:

1. Reads the backend response.
2. Parses the JSON.
3. Iterates through the returned users.
4. Selects the required employee fields.
5. Constructs the new response object.
6. Replaces the original response payload.

## Policy

TransformEmployeeResponse

The policy references:

jsc://TransformEmployeeResponse.js

## Flow Placement

The transformation executes during the response flow.


Client
   |
   | Request
   v
ProxyEndpoint
   |
   v
Traffic / Security Policies
   |
   v
TargetEndpoint
   |
   v
JSONPlaceholder
   |
   | Response
   v
TransformEmployeeResponse
   |
   
Client

## Why Response Mediation?

The backend contract does not have to match the public API contract.

Apigee can act as an abstraction layer and transform backend data without requiring changes to the backend service.

## Runtime Status

The transformation policy and JavaScript were implemented manually in VS Code.

The transformation logic can be independently tested against the JSONPlaceholder response.

## Learning

This phase demonstrates response mediation and the separation between the backend representation and the public API representation.

The gateway can modify the response before it reaches the consumer while leaving the backend unchanged.
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
## Phase 2 — Traffic Management :

    --> we will implement  spikeArrest and Quota poilicy :
    1.Spike Arrest :  Protects the backend from sudden traffic bursts. ex : 5 requests / second
    2.Quota  : Controls the total number of requests over a longer period.  ex : 100 requests / day

    --> implemnt to ProxyEndpoint flow pipeline in prflow -> Quota and sikeArrets


## Objective

Implement traffic management controls for the Employee Directory API using Apigee policies.

Two policies are implemented:

1. Spike Arrest
2. Quota

## Spike Arrest

### Purpose

Spike Arrest protects the backend from sudden bursts of traffic.

### Configuration


Rate: 5 requests/second

The policy is executed before the request is routed to the backend.

## Quota

### Purpose

Quota controls the total number of requests a client can make during a defined period.

### Configuration

Limit: 100 requests
Period: 1 day
Identifier: client.ip


## Policy Flow


Client
   |   (via HttpProxyConnection)
   v
ProxyEndpoint
   |
   v
PreFlow
   |
   +-- Spike Arrest
   |
   +-- Quota
   |
   v
RouteRule
   |    
   v
TargetEndpoint
   |   (via HttpTargetConnection)
   v
JSONPlaceholder


## Why Both Policies?

Spike Arrest and Quota address different traffic-management requirements.

Spike Arrest controls short-term request bursts, while Quota controls overall request consumption during a longer period.

Using both provides layered traffic protection.

## Implementation

The policies were created manually as Apigee policy XML files using VS Code.

The policies were attached to the ProxyEndpoint PreFlow.



## Evidence

The phase contains:

* Spike Arrest policy XML
* Quota policy XML
* Updated ProxyEndpoint configuration
* Policy flow documentation

## Learning

This phase demonstrates the difference between burst protection and overall usage control.

Spike Arrest is primarily concerned with request rate, while Quota is concerned with accumulated request usage over a configured period.


# Phase 01 — API Proxy Creation

# documentation :

--> creating API Proxy descriptor : top-level definition of the Apigee API proxy.There is an API proxy called employee-directory-api-v1, and it has a ProxyEndpoint called default and a TargetEndpoint called default. : https://docs.cloud.google.com/apigee/docs/api-platform/reference/api-proxy-configuration-reference#baseconfiguration-apiproxyweatherapixml

## Objective

Create a reverse proxy named `employee-directory-api-v1` that exposes the Employee Directory API through the base path:

```text
/v1/employees
```

The proxy is configured to route requests to the mock backend:

```text
https://jsonplaceholder.typicode.com/users
```

## Implementation

The proxy was implemented manually as an Apigee X API proxy bundle using VS Code.

The bundle contains:

- API proxy descriptor : main XML file
- ProxyEndpoint
- TargetEndpoint

## Request Flow

Client
|
| GET /v1/employees (via httpProxyEndpoint)
v
ProxyEndpoint
|
| RouteRule: default
v
TargetEndpoint
|
| GET /users (via httpTargetEndpoint)
v
JSONPlaceholder

``

## Why Reverse Proxy?

The client interacts with the Apigee API endpoint instead of directly accessing the backend.

This allows Apigee to act as the API gateway and later apply security, traffic management, mediation, error handling, and monitoring policies without requiring those concerns to be implemented by the backend.

## Testing

The JSONPlaceholder backend was tested directly using cURL to verify that the configured target is reachable.

reach to folder and use git bash : bash folderName;

## Learning

The main Apigee concepts demonstrated in this phase are:

- API Proxy
- ProxyEndpoint
- TargetEndpoint
- BasePath
- RouteRule
- Reverse proxy architecture

## The ProxyEndpoint controls how the API is exposed to clients, while the TargetEndpoint controls communication with the backend.

# Phase 0: Project Setup & API Design

    --> https://docs.cloud.google.com/apigee/docs/api-platform/reference/api-proxy-configuration-reference#apiproxystructure
    --> Policies are XML files under policies, proxy-side configuration is under proxies, backend configuration is under targets, and custom JavaScript/resources go under resources.

    --> https://github.com/singhvi2/apigee-x-assignment-employee-directory.git
    --> github id : https://github.com/singhvi2/

    ---> strcutre :

apiproxy/
│
├── employee-directory-api-v1.xml [ Main Manifest: Proxy metadata versioning ]
│
├── proxies/ [ Inbound: Client-facing endpoint configuration ]
│ └── default.xml └── Handles incoming requests, PreFlow, and conditional flows
│
├── targets/ [ Outbound: Backend-facing endpoint configuration ]
│ └── default.xml └── Manages connection to backend (e.g., JSONPlaceholder)
│
├── policies/ [ Governance: Reusable XML security & control rules ]
│ ├── Verify-API-Key.xml ├── Validates incoming client API keys
│ ├── Spike-Arrest.xml ├── Protects backend from traffic spikes
│ ├── Quota.xml ├── Enforces rate limits per developer/app
│ └── Transform-Response.xml └── Modifies headers or payloads
│
└── resources/ [ Extensions: Custom scripts and code assets ]
└── jsc/ └── JavaScript Callout folder
└── transform-response.js └── Custom JS logic for advanced data manipulation

## Objective

Prepare the project structure and design the Employee Directory API before implementing the Apigee X proxy.

## Why Phase 0?

The API proxy should be designed before policies are added.

This phase establishes:

- API endpoints
- proxy base path
- backend responsibility
- high-level request/response flow
- repository structure
- implementation plan

## Architecture Decision

Apigee X will be used as the API gateway between the client and the employee backend.

The client will call the Apigee proxy instead of directly calling the backend.

## Planned Implementation

The assignment will be implemented incrementally:

1. Create API proxy
2. Configure traffic management
3. Add security
4. Implement mediation
5. Implement error handling
6. Validate using Debug/Trace and Analytics
7. Implement shared flows
8. Perform final testing and documentation

## Important Learning

Apigee policies are responsible for API-management concerns.

The backend remains responsible for employee-related business logic.

```

```
