# Employee Directory API — Flow Design

## External API

The client accesses the API through the Apigee proxy.

Base path:

```text
/employee-directory/v1
```

## Endpoints

| Method | Path              | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/employees`      | Retrieve employees   |
| GET    | `/employees/{id}` | Retrieve an employee |
| POST   | `/employees`      | Create an employee   |
| PUT    | `/employees/{id}` | Update an employee   |
| DELETE | `/employees/{id}` | Delete an employee   |

## Request Flow

```text
Client
  |
  v
ProxyEndpoint
  |
  v
PreFlow
  |
  +-- Security
  |
  +-- Traffic Management
  |
  v
Conditional Flow
  |
  +-- GET /employees
  +-- GET /employees/{id}
  +-- POST /employees
  +-- PUT /employees/{id}
  +-- DELETE /employees/{id}
  |
  v
TargetEndpoint
  |
  v
Backend API
```

## Response Flow

```text
Backend API
    |
    v
TargetEndpoint
    |
    v
PostFlow / Response Processing
    |
    +-- Response transformation
    +-- Error handling
    +-- Logging where required
    |
    v
Client
```

## Policy Placement

The exact policy placement will be determined during implementation.

The initial design is:

* Security → proxy request flow
* Spike Arrest → traffic-control flow
* Quota → traffic-control flow
* Mediation → request/response processing
* Error handling → fault flows
* Shared policies → reusable shared flows
* Debugging/analytics → verification and monitoring

Policy placement will be documented again during each implementation phase.
