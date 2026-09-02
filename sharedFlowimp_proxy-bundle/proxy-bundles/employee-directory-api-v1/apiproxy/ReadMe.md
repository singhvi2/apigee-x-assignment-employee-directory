# Phase 07 — Shared Flows

## Objective

Introduce an Apigee Shared Flow to centralize reusable API security and
traffic-management policies.

## Why Shared Flows?

Shared Flows allow common API processing to be implemented once and reused
across multiple API proxies.

Without a Shared Flow, each proxy would need to independently configure the
same common policies.

## Shared Flow

employee-directory-common-security


## Phase 7 : ## creating Shared FLow stepwise :

--> follow the strucure : https://docs.cloud.google.com/apigee/docs/api-platform/reference/shared-flow-bundle-configuration-reference#sharedflowbundlestructure

--> understand the stucture :employee-directory-common-security.xml(root config), policies/,sharedflows/
--> then write the root folder (base folder ) : SharedFlowBundle, description, policies, sharedflows(tells where is pipelines)
--> implemented all policy from policies in sharedflows default.xml

## write flowcallout in polices

--> write flowCallout.EmployeeDirectory.ExecuteCommonSecurity.xml
https://docs.cloud.google.com/apigee/docs/api-platform/reference/policies/flow-callout-policy#elements
--> then in proxyEndpoint  update the request to use flowcallout instead of calling each call this directly 

## architecure :

```text
phase_7/
│
├── proxy-bundles/
│   │
│   ├── employee-directory-api-v1/
│   │   └── apiproxy/
│   │       ├── policies/
│   │       ├── proxies/
│   │       ├── resources/
│   │       ├── targets/
│   │       └── employee-directory-api-v1.xml
│   │
│   └── employee-directory-common-security/
│       └── sharedflow/
│           ├── policies/
│           │   ├── SpikeArrest.EmployeeDirectory.ControlTraffic.xml
│           │   ├── VerifyAPIKey.EmployeeDirectory.VerifyAPIKey.xml
│           │   └── Quota.EmployeeDirectory.DailyLimit.xml
│           │
│           ├── sharedflows/
│           │   └── default.xml
│           │
│           └── employee-directory-common-security.xml
│
└── screenshots/


employee-directory-api-v1
│
├── FlowCallout ───────────────┐
├── Error Handling             │
└── Response Transformation    │
                               ▼
                 employee-directory-common-security
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
             Spike Arrest   Verify API Key   Quota


```

---

# 7.14 Final architecture

We've now built something substantially more realistic:

```text
                         CLIENT
                            │
                            ▼
                 employee-directory-api-v1
                            │
                            ▼
      FlowCallout.EmployeeDirectory.ExecuteCommonSecurity
                            │
                            ▼
            employee-directory-common-security
                            │
                  ┌─────────┼─────────┐
                  │         │         │
                  ▼         ▼         ▼
               Spike     Verify     Quota
               Arrest    API Key
                  │         │         │
                  └─────────┼─────────┘
                            │
                            ▼
                      TargetEndpoint
                            │
                            ▼
                    JSONPlaceholder
                            │
                            ▼
          JavaScript.EmployeeDirectory.TransformEmployeeResponse
                            │
                            ▼
                          CLIENT


```

