# Authentication & Signup Flow - Planning

> **Created**: 2025-12-04  
> **Updated**: 2025-12-05  
> **Status**: In Progress  
> **Priority**: High (Phase 2)

---

## 🚀 Resume Here (2025-12-05)

### Session Summary

- ✅ Jest testing infrastructure complete (15 tests passing)
- ✅ Android custom dev build working
- ✅ Login screen updated: phone tab now requires password
- ✅ Phone+password registration flow documented (section 2.2.1)
- ⏸️ iOS build blocked (requires Apple Developer $99/yr)

### Next Session Tasks

1. **Enable Firebase Auth in Console**
   - Email/Password provider
   - Phone provider + test phone numbers

2. **Create Signup Flow Screens** (Phase 3 in implementation plan below)
   - `(auth)/terms.tsx` - Terms & Conditions
   - `(auth)/age-gate.tsx` - Update to Grindr-style DD/MM/YYYY
   - `(auth)/signup.tsx` - Create account form
   - `(auth)/verify-email.tsx` - 6-digit code input

3. **Wire Navigation**
   - Login "Sign Up" → terms → age-gate → signup → verify-email → onboarding

### Commands to Start

```bash
# Start Android dev build
cd client/mobile && npx expo run:android

# Run tests
cd client/mobile && npm test
```

---

## Overview

This document defines the authentication and signup implementation for Ursine Arcana, covering:

1. **Testing infrastructure** (Jest + React Native Testing Library)
2. **Email/Password authentication**
3. **Phone authentication** (mobile-first using `@react-native-firebase/auth`)
4. **User document creation** in Firestore with privacy-conscious schema
5. **Navigation flow** from signup through onboarding

---

## 1. Testing Infrastructure

### 1.1 Strategy

Following Expo's official guidance and industry best practices:

- **Framework**: Jest with `jest-expo` preset
- **Component testing**: `@testing-library/react-native`
- **Structure**: Co-located `__tests__` directories (Expo recommended pattern)
- **Coverage target**: 100% for auth-critical paths

### 1.2 Folder Structure

```
client/mobile/
├── __tests__/                    # Root-level integration tests
│   └── setup/
│       └── jest.setup.ts         # Global mocks and setup
├── app/
│   └── (auth)/
│       └── __tests__/            # Auth screen tests
│           ├── login.test.tsx
│           ├── signup.test.tsx
│           └── age-gate.test.tsx
├── src/
│   ├── context/
│   │   └── __tests__/
│   │       └── AuthContext.test.tsx
│   ├── components/
│   │   └── common/
│   │       └── __tests__/
│   │           └── NeonText.test.tsx
│   └── services/
│       └── __tests__/
│           └── firebase.test.ts
└── package.json                  # Jest config
```

### 1.3 Dependencies to Add

```bash
npx expo install jest-expo @testing-library/react-native @types/jest -- --dev
```

### 1.4 Jest Configuration

Add to `client/mobile/package.json`:

```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["./__tests__/setup/jest.setup.ts"],
    "testMatch": ["**/__tests__/**/*.test.ts?(x)"],
    "collectCoverage": true,
    "collectCoverageFrom": [
      "app/**/*.{ts,tsx}",
      "src/**/*.{ts,tsx}",
      "!**/__tests__/**",
      "!**/node_modules/**"
    ],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|@react-native-masked-view/masked-view|expo-linear-gradient)"
    ]
  }
}
```

### 1.5 Initial Test Targets

| Test File              | Coverage                                             |
| ---------------------- | ---------------------------------------------------- |
| `login.test.tsx`       | Tab switching, form validation, login button states  |
| `signup.test.tsx`      | Form validation, terms checkbox, age gate navigation |
| `AuthContext.test.tsx` | Sign in, sign up, sign out, auth state persistence   |

---

## 2. Authentication Methods

### 2.1 Email/Password

**Firebase method**: `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`

**Flow**:

1. User enters email + password on signup screen
2. Call `createUserWithEmailAndPassword(auth, email, password)`
3. On success, create user document in Firestore
4. Navigate to onboarding

**Validation**:

- Email: valid format
- Password: minimum 8 characters, at least one number and one letter

### 2.2 Phone Authentication (Mobile-First)

**Library**: `@react-native-firebase/auth` (recommended for Expo with custom dev client)

**Why this approach**:

- Native phone auth on iOS/Android (no visible reCAPTCHA)
- Automatic SMS verification on Android
- Works with Expo via config plugin

**Dependencies to add**:

```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth
```

**Expo config** (`app.json`):

```json
{
  "expo": {
    "plugins": ["@react-native-firebase/app", "@react-native-firebase/auth"]
  }
}
```

#### 2.2.1 Phone + Password Registration

**Important**: Phone users must also provide a password. This ensures:

- Users can recover their account if they change phone numbers
- Consistent authentication across email and phone users
- Password can be used as secondary verification

**Registration Flow**:

