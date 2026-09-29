# FixIt

FixIt is a production-structured Expo native application for discovering and booking trusted home-service professionals. It includes a complete mock customer journey, local artwork, simulated technician tracking, and checked-in Android and iOS projects.

## Requirements

- Node.js 22.13 or newer
- npm
- Android Studio with Android SDK 36 and JDK 17
- Xcode and CocoaPods for iOS development

The project uses Expo SDK 57 and React Native 0.86.3. Use the committed `package-lock.json`; do not install Expo packages at arbitrary versions.

## Setup

```sh
npm install
cp .env.example .env
```

Start the Expo development server:

```sh
npm start
```

Build and launch a native development app:

```sh
npm run android
npm run ios
```

For iOS, install pods after the initial clone and whenever native dependencies change:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

The Android Gradle wrapper uses `downloads.gradle.org` with a two-minute connection timeout to tolerate slower first-time downloads.

## Demo authentication

Enter a valid 10-digit Indian mobile number and tap **Continue** to open the verification screen. Any six-digit code is accepted and continues to Home.

Authentication is explicitly labeled as a demo in the UI. Session tokens are stored with Expo SecureStore and are never logged or placed in AsyncStorage.

## Environment

Copy `.env.example` to `.env` and configure these public values:

```text
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_MOCK_MODE=true
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY=
```

`EXPO_PUBLIC_MOCK_MODE=true` uses the bundled service implementations and fixtures. Map keys are optional: tracking shows a polished route fallback when credentials are absent, and all tracking remains visibly marked as simulated.

Public Expo variables are embedded in the client bundle. Never put secrets, private API keys, signing credentials, or server tokens in them.

## Architecture

```text
app/                   Expo Router route files and navigation layouts
src/components/        Reusable atoms, molecules, organisms, and templates
src/features/          Feature screens grouped by customer journey
src/hooks/             React Query keys and typed data hooks
src/mocks/             Centralized mock fixture data
src/providers/         Application and query providers
src/services/          Service contracts, mock implementations, and Axios client
src/store/             Zustand auth, booking draft, and preference stores
src/theme/             Design tokens and shared component styling
src/types/             Shared domain models
src/utils/             Validation, formatting, and calculations
assets/                Bundled icon, splash, and original technician artwork
android/ and ios/      Retained Expo-enabled native projects
```

Expo Router owns navigation and typed parameters. React Query owns server-shaped catalog, booking, notification, and tracking data. Zustand is limited to the persisted session shell, booking draft, and non-sensitive UI preferences. React Hook Form and Zod handle form state and validation.

Changing an earlier booking choice clears incompatible downstream choices. Logout removes secure credentials, clears the booking draft, and removes user-scoped query data.

## Mock services and backend migration

The app exposes replaceable `AuthService`, `CatalogService`, `BookingService`, `NotificationService`, and `TrackingService` contracts in `src/services/contracts.ts`. Mock implementations add simulated latency but return the same typed values expected from a backend.

To connect a backend:

1. Set `EXPO_PUBLIC_MOCK_MODE=false` and configure `EXPO_PUBLIC_API_URL`.
2. Implement each contract using the shared Axios client in `src/services/api/client.ts`.
3. Preserve the domain return types and normalized `AppError` shape.
4. Keep token access in `src/services/storage.ts`; do not log authorization headers or tokens.
5. Replace tracking snapshots with the real provider while retaining the offline and permission-denied fallback states.

Payment, calls, and messages are intentionally simulated or delegated to explicit device actions. No real charge or automatic communication occurs.

## Quality checks

```sh
npm run typecheck
npm run lint
npm run format
npm test -- --runInBand
npm run doctor
```

Native verification commands:

```sh
cd android && NODE_ENV=development ./gradlew :app:assembleDebug --no-daemon
cd ios && bundle exec pod install
```

Tests cover validation, API error normalization, mock authentication, and booking-draft invalidation. The application also includes recoverable loading, error, empty, offline-style fallback, and missing-map-key states.

## Assets

The technician hero is original, locally bundled artwork created for FixIt. Raster imagery is rendered with Expo Image, while interface icons use Lucide React Native. App icon and splash assets are local and require no runtime network access.

## App behavior

- Portrait-first layouts remain usable on larger phones and tablets.
- English, INR pricing, one service region, and one demo customer are used for this proof of concept.
- The native application identifier remains `com.fixit`.
- Location and map credentials are optional and never block booking.
- Tracking progress, ETA, and technician movement are simulations in mock mode.
