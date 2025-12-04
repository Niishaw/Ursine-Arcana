# Testing Setup - Documentation

> **Created**: 2025-12-04  
> **Status**: Active  
> **Last Updated**: 2025-12-04

---

## Overview

This document describes the testing infrastructure for the Ursine Arcana mobile app.

---

## 1. Testing Stack

| Tool                          | Purpose              | Version  |
| ----------------------------- | -------------------- | -------- |
| Jest                          | Test runner          | ^29.7.0  |
| jest-expo                     | Expo preset for Jest | ^54.0.13 |
| @testing-library/react-native | Component testing    | ^12.4.3  |

---

## 2. Configuration

### 2.1 Jest Config (in `package.json`)

```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["./__tests__/setup/jest.setup.ts"],
    "testMatch": ["**/__tests__/**/*.test.ts?(x)"],
    "collectCoverageFrom": [
      "app/**/*.{ts,tsx}",
      "src/**/*.{ts,tsx}",
      "!**/__tests__/**",
      "!**/node_modules/**"
    ],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|...)"
    ],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  }
}
```

### 2.2 Setup File Location

`client/mobile/__tests__/setup/jest.setup.ts`

Contains mocks for:

- `expo-font`
- `expo-linear-gradient`
- `@react-native-masked-view/masked-view`
- `expo-web-browser`
- `expo-auth-session`
- `firebase/auth`
- `@/services/firebase`
- `@/context/AuthContext`
- `react-native-safe-area-context`
- `expo-router`
- `@expo/vector-icons`

---

## 3. Test File Structure

Tests are co-located with source files in `__tests__` directories:

```
client/mobile/
├── __tests__/
│   └── setup/
│       └── jest.setup.ts       # Global mocks
├── app/
│   └── (auth)/
│       └── __tests__/
│           └── login.test.tsx  # Login screen tests
├── src/
│   ├── context/
│   │   └── __tests__/          # Context tests (future)
│   ├── components/
│   │   └── __tests__/          # Component tests (future)
│   └── services/
│       └── __tests__/          # Service tests (future)
```

---

## 4. Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

---

## 5. Current Test Coverage

### Login Screen (`login.test.tsx`) - 14 tests

| Category                | Tests | Status  |
| ----------------------- | ----- | ------- |
| **Rendering**           | 6     | ✅ Pass |
| - Logo and tagline      | 1     | ✅      |
| - Email/Phone tabs      | 1     | ✅      |
| - Sign Up button        | 1     | ✅      |
| - Google sign-in button | 1     | ✅      |
| - Log in button         | 1     | ✅      |
| - Forgot password link  | 1     | ✅      |
| **Tab Switching**       | 3     | ✅ Pass |
| - Default email fields  | 1     | ✅      |
| - Switch to phone       | 1     | ✅      |
| - Switch back to email  | 1     | ✅      |
| **Form Input**          | 3     | ✅ Pass |
| - Email input           | 1     | ✅      |
| - Password input        | 1     | ✅      |
| - Phone input           | 1     | ✅      |
| **Login Button**        | 2     | ✅ Pass |
| - Calls signIn          | 1     | ✅      |
| - Loading state         | 1     | ✅      |

---

## 6. Writing New Tests

### 6.1 Basic Component Test

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('handles button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);

    fireEvent.press(getByText('Button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 6.2 Testing with Async Operations

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';

it('handles async operation', async () => {
  const { getByText } = render(<MyComponent />);

  fireEvent.press(getByText('Submit'));

  await waitFor(() => {
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### 6.3 Mocking Context

```tsx
// In test file
jest.mock('@/context/MyContext', () => ({
  useMyContext: () => ({
    value: 'mocked',
    action: jest.fn(),
  }),
}));
```

---

## 7. Test Naming Conventions

- Test files: `{ComponentName}.test.tsx` or `{feature}.test.ts`
- Describe blocks: Component or feature name
- Test names: Start with action verb ("renders", "calls", "shows", "handles")

---

## 8. Future Test Targets

| Screen/Component    | Priority | Status  |
| ------------------- | -------- | ------- |
| Login screen        | High     | ✅ Done |
| Terms screen        | High     | Pending |
| Age gate screen     | High     | Pending |
| Signup screen       | High     | Pending |
| Verify email screen | High     | Pending |
| AuthContext         | High     | Pending |
| NeonText component  | Low      | Pending |

---

_This document will be updated as new tests are added._