1. User enters phone number + password on login screen (phone tab)
2. Navigate to terms → age-gate → signup flow (same as email)
3. On signup screen, phone number is pre-filled (read-only)
4. Call `signInWithPhoneNumber(auth, phoneNumber)` to send OTP
5. User enters OTP code on verify screen
6. Call `confirmation.confirm(code)` to verify phone
7. Link email credential for password: `linkWithCredential(user, EmailAuthProvider.credential(generatedEmail, password))`
   - Generate a placeholder email: `{uid}@phone.ursinearcana.app`
8. Create user document with `phone` field set, `email` as null
9. Navigate to onboarding

**Login Flow** (existing phone user):

1. User enters phone number + password
2. Send OTP via `signInWithPhoneNumber`
3. User enters OTP code
4. Verify with `confirmation.confirm(code)`
5. Validate password matches stored credential
6. Navigate to home

**Data Storage**:

```typescript
// User document for phone registration
{
  uid: string;
  email: null; // No real email
  phone: '+27821234567'; // Verified phone number
  authMethod: 'phone'; // Track primary auth method
  hasPassword: true; // Password is set
  // ... rest of profile
}
```

**Important notes**:

- Requires **custom development build** (not Expo Go) for native phone auth
- For testing, use Firebase Console's test phone numbers
- Inform users about SMS charges (legal requirement)
- Password is required for all users (phone or email)

### 2.3 Google Sign-In

Already implemented in `login.tsx` using `expo-auth-session`.

---

## 3. User Document Schema

### 3.1 Privacy & Security Review

The existing `UserProfile` type in `packages/shared/src/types/user.ts` is **well-designed** for privacy:

✅ **POPIA/GDPR compliant**:

- Explicit consent tracking (`UserConsents` interface)
- Separate timestamps for each consent type
- Analytics opt-out option

✅ **Minimal data collection**:

- Only essential fields required
- Optional fields clearly marked as nullable

✅ **Security considerations**:

- `accountStatus` for moderation
- No sensitive data stored in plain text
- Location is opt-in with explicit consent

### 3.2 Signup Document (Minimal Initial)

When a user first signs up, create a **minimal document** that gets expanded during onboarding:

```typescript
interface InitialUserDocument {
  // Required at signup
  uid: string;
  email: string | null; // null if phone-only signup
  phone: string | null; // null if email-only signup
  authMethod: 'email' | 'phone'; // Primary auth method used
  hasPassword: boolean; // Always true (required for all users)
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Set during age verification
  dateOfBirth: Timestamp;
  ageVerifiedAt: Timestamp;

  // Consents (set during terms acceptance)
  consents: {
    termsAcceptedAt: Timestamp;
    privacyAcceptedAt: Timestamp;
    specialPersonalInfoConsentAt: null; // Set later in onboarding
    locationConsentAt: null; // Set later in onboarding
    analyticsOptOut: false;
  };

  // Defaults
  displayName: ''; // Set in onboarding
  bio: '';
  species: 'bear'; // Default, changed in onboarding
  customSpecies: null;
  profileImageUrl: null;
  galleryImageUrls: [];
  tribes: [];
  lookingFor: [];
  position: null;
  tags: [];
  locationEnabled: false;
  location: null;
  locationUpdatedAt: null;
  profileVisibility: 'public';
  showDistance: true;
  showOnlineStatus: true;
  isOnline: true;
  lastActiveAt: Timestamp;
  accountStatus: 'active';
}
```

### 3.3 Security Rules

Existing rules in `server/rules/firestore.rules` are **already appropriate**:

- Users can only create/update their own profile
- Block checking prevents access to blocked users' profiles
- Admin/moderator roles for moderation
- No deletion except by admin

**No changes needed** to security rules for signup flow.

---

## 4. Navigation Flow

### 4.1 Sign Up Path (Grindr-style)

```
(auth)/login
    ↓ [Tap "Sign Up"]
(auth)/terms
    ↓ [Accept Terms & Privacy Policy]
(auth)/age-gate
    ↓ [Enter DOB: DD/MM/YYYY, verify 18+]
(auth)/signup
    ↓ [Email, Password, Confirm Password, DOB (read-only from age-gate)]
    ↓ [Create Account button OR Continue with Google]
(auth)/verify-email
    ↓ [Enter 6-digit code sent to email, 24hr expiry]
(onboarding)/profile-setup
    ↓ [Set display name, species, bio]
(onboarding)/special-consent  [POPIA]
    ↓ [Consent to special personal info]
(onboarding)/location-permission
    ↓ [Optional location consent]
(main)/feed
```

### 4.2 Login Path (Existing User)

```
(auth)/login
    ↓ [Email tab: email + password]
    ↓ [Phone tab: phone number → OTP code]
    ↓ [Or: Continue with Google]
(main)/feed
```

### 4.3 Email Verification Details

- **Method**: 6-digit numeric code sent via Firebase email
- **Code expiry**: 24 hours
- **Resend**: Allow resend after 60 seconds cooldown
- **Unverified users**: Cannot access main app until verified
- **Re-login behavior**: If unverified user logs in, redirect to verify-email screen (can request new code)
- **Account cleanup**: Scheduled Cloud Function deletes unverified accounts older than 24 hours
- **Implementation**: Use Firebase Cloud Functions to generate/validate codes and cleanup

