# Basic Folder setup: phase 0 :

    --> https://docs.cloud.google.com/apigee/docs/api-platform/reference/api-proxy-configuration-reference#apiproxystructure
    --> Policies are XML files under policies, proxy-side configuration is under proxies, backend configuration is under targets, and custom JavaScript/resources go under resources.

    ---> strcutre :
    employee-directory-api/
    │
    ├── apiproxy/          ← Apigee implementation or say bundle
    │
    ├── postman/            ← testing
    │
    ├── tests/              ← curl tests
    │
    ├── FLOW-DESIGN.md      ← architecture explanation
    │
    └── README.md           ← submission documentation
    |
    └── Assinment_path.md   ← Contains All steps that i follwed while Assingment

    --> github repo : https://github.com/singhvi2/apigee-x-assignment-employee-directory/

## phase-01-api-proxy-creation/ :

# documentation :

--> creating API Proxy descriptor : top-level definition of the Apigee API proxy.There is an API proxy called employee-directory-api-v1, and it has a ProxyEndpoint called default and a TargetEndpoint called default. : https://docs.cloud.google.com/apigee/docs/api-platform/reference/api-proxy-configuration-reference#baseconfiguration-apiproxyweatherapixml

--> updated code in main XML , proxies(default) , tagret(default);
proxy-bundles/
└── employee-directory-api-v1/
└── apiproxy/
├── proxies/ # API proxy endpoints (inbound request handlers and default configurations)
├── targets/ # Target endpoints (outbound backend servers and default configurations)
└── employee-directory-api-v1.xml # Main configuration file defining the API proxy bundle structure

## Phase 2 — Traffic Management :

--> going to implement spikeArrest and QuotA policy
apiproxy/
├── employee-directory-api-v1.xml
├── policies/
│ ├── SpikeArrest.xml
│ └── Quota.xml
├── proxies/
│ └── default.xml #$ implemented both policy in preflow
└── targets/
└── default.xml

--> we will implement spikeArrest and Quota poilicy :
1.Spike Arrest : Protects the backend from sudden traffic bursts. ex : 5 requests / second
2.Quota : Controls the total number of requests over a longer period. ex : 100 requests / day

--> implemnt to ProxyEndpoint flow pipeline in prflow -> Quota and sikeArrets

## Phase 03 — Security:

--> implement verify apiKey policy with objective

--> Requests without a valid API key should not be allowed to reach the backend.

--> https://docs.cloud.google.com/apigee/docs/api-platform/develop/policy-attachment-and-enforcement?utm_source=chatgpt.com#bestpracticescommonpolicysets

--> following how policy should be arranged

apigee-x-employee-directory-api/
│
├── phase-00-project-setup/
│
├── phase-01-api-proxy-creation/
│
├── phase-02-traffic-management/
│ ├── screenshots/
│ ├── policies/
│ │ ├── SpikeArrest.xml
│ │ └── Quota.xml
│ └── notes.md
│
├── phase-03-security/
│ ├── screenshots/
│ ├── policies/
│ │ └── VerifyAPIKey.xml
│ └── notes.md
│
├── proxy-bundles/
│ └── employee-directory-api-v1/
│ └── apiproxy/
│ ├── employee-directory-api-v1.xml
│ ├── policies/
│ │ ├── SpikeArrest.xml
│ │ ├── Quota.xml
│ │ └── VerifyAPIKey.xml
│ ├── proxies/
│ │ └── default.xml
│ └── targets/
│ └── default.xml
│
└── ...

# Phase 04 — Mediation :

--> implemented a js logic to change mediate the response accordingly to hide and add
--> then add that custom js logic to implemtn a js policy as : JavaScript.EmployeeDirectory.TransformEmployeeResponse.xml

--> then add it in preProxyEndpoint of req flow ;

--->then test the result via custum checks;

## Phase 05 — Error Handling :

--> We want our API to return controlled, useful errors instead of exposing raw Apigee/backend errors.
-- target Design :

```text
                         Request
                            │
                            ▼
                    ┌───────────────┐
                    │ Traffic       │
                    │ Security      │
                    │ Policies      │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
           Success                       Fault
              │                           │
              ▼                           ▼
           Backend                  Error Handling
              │                           │
              ▼                           ▼
        Transformation             Custom Response
              │                           │
              └─────────────┬─────────────┘
                            ▼
                          Client
```

--> we are handling

1. Missing API key
2. Invalid API key
3. Spike Arrest violation
4. Quota violation
5. Backend failure
6. Generic/unexpected errors

policies/
├── SpikeArrest.EmployeeDirectory.ControlTraffic.xml
├── Quota.EmployeeDirectory.DailyLimit.xml
├── VerifyAPIKey.EmployeeDirectory.VerifyAPIKey.xml
├── JavaScript.EmployeeDirectory.TransformEmployeeResponse.xml
│
├── AssignMessage.EmployeeDirectory.InvalidApiKey.xml
├── AssignMessage.EmployeeDirectory.SpikeArrestViolation.xml
├── AssignMessage.EmployeeDirectory.QuotaExceeded.xml
├── AssignMessage.EmployeeDirectory.BackendError.xml
└── AssignMessage.EmployeeDirectory.GenericError.xml

--> handling ApiKeyError :

--> i am confused when to use RaiseFault or Assinmessage policy as they both can handle
--> so used Assinmessage policy and define all
--> IN proxyEndPoint we added : InvalidApiKey,SpikeArrestViolation,QuotaExceeded,
--> IN TargetEndpoint we added : BackendError,
--> Important: FaultRule order :

1. ProxyEndpoint → Down to Up (Bottom → Top)
2. TargetEndpoint → Up to Down (Top → Bottom)

## Final Phase 5 architecture

```text

                         CLIENT
                            │
                            ▼
                    ┌───────────────┐
                    │ ProxyEndpoint │
                    └───────┬───────┘
                            │
                     ┌──────▼──────┐
                     │ Spike Arrest│
                     └──────┬──────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
           Success                       Fault
              │                           │
              ▼                           ▼
        Verify API Key              FaultRules
              │                           │
              │                    ┌──────┴───────┐
              │                    │              │
              │                   401            429
              │                 API Key      Rate/Quota
              │
              ▼
            Quota
              │
              ▼
        TargetEndpoint
              │
              ▼
       JSONPlaceholder
              │
        ┌─────┴─────┐
        │           │
     Success      Failure
        │           │
        ▼           ▼
   JavaScript     Target
   Transform      FaultRule
        │           │
        │          502
        │
        ▼
      CLIENT
```

-->
