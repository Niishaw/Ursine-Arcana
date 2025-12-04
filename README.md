# Ursine Arcana

A mobile social/hookup app for the furry, pup-play, and fetish communities. All users must be consenting adults (18+).

> 📚 **Full Documentation**: See [docs/index.md](./docs/index.md) for the complete project documentation index.

## Project Structure

```
ursine-arcana/
├── client/                     # Frontend applications
│   ├── mobile/                 # React Native (Expo) app
│   │   ├── app/                # Expo Router screens
│   │   └── src/
│   │       ├── components/     # UI components
│   │       ├── context/        # React Context providers
│   │       └── services/       # Firebase, API services
│   │
│   └── admin/                  # React web admin dashboard
│
├── server/                     # Backend services
│   ├── functions/              # Firebase Cloud Functions
│   │   └── src/
│   │       ├── api/            # HTTP callable functions
│   │       ├── triggers/       # Auth & Firestore triggers
│   │       └── scheduled/      # Cron jobs
│   │
│   └── rules/                  # Security rules
│       ├── firestore.rules
│       ├── storage.rules
│       └── firestore.indexes.json
│
├── packages/
│   └── shared/                 # Shared TypeScript types & utilities
│
├── docs/                       # Project documentation
│   ├── index.md                # Documentation index
│   ├── architecture/           # ADRs and system design
│   ├── mobile/                 # Mobile app docs
│   ├── admin/                  # Admin dashboard docs
│   └── api/                    # API docs
│
└── firebase.json               # Firebase configuration
```

## Technology Stack

- **Frontend**: React Native (Expo) with TypeScript
- **Backend**: Node.js on Firebase Functions
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Auth**: Firebase Authentication (Email, Phone)
- **Styling**: Tailwind CSS v4.0 via NativeWind
- **Push Notifications**: Firebase Cloud Messaging

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ursine-arcana
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build shared package**

   ```bash
   npm run build:shared
   ```

4. **Set up Firebase**

   ```bash
   firebase login
   firebase use --add
   ```

5. **Configure environment variables**

   Copy the example env file and fill in your Firebase credentials:

   ```bash
   cp .env.example client/mobile/.env
   ```

   See [docs/index.md](./docs/index.md#environment-setup) for required variables.

### Development

**Start the mobile app:**

```bash
npm run dev:mobile
```

**Start Firebase emulators:**

```bash
npm run firebase:emulators
```

**Build functions:**

```bash
npm run build:functions
```

## MVP Features

- User profiles with species, roles, tribes, and tags
- Location-based discovery (opt-in, Grindr-style grid)
- Real-time chat (text + images)
- Push notifications
- User blocking and hiding
- Reporting system
- 18+ age verification
- POPIA-compliant consent flows

## Security & Compliance

- **Age Verification**: Self-declaration (18+) at registration
- **POPIA Compliance**: Explicit consent for "special personal information"
- **Content Policy**: SFW profile images, NSFW allowed in private chats
- **Data Retention**: Inactive accounts deleted after 2 years

## Documentation

See [docs/index.md](./docs/index.md) for the complete documentation index, including:

- **Architecture Decisions** (`docs/architecture/`) - ADRs for key technical decisions
- **Mobile App Docs** (`docs/mobile/`) - Feature documentation for the mobile app
- **Admin Docs** (`docs/admin/`) - Admin dashboard documentation
- **API Docs** (`docs/api/`) - Cloud Functions and API documentation

## Target Regions

- **Phase 1**: South Africa
- **Phase 2**: European Union, United States

## License

Private - All rights reserved.

---

**Note**: This app handles adult content. All users must be 18+ and provide explicit consent.
