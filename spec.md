# Lucky Spin Casino

## Current State
App has a single RegisterModal that only shows a register form. Returning users who are already registered get a "User already registered" error. The backend has no endpoint to fetch the current user profile, so there is no way to detect existing registration on load.

## Requested Changes (Diff)

### Add
- getMyProfile() backend query returning Option<Profile>
- Auto-session restore in UserContext on actor load
- Login tab in auth modal for returning users

### Modify
- RegisterModal: add Login tab / returning user detection
- UserContext: call getMyProfile on actor load
- backend.d.ts: add getMyProfile signature
- main.mo: add getMyProfile query

### Remove
- Hard trap when user already registered

## Implementation Plan
1. Update main.mo: add getMyProfile returning ?Profile
2. Update backend.d.ts: add getMyProfile
3. Update UserContext: restore session silently if profile found
4. Rewrite RegisterModal as AuthModal with login/register tabs
