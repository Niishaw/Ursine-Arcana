# Testing Strategy - Ursine Arcana

## Overview

This document defines the testing approach for the Ursine Arcana project across:

- **Mobile app** (`client/mobile` – Expo React Native)
- **Firebase Cloud Functions** (`server/functions`)
- **Shared package** (`packages/shared`)

The goal is to keep tests fast, reliable, and close to the code while supporting future CI integration.

---

## Testing Tools & Frameworks

- **Test Runner**: Jest
- **Mobile UI & hooks**: React Native Testing Library (`@testing-library/react-native`) + `@testing-library/jest-native`
- **Firebase Functions**: Jest + `firebase-functions-test`
- **TypeScript Support**: `ts-jest` or Babel/Jest config as appropriate per workspace

We will prefer **unit and integration tests** over heavy end-to-end tests initially, and add E2E (e.g. Detox / Playwright) in a later phase if needed.

---

## Scope by Area

### 1. Mobile App (`client/mobile`)

**Objectives**

- Verify key flows around authentication and onboarding.
- Keep tests independent of real Firebase where possible (use mocks/test config).

**Initial test coverage (Phase A)**

- **Auth & Age Gate**
  - Age Gate validation (18+ logic, edge cases).
  - Login screen behaviour:
    - Shows validation errors for invalid input.
    - Calls Firebase Auth wrapper on submit.
  - Signup screen behaviour:
    - Required fields enforced.
    - Successful and failed signups handled correctly.
  - Auth state handling:
    - Redirects correctly based on signed-in state.
- **Navigation & Guards**
  - Screens behind auth are inaccessible when logged out.
  - Initial route selection based on auth state.

**Later coverage (Phase B)**

- Onboarding screens (profile setup, consent, location permissions).
- Core features: discovery grid behaviour, chat store logic, blocking/reporting UIs.

**Implementation Notes**

- Add and configure:
  - `@testing-library/react-native`
  - `@testing-library/jest-native`
- Create Jest config for React Native/Expo (transformers, moduleNameMapper for `expo-router`, assets, etc.).
- Add `jest.setup.ts` to:
  - Extend Jest matchers from `@testing-library/jest-native`.
  - Mock common React Native / Expo modules as needed.

---

### 2. Firebase Cloud Functions (`server/functions`)

**Objectives**

- Validate business logic inside triggers and callable HTTP functions without hitting production resources.
- Prevent regressions in security-sensitive flows (auth triggers, audit logs, cleanup jobs).

**Initial test coverage (Phase A)**

- `auth` triggers (e.g. `onUserCreated`, `onUserDeleted`):
  - Creating audit log entries with correct fields.
  - Cleaning up user data and related documents on deletion (users, blocks, etc.).
- Any callable/API functions that will back the auth and onboarding flows.

**Implementation Notes**

- Use `firebase-functions-test` with Jest.
- Organize tests under `server/functions/test` or `server/functions/__tests__`.
- Use a dedicated **test Firestore project/emulator**:
  - Prefer running tests against the **Firebase emulator** or an in-memory Firestore test environment.
- Ensure tests clean up created documents between runs.

**Later coverage (Phase B)**

- Scheduled jobs (e.g. cleanup tasks, analytics aggregation).
- Functions related to reporting, blocking, moderation, and notifications.

---

### 3. Shared Package (`packages/shared`)

**Objectives**

- Keep domain logic (e.g., species/roles/tags helpers, validation utilities) well-covered and reusable.

**Initial test coverage (Phase A)**

- Utility functions used by both mobile and functions:
  - Validation helpers (e.g. age, consent, region compliance).
  - Any shared mappers or constants that encapsulate business rules.

**Implementation Notes**

- Use Jest with a simple TypeScript configuration (likely `ts-jest`).
- Keep tests close to the source files (e.g. `__tests__` folders or `*.test.ts` colocated).

---

## Test Command Strategy

### Workspace-level commands

Each workspace will expose a `test` script:

- **Root**: `npm test --workspaces --if-present`
- **Mobile**: `npm test -w @ursine-arcana/mobile`
- **Functions**: `npm test -w @ursine-arcana/functions`
- **Shared**: `npm test -w @ursine-arcana/shared`

(We will add/adjust these scripts during implementation.)

### Recommended usage

- During feature work:
  - Run focused tests per workspace (e.g. `npm test -w @ursine-arcana/mobile`).
- Before commits / CI:
  - Run all tests from the root (e.g. `npm test --workspaces --if-present`).

---

## Phased Rollout Plan

### Phase A: Foundation

1. **Mobile**
   - Add Jest config and setup file.
   - Install React Native Testing Library packages.
   - Implement first tests for Age Gate and Login screen.
2. **Functions**
   - Configure Jest + `firebase-functions-test`.
   - Add tests for `onUserCreated` and `onUserDeleted` triggers.
3. **Shared**
   - Set up Jest config.
   - Add tests for key validation/util helpers.

### Phase B: Feature Coverage

- Expand tests for onboarding, discovery, chat, and moderation flows.
- Add tests when new features are added (test-first or test-alongside-feature where practical).

### Phase C: CI Integration (Later)

- Add CI pipeline (GitHub Actions or similar) to:
  - Install dependencies.
  - Run linting and typechecking.
  - Run tests for all workspaces.

---

## Documentation & Maintenance

- Update this document as we:
  - Add new testing areas (e.g. E2E tests).
  - Introduce new workspaces or major features.
- For every major feature, include a brief **"Testing"** subsection in its planning doc to describe intended coverage.
