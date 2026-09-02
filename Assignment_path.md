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
