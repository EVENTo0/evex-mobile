# EVEX Mobile - Production Android Build Checklist

## ✅ Completed
- [x] EAS CLI installed (v20.5.1)
- [x] `eas.json` configured for production (app-bundle, autoIncrement, channel: production)
- [x] `app.json` updated with `owner`, `versionCode`, `googleServicesFile` field
- [x] `.gitignore` updated to protect credentials
- [x] `credentials/` directory created for service account

---

## 🔴 BLOCKING - Must Complete Before Build

### 1. Expo/EAS Account Setup
- [ ] **Login to Expo**: Run `eas login` with EVENTo0 account
- [ ] **Link Project**: Run `eas build:configure` to get `projectId`
- [ ] **Update `app.json`**: Set `extra.eas.projectId` with the value from above
- [ ] **Verify owner**: Confirm `"owner": "evento0"` matches your Expo account username

### 2. Android Signing (Keystore)
- [ ] **Option A (Recommended)**: Let EAS manage credentials automatically
  - On first `eas build --platform android --profile production`, EAS will generate and store the keystore
- [ ] **Option B (Self-managed)**: Provide your own keystore
  - Generate: `keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -storepass <pass> -keypass <pass> -alias evex -keystore evex-upload.jks`
  - Run: `eas credentials` → Android → Production → Upload keystore

### 3. Google Services / Firebase
- [ ] **Create Firebase project** at https://console.firebase.google.com
- [ ] **Register Android app** with package name `com.evento.evex`
- [ ] **Download `google-services.json`** and place in project root
- [ ] This file is required for AdMob and any Firebase services

### 4. Google AdMob
- [ ] **Register app on AdMob**: https://admob.google.com
- [ ] **Get real Android App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)
- [ ] **Update `app.json`** plugin config: replace placeholder `androidAppId`

### 5. Google Play Console - Service Account
- [ ] **Create service account** in Google Cloud Console with "Service Account User" role
- [ ] **Grant access** in Google Play Console → Setup → API access → link the service account
- [ ] **Download JSON key** and save as `credentials/play-store-service-account.json`
- [ ] Required for automated `eas submit` to Play Store

### 6. App Assets
- [ ] **`assets/icon.png`** — 1024x1024px app icon
- [ ] **`assets/adaptive-icon.png`** — 1024x1024px foreground for Android adaptive icon
- [ ] **`assets/splash-icon.png`** — splash screen image (recommended 1284x2778px)
- [ ] **`assets/favicon.png`** — 32x32px or 48x48px for web

---

## 🟡 RECOMMENDED - Before Play Store Submission

### 7. Play Store Listing
- [ ] Create app in Google Play Console
- [ ] Set up internal testing track
- [ ] Fill store listing (title, description, screenshots) — see `STORE_LISTING.md`
- [ ] Upload privacy policy URL — see `PRIVACY_POLICY.md`
- [ ] Set content rating
- [ ] Set target audience and content

### 8. Environment Variables
- [ ] Set production API URLs in EAS secrets:
  ```
  eas secret:create --name EXPO_PUBLIC_LAB_API_URL --value <url>
  eas secret:create --name EXPO_PUBLIC_FIT_API_URL --value <url>
  eas secret:create --name EXPO_PUBLIC_COACH_API_URL --value <url>
  eas secret:create --name EXPO_PUBLIC_AUTH_API_URL --value <url>
  ```

### 9. App Signing (Play Store)
- [ ] Enroll in Google Play App Signing (automatic for new apps)
- [ ] Upload app signing key to Play Console (or let Google manage it)

---

## 🚀 Build Commands

```bash
# Login
eas login

# Configure (links project)
eas build:configure

# Build production AAB
eas build --platform android --profile production

# Submit to Play Store (internal track)
eas submit --platform android --profile production
```

---

## 📝 Notes
- Package name: `com.evento.evex`
- Default language: Arabic (RTL)
- Minimum EAS CLI: >= 13.0.0
- Build type: app-bundle (AAB) for production
- Submit track: internal (draft)
- versionCode auto-increments via EAS remote
