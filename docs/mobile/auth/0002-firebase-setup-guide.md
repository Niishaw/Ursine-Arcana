# Firebase Native Setup Guide

> **Created**: 2025-12-04  
> **Status**: Action Required  
> **Purpose**: Steps to configure React Native Firebase for phone authentication

---

## Overview

To use `@react-native-firebase/auth` for native phone authentication, you need to download Firebase config files from the Firebase Console and place them in your project.

---

## Required Files

| Platform | File                       | Location                              |
| -------- | -------------------------- | ------------------------------------- |
| Android  | `google-services.json`     | `client/mobile/` (root of mobile app) |
| iOS      | `GoogleService-Info.plist` | `client/mobile/` (root of mobile app) |

---

## Step-by-Step Instructions

### 1. Download Android Config (`google-services.json`)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ursine-arcana**
3. Click the **gear icon** (Settings) → **Project settings**
4. Scroll down to **Your apps**
5. If no Android app exists:
   - Click **Add app** → **Android**
   - Package name: `com.ursinearcana.app`
   - Register app
6. Click **Download google-services.json**
7. Place the file in: `client/mobile/google-services.json`

### 2. Download iOS Config (`GoogleService-Info.plist`)

1. In Firebase Console → Project settings → Your apps
2. If no iOS app exists:
   - Click **Add app** → **iOS**
   - Bundle ID: `com.ursinearcana.app`
   - Register app
3. Click **Download GoogleService-Info.plist**
4. Place the file in: `client/mobile/GoogleService-Info.plist`

### 3. Enable Phone Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Phone** → **Enable** → **Save**
3. (Optional) Add test phone numbers:
   - Click **Phone numbers for testing**
   - Add: `+27 82 555 1234` with code `123456`
   - These won't send real SMS and are free to use

### 4. Enable Email/Password Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Email/Password** → **Enable** → **Save**

---

## After Adding Config Files

Once you've added both files, run:

```bash
cd client/mobile

# Generate native projects
npx expo prebuild

# Build for iOS (Mac only)
npx expo run:ios

# Build for Android
npx expo run:android
```

---

## Verification Checklist

- [ ] `google-services.json` exists in `client/mobile/`
- [ ] `GoogleService-Info.plist` exists in `client/mobile/`
- [ ] Phone authentication enabled in Firebase Console
- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Test phone numbers added (optional but recommended)

---

## Troubleshooting

### "No Firebase App" Error

- Ensure config files are in the correct location
- Run `npx expo prebuild --clean` to regenerate native projects

### Phone Auth Not Working

- Verify Phone sign-in is enabled in Firebase Console
- Check that your app's SHA-1 fingerprint is registered (Android)
- Ensure bundle ID matches exactly (iOS)

### Build Fails

- Delete `ios/` and `android/` folders
- Run `npx expo prebuild` again

---

## Security Note

**Do NOT commit** `google-services.json` or `GoogleService-Info.plist` to public repositories. They contain API keys.

Add to `.gitignore`:

```
google-services.json
GoogleService-Info.plist
```

For team sharing, use secure methods (encrypted storage, team password manager, etc.)

---

_This guide is part of the Ursine Arcana authentication setup._