### 4.4 Phone Login (Not Signup Verification)

- Phone auth is for **login only** (existing users or new users who prefer phone)
- Uses `@react-native-firebase/auth` with native SMS
- **Development**: Use Firebase test phone numbers (no SMS cost)
- **Production**: Real SMS via Firebase (~$0.01-0.06 per message)

### 4.5 Auth State Persistence

- Use Firebase's built-in persistence (default: local storage)
- On app launch, check `onAuthStateChanged`
- If authenticated user exists:
  - Check `emailVerified` flag → redirect to verify-email if false
  - Check user document completeness → redirect to onboarding if incomplete
  - Otherwise → main app
- If not authenticated → login screen

---

## 5. Implementation Plan

### Phase 1: Testing Setup ✅

- [x] Install Jest dependencies (`jest-expo`, `@testing-library/react-native`)
- [x] Configure Jest in `package.json`
- [x] Create `__tests__/setup/jest.setup.ts` with mocks
- [x] Create initial `login.test.tsx` (14 tests passing)
- [x] Verify tests run with `npm test`

### Phase 2: Custom Dev Build Setup 🔄

- [x] Run `npx expo prebuild` to generate native projects
- [x] Install `@react-native-firebase/app` and `@react-native-firebase/auth`
- [x] Configure Expo plugins in `app.json`
- [x] Download `google-services.json` from Firebase Console (Android)
- [x] Download `GoogleService-Info.plist` from Firebase Console (iOS)
- [x] Configure `googleServicesFile` paths in `app.json`
- [x] Android custom dev build working ✅
- [ ] iOS build (blocked - requires Apple Developer $99/yr)
- [ ] Add Firebase test phone numbers in console
- [ ] Enable Email/Password auth in Firebase Console
- [ ] Enable Phone auth in Firebase Console

### Phase 3: Sign Up Path Routing

- [ ] Create `(auth)/terms.tsx` screen (scrollable T&Cs, Accept button)
- [ ] Update `(auth)/age-gate.tsx` to Grindr-style (DD/MM/YYYY inputs)
- [ ] Create `(auth)/signup.tsx` screen (email, password, confirm, DOB read-only)
- [ ] Create `(auth)/verify-email.tsx` screen (6-digit code input)
- [ ] Wire navigation: login → terms → age-gate → signup → verify-email

### Phase 4: Email/Password Signup & Verification

- [ ] Implement signup form with validation
- [ ] Wire to `createUserWithEmailAndPassword`
- [ ] Create Cloud Function to generate/send verification code
- [ ] Create Cloud Function to validate verification code
- [ ] Create initial user document in Firestore
- [ ] Handle 24hr expiry and resend logic
- [ ] Navigate to onboarding on successful verification

### Phase 5: Phone Login (Login Screen Only)

- [ ] Add `react-native-phone-number-input` for country code picker
- [ ] Create OTP input component for phone verification
- [ ] Wire phone tab to `signInWithPhoneNumber`
- [ ] Handle existing user (→ main app) vs new user (→ onboarding)
- [ ] Test with Firebase test phone numbers

### Phase 6: Auth State & Guards

- [ ] Update `AuthContext` with comprehensive auth state
- [ ] Add navigation guards (unauthenticated → login)
- [ ] Check `emailVerified` flag (unverified → verify-email)
- [ ] Check profile completeness (incomplete → onboarding)
- [ ] Test persistence across app restarts

---

## 6. Decisions Made

| Question            | Decision                            | Rationale                                                  |
| ------------------- | ----------------------------------- | ---------------------------------------------------------- |
| Custom dev builds   | ✅ Yes, implement now               | Required for production anyway; dev workflow stays similar |
| Country code picker | `react-native-phone-number-input`   | Industry standard, used by Grindr/Barq                     |
| Email verification  | 6-digit code via email, 24hr expiry | Saves SMS quota; phone auth for login only                 |
| Phone auth purpose  | Login only, not signup verification | Conserves SMS budget during development                    |

## 7. Development Notes

### Testing Phone Auth Without SMS Costs

1. **Firebase Console** → Authentication → Sign-in method → Phone
2. Add test phone numbers (e.g., `+27 82 555 1234` with code `123456`)
3. These work exactly like real phone auth but don't send SMS
4. Use for all development and automated testing

### Custom Dev Build Workflow

After initial setup, daily workflow remains similar:

```bash
# First time only
npx expo prebuild
npx expo run:ios  # or run:android

# Daily development (same as before)
npx expo start
# Connect via custom dev app instead of Expo Go
```

Hot reload, debugging, and all Expo features continue to work.

---

## 8. References

- [Expo Unit Testing Guide](https://docs.expo.dev/develop/unit-testing/)
- [React Native Firebase Phone Auth](https://rnfirebase.io/auth/phone-auth)
- [Firebase Phone Auth (Web)](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Privacy & Security](https://firebase.google.com/support/privacy)
- [POPIA Compliance](https://popia.co.za/)

---

_This document will be updated as implementation progresses._
