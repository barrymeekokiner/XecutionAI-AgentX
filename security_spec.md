# XecutionAI Firebase Security Specification

## Data Invariants
1. **Ownership Isolation**: Users can only read, create, update, or delete documents where the parent `{userId}` path variable matches their `request.auth.uid`.
2. **Result Integrity**: Execution results are immutable once created, except for potential 'archived' flags if added later (not currently in schema).
3. **Settings Privacy**: API keys and personal instructions must be strictly restricted to the owner.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to write to `/users/attacker_uid/settings/global` using `victim_uid`'s token.
2. **Cross-User Leak**: Attempt to read `/users/victim_uid/results/some_result` as `attacker_uid`.
3. **Orphaned Write**: Attempt to create a result without a valid user profile.
4. **Schema Poisoning**: Inject a 1MB string into `AppSettings.model`.
5. **Timestamp Fraud**: Manually setting `createdAt` to a future date instead of using server time.
6. **Malicious ID**: Using a path variable like `../profiles/admin` to try and escape the user directory.
7. **Type Mismatch**: Sending a number for `AppSettings.autoRefine` (boolean expected).
8. **Shadow Field**: Adding `isAdmin: true` to a `UserProfile` creation payload.
9. **Blanket Query**: Querying `collectionGroup('results')` to see all users' data.
10. **Resource Exhaustion**: Sending an array with 10,000 logs in `agentLogs`.
11. **PII Exposure**: Trying to read another user's email via a public list.
12. **Unverified Access**: Writing data with an unverified email token (if required).

## Test Runner Plan
I will use `firestore.rules.test.ts` to simulate these attacks once rules are drafted.
