# Welcome & Login Flow - Planning

## Overview

This document defines the new entry experience for the Ursine Arcana mobile app, replacing the existing age-gate-first flow with a branded splash and Grindr-style welcome/login screen.

New high-level flow:

1. **App Launch**
   - Show a full-screen **splash logo** for ~3 seconds.
   - No age gate on app open.
2. **Welcome / Login Screen**
   - Superlist / Grindr-inspired layout.
   - Logo at top, login form in the middle, Google button below.
   - Top-right **Sign Up** link.
3. **Sign Up Flow**
   - Tap **Sign Up** on welcome screen.
   - Navigate to **Terms & Conditions** screen.
   - After Accept, navigate to **Age Verification** screen.
   - On success, continue to signup/onboarding.

Age verification is now part of the **signup path**, not the initial app launch.

---

## Requirements

### 1. Splash Screen

- **Name/Route**: `splash` (e.g. `app/splash.tsx`, or Expo Router initial route).
- **Content**:
  - Full-screen background using app primary background color.
  - Centered **Ursine Arcana logo**.
  - Optional future animation (fade/scale) but initially static.
- **Behavior**:
  - Display for approximately **3 seconds**.
  - After timeout, navigate to the **Welcome/Login** screen.
  - If the user is already authenticated, we may later short-circuit directly to the main app instead of login.

### 2. Welcome / Login Screen

- **Name/Route**: `(auth)/login`.
- **Entry**:
  - Navigated to automatically from `splash` after 3s.
  - Can also be navigated to via back navigation from other auth screens (signup, forgot password, etc.).

#### 2.1 Layout (Grindr-inspired)

- **Top area**:
  - App background color (dark theme).
  - **Logo at the top**, centered horizontally.
  - In the **top-right corner**, a tappable text: **"Sign Up"**.

- **Middle section**:
  - Title / copy:
    - Main line: **"Welcome to your kink"**.
    - Supporting line: **"Sign in to join the pack."**
  - Underneath, a **tabbed selector** to choose between:
    - `Email`
    - `Phone`

- **Form area** (depends on active tab):
  - **Email tab** selected:
    - Input: **Email**
    - Input: **Password** (secure)

  - **Phone tab** selected:
    - Input: **Phone number**
    - (Later: this will wire into phone verification; for now it can be a placeholder.)

- **Primary CTA**:
  - Large button labeled **"Log in"**.
  - Full-width within a max-width container (~360–400 px) and centered on web.

- **Secondary links/buttons** (below primary CTA):
  - Text link: **"Forgot password?"**
    - Typically right-aligned or centered under the Login button.
  - **Google sign-in button** with proper styling:
    - White background.
    - Google "G" icon on the left.
    - Text: **"Continue with Google"**.
    - Uses existing Google Firebase Auth integration.

- **Web vs Mobile**:
  - Same component used for both.
  - On web, content constrained to a `maxWidth` (e.g. 400 px) and horizontally centered.
  - On mobile, content should feel natural on common device widths (no cramping at the edges).

### 3. Sign Up Entry (Top-right "Sign Up")

- **Location**:
  - Top-right corner of the Welcome/Login screen.
- **Behavior** when tapped:
  1. Navigate to **Terms & Conditions** screen.
  2. After scrolling/reading, user taps an **"Accept"** button.
  3. Navigate to **Age Verification** screen (existing age-gate logic reused).
  4. On successful age verification, continue to the **Signup** flow (existing `(auth)/signup` screen and onboarding).

- **Notes**:
  - Age gate should not appear on app launch anymore; it is explicitly part of the signup path.
  - Terms & Conditions screen should clearly indicate that the app is for adults (18+) and link to full legal documents.

### 4. Terms & Conditions Screen

- **Name/Route**: e.g. `(auth)/terms`.
- **Content**:
  - App logo or title.
  - Scrollable legal text (placeholder to be replaced with real T&Cs).
  - Checkbox or clear statement acknowledging consent.
- **Actions**:
  - **Back**: returns to Welcome/Login screen.
  - **Accept**: navigates to Age Verification.

### 5. Age Verification Screen

- **Name/Route**: reuse existing `(auth)/age-gate`.
- **Behavior changes**:
  - No longer the initial route when the app launches.
  - Only reached by tapping **Sign Up → Accept T&Cs**.
  - On success, navigates to `(auth)/signup` to continue registration.

---

## Design Details

### Visual Style

- **Background**:
  - Use existing `bg-background-primary` dark background.
- **Text colors**:
  - Primary: `text-text-primary`.
  - Secondary: `text-text-secondary`.
- **Buttons**:
  - Primary login: `bg-accent-500`, white text.
  - Google: light/white background with dark text and Google icon.
  - Tabs: likely using background + border changes to indicate active tab.
- **Typography**:
  - Title: bold, ~20–24pt.
  - Body copy: 14–16pt.

### Interaction

- Tabs should visually indicate the active mode (Email vs Phone).
- Login button should show a loading state when an auth request is in progress.
- Validation and error messages should be minimal but clear (e.g. invalid email, missing fields).

---

## Implementation Plan

1. **Routing & Flow**
   - [ ] Configure `splash` as the initial route.
   - [ ] Implement 3-second timeout on `splash` to navigate to `(auth)/login`.
   - [ ] Ensure existing auth state (if user is already logged in) can later bypass login.

2. **Welcome/Login Screen**
   - [x] Apply Superlist-style centered layout with logo, tagline, and Google button.
   - [ ] Add Email/Phone tabs and input fields.
   - [ ] Add primary "Log in" button behavior for Email.
   - [ ] Decide temporary behavior for Phone login (placeholder vs implementation).
   - [x] Constrain content width on web via `maxWidth` and center horizontally.

3. **Sign Up Path**
   - [ ] Add top-right "Sign Up" action on the login screen.
   - [ ] Implement `(auth)/terms` screen.
   - [ ] Wire Terms → Age Gate → Signup navigation.
   - [ ] Update age gate usage to ensure it is not the initial screen.

4. **Testing**
   - [ ] Test on Expo web.
   - [ ] Test on Android emulator.
   - [ ] Test on physical device via Expo Go.

---

## Open Questions / Future Enhancements

- Exact copy and legal text for Terms & Conditions.
- Final copy for Age Verification screen (POPIA/GDPR specific wording).
- Animation details for the splash logo (fade, scale, or both).
- Whether Phone login should be implemented in MVP or deferred.
