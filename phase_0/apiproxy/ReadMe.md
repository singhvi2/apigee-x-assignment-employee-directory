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

* API endpoints
* proxy base path
* backend responsibility
* high-level request/response flow
* repository structure
* implementation plan

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


