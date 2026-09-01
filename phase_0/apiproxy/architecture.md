# Employee Directory API — Architecture

## Overview

The Employee Directory API will be exposed through an Apigee X API proxy.

Apigee X will act as the API gateway between the client and the backend employee service.

The client will communicate only with the Apigee endpoint. Apigee will validate, control, transform, and route the request before forwarding it to the backend.

## High-Level Architecture

```text
Client
   |
   | HTTP Request
   v
Apigee X
   |
   | API Proxy
   |
   +-- Security
   +-- Traffic Management
   +-- Mediation
   +-- Error Handling
   +-- Logging / Monitoring
   |
   v
Employee Backend API
   |
   v
Employee Data
```

## Responsibilities

### Client

The client consumes the Employee Directory API.

Examples include:

- Postman
- cURL
- Other HTTP clients

### Apigee X

Apigee provides the API gateway layer + management + monetisation.

The proxy will be responsible for:

- routing requests to the backend
- applying security policies
- controlling traffic
- transforming requests/responses where required
- handling API errors
- providing debugging and analytics information
- demonstrating reusable shared flows

### Backend

The backend provides the actual employee data and business operations.

Apigee should not contain the core employee business logic.

## Design Goal

The design separates API gateway responsibilities from backend business logic.

This allows policies and API-management concerns to be handled at the Apigee layer while the backend remains focused on employee operations.


## Define the Apigee proxy
Client
  │
  │ GET /employee-directory/v1/employees
  ▼
┌─────────────────────────┐
│       Apigee X          │
│                         │
│  Employee Directory     │
│       Proxy             │
│                         │
│  Security               │
│  Traffic Management     │
│  Mediation              │
│  Error Handling         │
│  Logging                │
└────────────┬────────────┘
             │
             │ GET /employees
             ▼
      Employee Backend


## Decide our backend API

Client
  │
  │ HTTP request
  ▼
Apigee X
  │
  │ Proxy
  ▼
Employee Backend API
  │
  ▼
Employee Data
