# Ursine Arcana - Documentation Index

> **Last Updated**: 2025-12-05  
> **Project Status**: Phase 2 - Authentication In Progress 🔄  
> **Current Focus**: Signup Flow Implementation

---

## 📋 Project Overview

**Ursine Arcana** is a mobile social/hookup app for the furry, pup-play, and fetish communities. All users must be consenting adults (18+).

### Target Regions

- **Phase 1**: South Africa (POPIA compliance)
- **Phase 2**: European Union (GDPR), United States

### Core Features (MVP)

- [ ] User authentication (email, phone)
- [ ] Profile management with species, tribes, tags
- [ ] Location-based discovery (Grindr-style grid)
- [ ] Real-time chat (text + images)
- [ ] User blocking, hiding, and reporting
- [ ] Push notifications
- [ ] Admin moderation dashboard

---

## 🗂️ Project Structure

```
ursine-arcana/
├── client/                    # Frontend applications
│   ├── mobile/                # React Native (Expo SDK 54) app
│   └── admin/                 # React web admin dashboard (pending)
│
├── server/                    # Backend services
│   ├── functions/             # Firebase Cloud Functions
│   └── rules/                 # Firestore & Storage security rules
│
├── packages/
│   └── shared/                # Shared TypeScript types & utilities
│
└── docs/                      # Documentation
    ├── index.md               # This file - master index
    ├── architecture/          # ADRs and system design
    ├── mobile/                # Mobile app feature documentation
    ├── admin/                 # Admin dashboard documentation
    └── api/                   # API & Cloud Functions documentation
```

---

## � Current Progress

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Project structure setup (client/server separation)
- [x] Architecture Decision Records (ADRs)
- [x] Shared package scaffolding (types, constants, theme, utils)
- [x] Mobile app scaffolding (auth, onboarding, main screens)
- [x] Firebase Functions scaffolding (triggers, API, scheduled)
- [x] Firebase security rules (Firestore, Storage)
- [x] Root configuration files (tsconfig, eslint, prettier)
- [x] Environment configuration (.env setup)
- [x] Firebase project connected (ursine-arcana)
- [x] Expo SDK 54 + React 19 + React Native 0.81
- [x] NativeWind (Tailwind CSS) configured
- [x] Metro bundler configured for Firebase compatibility
- [x] App runs on iOS (Expo Go) and Web

### 🔄 Phase 2: Authentication (IN PROGRESS)

**Completed:**

- [x] Jest testing infrastructure (15 tests passing)
- [x] Install @react-native-firebase/app and @react-native-firebase/auth
- [x] Firebase config files added (google-services.json, GoogleService-Info.plist)
- [x] Android custom dev build working ✅
- [x] Login screen: phone tab now requires password (phone+password registration)
- [x] Auth planning doc updated with phone+password flow
- [ ] iOS build (requires Apple Developer account - $99/year)

**Next:**

- [ ] Enable Firebase Auth providers (Email/Password, Phone) in console
- [ ] Create signup flow screens (terms, age-gate, signup, verify-email)
- [ ] Implement email/password signup with 6-digit verification code
- [ ] Implement phone login (login screen only)
- [ ] Add auth state guards and navigation logic
- [ ] Test auth persistence across app restarts

### 📋 Phase 3: Onboarding (PENDING)

- [ ] Profile Setup screen (display name, bio, species)
- [ ] Special Consent screen (POPIA compliance)
- [ ] Location Permission screen
- [ ] Profile image upload

### 📋 Phase 4: Core Features (PENDING)

- [ ] Feed/Discovery grid with real user data
- [ ] User profile viewing
- [ ] Real-time chat implementation
- [ ] Push notifications setup
- [ ] Block/Hide/Report functionality

### 📋 Phase 5: Admin & Polish (PENDING)

- [ ] Admin dashboard scaffolding
- [ ] Moderation queue
- [ ] Analytics dashboard
- [ ] App store preparation

---

## 🎯 Next Steps (Priority Order)

1. **Firebase Console Setup** (Current)
   - Enable Email/Password authentication
   - Enable Phone authentication
   - Add test phone numbers for development

2. **Signup Flow Implementation**
   - Terms & Conditions screen
   - Age Gate (Grindr-style DD/MM/YYYY)
   - Create Account screen
   - Email verification (6-digit code, 24hr expiry)

3. **Phone Login**
   - Country code picker (react-native-phone-number-input)
   - OTP verification screen
   - Wire to @react-native-firebase/auth

4. **iOS Build** (When ready for release)
   - Requires Apple Developer account ($99/year)
   - EAS Build for TestFlight/App Store

---

## 📚 Documentation Sections

### Architecture Decisions

Location: `docs/architecture/`

