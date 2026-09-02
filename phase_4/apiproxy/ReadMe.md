# Phase 04 — Mediation

## Objective

Transform the backend response into an Employee Directory-specific API response.

The backend is JSONPlaceholder and returns a generic user representation.

The Apigee layer transforms this representation before returning it to the API consumer.

## Backend Response

JSONPlaceholder returns fields including:

- id
- name
- username
- email
- address
- phone
- website
- company

```json
[
  {
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
  }
]
```

## Consumer Response

The API exposes a simplified employee representation containing:

- id
- name
- email
- phone
- company

The employees are returned inside an `employees` array.

```json
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
```

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
