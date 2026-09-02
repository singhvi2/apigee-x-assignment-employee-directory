## Phase 03 — Security :

--> implement VerifyAPIKey policy

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
