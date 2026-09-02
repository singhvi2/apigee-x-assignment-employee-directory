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