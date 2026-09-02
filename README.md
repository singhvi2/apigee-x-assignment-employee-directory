# Apigee X — Employee Directory API

## Project Overview

This project implements an Employee Directory API using Google Cloud Apigee X.

The implementation demonstrates API management concepts including:

- API proxy creation
- Traffic management
- Security
- Request/response mediation
- Error handling
- Debugging and analytics
- Shared flows


## Implementation Approach

The project is developed incrementally in phases.

Each phase contains:

- implementation notes
- configuration/policy files where applicable
- screenshots/evidence
- testing information
- lessons learned

The purpose of this structure is to document the implementation process rather than only provide the final proxy bundle.

## Project Structure

phase-00-project-setup/
phase-01-api-proxy-creation/
phase-02-traffic-management/
phase-03-security/
phase-04-mediation/
phase-05-error-handling/
phase-06-debug-trace-analytics/
phase-07-shared-flows/
postman/
proxy-bundles/
final-submission/

## API Proxy

Base path:
/employee-directory/v1
Target: https://jsonplaceholder.typicode.com/users

## Status

| Phase                                | Status      |
| ------------------------------------ | ----------- |
| Phase 00 — Project Setup             | Done        |
| Phase 01 — API Proxy Creation        | Done        |
| Phase 02 — Traffic Management        | Done        |
| Phase 03 — Security                  | Done        |
| Phase 04 — Mediation                 | Done        |
| Phase 05 — Error Handling            | InProgress  |
| Phase 06 — Debug / Trace / Analytics | Not Started |
| Phase 07 — Shared Flows              | Not Started |



## Architecture

Client
   |
   v
Apigee API Proxy
   |
   +-- Traffic Management
   |     +-- Spike Arrest
   |     +-- Quota
   |
   +-- Security
   |     +-- Verify API Key
   |
   +-- Mediation
   |     +-- Response Transformation
   |
   +-- Error Handling
   |     +-- Custom Fault Responses
   |
   v
JSONPlaceholder Backend


## Implemented Features

### API Proxy

- Reverse proxy configuration
- `/v1/employees` base path
- JSONPlaceholder backend target

### Traffic Management

- Spike Arrest
- Quota

### Security

- API key validation using `VerifyAPIKey`

### Mediation

- Backend response transformation
- Employee-specific response structure
- Response `Content-Type` normalization

### Error Handling

Planned/custom handling for:

- Invalid API key
- Spike Arrest violations
- Quota violations
- Backend failures
- Generic unexpected errors

