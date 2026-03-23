# Hydration Hero – Summary of Changes

## Key Architecture Notes
- **Stack**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- **Native Layer**: Capacitor v6 (Android target), AdMob via `@capacitor-community/admob`
- **App ID**: `com.hydrationhero.app`
- **App Name**: `Hydration Hero: Water Tracker`
- **Revenue**: Google AdMob banner/interstitial + cordova-plugin-purchase v13 (Google Play IAP)
- **Storage**: All user data in `localStorage` (no backend/cloud sync)
- **Notifications**: `@capacitor/local-notifications` — entirely local, no push server

---

## Session: March 23, 2026 — Privacy Policy Hosted on GitHub Pages

### What was discussed
- User needed a privacy policy URL to link in their Google Play Store listing and Apple App Store listing.
- Decided to host it on GitHub Pages using the existing `sid-sys/hydration-hero` repository rather than creating a new repo.

### Decisions made
- **No separate repo**: Created a `docs/` folder in the existing `hydration-hero` repo. GitHub Pages can be enabled from `main` branch, `/docs` folder — zero extra setup.
- **Standalone HTML**: Privacy policy is a pure HTML + CSS page (no build step, no dependencies), so it works reliably on GitHub Pages with no CI needed.
- **Dark theme**: Matches the app's blue/dark aesthetic for brand consistency.
- **Honest policy**: Policy accurately describes that all data is local-only, AdMob collects ad data, and local notifications are used.

### Files created
| File | Purpose |
|------|---------|
| `docs/privacy-policy.html` | Full privacy policy page |
| `docs/index.html` | Redirect landing for the GitHub Pages root |

### Final URL (after GitHub Pages is enabled)
```
https://sid-sys.github.io/hydration-hero/privacy-policy.html
```

### Next step required (manual)
Go to **GitHub → hydration-hero repo → Settings → Pages** and set:
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

---

## Previous Sessions

### March 14, 2026 — Native Android Build & Production Readiness
- Set up Capacitor Android project, AdMob production IDs, and IAP via cordova-plugin-purchase v13
- Implemented branded splash screen, full reset flow, and premium preservation on reset
- Added 5-minute drink cooldown, blue theme, streak analytics, and Water Logger

### March 13, 2026 — Initial Feature Build
- Built core hydration tracking UI (home, streaks, settings)
- Added notification snooze/drink actions, paywall stub, AdMob stub
- Removed all Lovable-specific cloud dependencies