| Document                                                                                           | Status      | Description                                         |
| -------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------- |
| [0001-project-naming-jurisdiction-age](./architecture/0001-project-naming-jurisdiction-age.md)     | ✅ Complete | Project naming, SA jurisdiction, 18+ requirement    |
| [0002-technology-stack-languages](./architecture/0002-technology-stack-languages.md)               | ✅ Complete | TypeScript, React Native, Firebase stack            |
| [0003-discovery-model-user-interactions](./architecture/0003-discovery-model-user-interactions.md) | ✅ Complete | Grid discovery, hide/block/report system            |
| [0004-species-roles-tags-taxonomy](./architecture/0004-species-roles-tags-taxonomy.md)             | ✅ Complete | Species, tribes, positions, tags with POPIA consent |
| [0005-branding-placeholders](./architecture/0005-branding-placeholders.md)                         | ✅ Complete | Placeholder branding, amendment process             |

### Mobile App Documentation

Location: `docs/mobile/`

| Document                                                                     | Status         | Description                                 |
| ---------------------------------------------------------------------------- | -------------- | ------------------------------------------- |
| [welcome-login/0001-planning](./mobile/welcome-login/0001-planning.md)       | 🔄 In Progress | Welcome & login screen UI and flow          |
| [auth/0001-planning](./mobile/auth/0001-planning.md)                         | 🔄 In Progress | Authentication, signup, email verification  |
| [auth/0002-firebase-setup-guide](./mobile/auth/0002-firebase-setup-guide.md) | ✅ Complete    | Firebase native config setup guide          |
| [testing/0001-testing-setup](./mobile/testing/0001-testing-setup.md)         | ✅ Active      | Jest testing infrastructure and conventions |

### Admin Dashboard Documentation

Location: `docs/admin/`

| Document          | Status | Description |
| ----------------- | ------ | ----------- |
| _Pending Phase 5_ | -      | -           |

### API Documentation

Location: `docs/api/`

| Document        | Status | Description                       |
| --------------- | ------ | --------------------------------- |
| _To be created_ | -      | Cloud Functions API documentation |

---

## 🔧 Environment Setup

### Current Configuration

**Firebase Project**: `ursine-arcana`

**Client Mobile** (`client/mobile/.env`) - ✅ Configured:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ursine-arcana.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=ursine-arcana
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=ursine-arcana.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=594833798736
EXPO_PUBLIC_FIREBASE_APP_ID=1:594833798736:web:...
```

### Firebase Services Status

| Service        | Status         | Notes                                    |
| -------------- | -------------- | ---------------------------------------- |
| Authentication | ⚠️ Needs Setup | Enable Email/Password & Phone in console |
| Firestore      | ⚠️ Needs Setup | Create database, deploy rules            |
| Storage        | ⚠️ Needs Setup | Deploy rules                             |
| Functions      | ⚠️ Needs Setup | Deploy after testing                     |
| Hosting        | ⏳ Later       | For admin dashboard                      |

### Native Build Status

| Platform | Build Type     | Status     | Notes                             |
| -------- | -------------- | ---------- | --------------------------------- |
| Android  | Custom Dev     | ✅ Working | Runs on emulator via expo run     |
| iOS      | EAS Dev Client | ⏸️ Blocked | Requires Apple Developer ($99/yr) |

---

## 🛠️ Development Commands

```bash
# Start mobile app (Expo Go - limited features)
cd client/mobile && npx expo start

# Run on Android (custom dev build - full Firebase support)
cd client/mobile && npx expo run:android

# Run tests
cd client/mobile && npm test
cd client/mobile && npm run test:watch
cd client/mobile && npm run test:coverage

# Build shared package
npm run build:shared

# EAS Build (iOS physical device)
cd client/mobile && eas build --profile development --platform ios
```

---

## 📝 Documentation Guidelines

When creating new features, follow this pattern:

1. **Create a planning document** in the appropriate folder:
   - `docs/mobile/{feature}/0001-planning.md`
   - `docs/admin/{feature}/0001-planning.md`
   - `docs/api/{feature}/0001-planning.md`

2. **Update this index** to track the new documentation

3. **Document format**:

   ```markdown
   # Feature Name - Planning

   ## Overview

   Brief description of the feature

   ## Requirements

   - Functional requirements
   - Non-functional requirements

   ## Design

   Technical approach and decisions

   ## Implementation Status

   - [ ] Task 1
   - [ ] Task 2
   ```

---

## 🔗 Quick Links

- [README](../README.md) - Project overview and setup instructions
- [Shared Package](../packages/shared/) - Types, constants, utilities
- [Mobile App](../client/mobile/) - React Native Expo app
- [Cloud Functions](../server/functions/) - Firebase backend
- [Security Rules](../server/rules/) - Firestore & Storage rules

---

## 📊 Tech Stack Summary

| Layer            | Technology            | Version |
| ---------------- | --------------------- | ------- |
| Mobile Framework | Expo SDK              | 54      |
| UI Framework     | React Native          | 0.81.5  |
| React            | React                 | 19.1.0  |
| Styling          | NativeWind (Tailwind) | 4.x     |
| Backend          | Firebase              | 10.x    |
| Language         | TypeScript            | 5.x     |
| Package Manager  | npm workspaces        | -       |

---

_This document is the single source of truth for project progress and documentation location._
