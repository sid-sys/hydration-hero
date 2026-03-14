# Hydration Hero - Feature Roadmap

## ✅ Implemented Features
### 1. Advanced Notification Actions (Snooze & Drink)
- **Description**: Users can now snooze notifications for 1 minute or jump directly into the app to log a drink from the notification panel.
- **Implemented**: March 13, 2026

### 2. High-Frequency Reminders
- **Description**: Added a 5-minute reminder interval in both onboarding and settings for intensive hydration sessions.
- **Implemented**: March 13, 2026


### 3. Cooldown Transparency
- **Description**: Added a '?' icon with a tooltip explaining why the "Wait" cooldown exists (optimal absorption/prevent overhydration).
- **Implemented**: March 13, 2026

### 4. Lovable Cleanup
- **Description**: Removed all Lovable-specific cloud code and UI dependencies for a clean, independent build.
- **Implemented**: March 13, 2026

### 5. Diagnostic Notifications
- **Description**: Immediate test notification on drink logging to verify system functionality with specialized "Drink" and "Snooze" actions.
- **Implemented**: March 13, 2026

### 11. Blue Theme Integration
- **Description**: Migrated the entire UI from a green/organic palette to a high-performance blue theme for a more "tech-forward" feel.
- **Implemented**: March 14, 2026

### 12. Dynamic Streak Analytics
- **Description**: The top ring on the Streaks page now dynamically calculates and displays the monthly goal completion percentage.
- **Implemented**: March 14, 2026

### 13. No-Cooldown Drink Button
- **Description**: Removed the 5-minute cooldown and "Why the wait?" tooltip. Users can now log water freely at any time, improving UX flow.
- **Implemented**: March 14, 2026

### 14. Water Logger with Extra Sip Support
- **Description**: Renamed "Recent Activity" to "Water Logger". Shows last 10 entries. Extra sips (beyond daily goal) appear in amber/gold with a ⭐ icon and "Extra Sip +250ml" label.
- **Implemented**: March 14, 2026

### 15. Extra Sip Progress Ring
- **Description**: CircularProgress now shows a second amber/gold arc when the daily goal is exceeded, providing instant visual feedback for over-achievement.
- **Implemented**: March 14, 2026

### 16. Branded Splash Screen
- **Description**: Full-screen animated splash (blue, water drop, app name) appears on every cold start and after a full data reset, lasting 2.2 seconds before showing onboarding or home.
- **Implemented**: March 14, 2026

### 17. Full Reset Flow (Splash → Onboarding)
- **Description**: "Reset All Data" now clears all localStorage (water data + profile), then takes the user through the splash screen and back to onboarding setup.
- **Implemented**: March 14, 2026

### 18. Premium Preservation on Reset
- **Description**: Resetting all data no longer removes premium status. If user has already purchased "Remove Ads", their ad-free status is preserved after a full reset.
- **Implemented**: March 14, 2026

### 19. 5-Minute Drink Cooldown (Clean UX)
- **Description**: Re-added 5-minute cooldown between drinks with a clean countdown label 'Next glass in M:SS'. Removed the old 'Why the wait?' tooltip for a simpler interaction.
- **Implemented**: March 14, 2026

### 20. Real Google Play Billing (cordova-plugin-purchase v13)
- **Description**: Wired the 'Remove Ads — $1.99' button to real Google Play Billing via cordova-plugin-purchase v13. Supports auto-restore on startup and a 'Restore previous purchase' link. Falls back gracefully to simulated purchase in browser/dev mode.
- **Implemented**: March 14, 2026

### 6. Ad Performance Integration (Google AdMob)
- **Description**: Integrated Banner ads (Top) and Interstitial ads (on Action) with production IDs for both Android and iOS. Precise permission handling implemented for Android (POST_NOTIFICATIONS, SCHEDULE_EXACT_ALARM).
- **Implemented**: March 14, 2026

### 7. Paywall & Ad Removal
- **Description**: Logic to unlock "Hero Pro" status, removing all ads and unlocking premium UI visibility.
- **Implemented**: March 13, 2026

### 8. Production Identity & Store Readiness
- **Description**: Configured production App Name ("Hydration Hero: Water Tracker"), package IDs, and live AdMob Unit IDs.
- **Implemented**: March 14, 2026

### 9. Premium Streaks UI Overhaul
- **Description**: Replaced basic calendar with a premium "On Fire" theme, featuring a large central streak ring and a custom fire-row calendar.
- **Implemented**: March 14, 2026

### 10. Refined Notification UX
- **Description**: Increased snooze duration to 5 minutes and switched from "log-triggered" to "frequency-triggered" notifications for a better user experience.
- **Implemented**: March 14, 2026



---

## 🚀 Suggested Features (Production Ready)

### 1. Apple Health & Google Fit Sync
- **Description**: Automatically sync hydration data with system health apps to give users a unified view of their wellness.
- **Benefit**: Increases app utility and professional standing in the health category.

### 2. Hydration Analytics Pro
- **Description**: Advanced charts showing intake trends, peak hydration hours, and monthly progress heatmaps.
- **Benefit**: Provides actionable insights that keep users engaged long-term.

### 3. Multi-Device Cloud Sync (Supabase)
- **Description**: Allow users to create an account to sync their "Garden" and streaks across Android, iOS, and Web.
- **Benefit**: Essential for building a loyal, long-term user base and preventing data loss on device upgrade.

### 3. Dynamic Island / Live Activities Support
- **Description**: For iOS (and similar Android notification expansions), show a persistent hydration progress bar.
- **Implementation**: Integrate `@capacitor-community/apple-live-activities` for iOS and custom notification builders for Android.

### 4. Real In-App Purchase Flow
- **Description**: Migrate from mock paywall to actual transaction processing via App Store/Google Play billing APIs.
- **Implementation**: Integrate `@capacitor-community/in-app-purchase` or RevenueCat for cross-platform fulfillment.


---

## 🔒 Vulnerability & Hardening

### 1. Notification Spam Prevention
- **Description**: Ensure the snooze logic doesn't create infinite loops or overlapping schedules if a user clicks multiple times.
- **Implementation**: Check for existing "Snooze" notifications before scheduling a new one.

### 2. Rate Limiting Local Storage Access
- **Description**: Prevent high-frequency writes to LocalStorage from wear-and-tear on device flash memory (especially with 5m reminders).
- **Implementation**: Implement a debounced write strategy for the state store.

### 3. Permission Hardening
- **Description**: Audit `AndroidManifest.xml` to ensure only `INTERNET` and `SCHEDULE_EXACT_ALARM` (if needed) are used.
- **Implementation**: Regular security audits of the generated Android project.

---

## 📱 Native & Monetization Strategy

### 4. Health Integration (Apple Health / Google Fit)
**Description**: Automatically track water intake if the user logs it in other health apps.

### 5. In-App Purchase Integration
**Description**: Handle payouts for "Hero Pro" (Premium plants/Adaptive goals).

### 6. Adaptive Icons & Android 15+ Splash Shell
- **Description**: Premium look on Pixel devices with themed icons and smooth splash exits.

### 7. GDPR/CMP Consent Flow
- **Description**: Required by Google/Apple for users in the EU to consent to ad tracking and data collection.
- **Implementation**: Integrate `User Messaging Platform (UMP)` SDK via Capacitor.

### 8. Privacy Policy Integration
- **Description**: A dedicated screen and hosted URL for the mandatory Privacy Policy required by app stores.
- **Implementation**: Create a `/privacy` route and link it from the Settings page.


---

## 🏷️ Brand Identity & App Store Optimization (ASO)
Suggested names for the App Store:
1. **H2Grow: Water Tracker** (Punny, memorable, includes keywords).
2. **Sip & Sprout** (Action-oriented alliteration).
3. **Planty: Stay Hydrated** (Character-led branding).
4. **AquaGarden** (Focuses on the long-term gamification goal).

---

## 🛠️ Fresh Production Upgrades (Post-Branding Update)
Here are 3 more features/upgrades to consider for production:

### 1. A/B Testing Infrastructure
- **Description**: To maximize revenue, you need to test different paywall designs and price points.
- **Implementation**: Use a tool like **Firebase Remote Config** or **PostHog** to toggle price points for segments of users and track conversion rates.

### 2. User Feedback & Request Loop
- **Description**: Users love feeling heard. Allowing them to suggest the "Next Plant" keeps them invested.
- **Implementation**: Add a simple "Vote for the next plant" in the settings using Supabase to track results.

### 3. OLED/Dark Mode Optimization
- **Description**: Many mobile users prefer dark mode. The plant vibrant colors must be tuned to look premium against true-black backgrounds.
- **Implementation**: Implement theme-aware SVG adjustments for the `PlantMascot` to maintain visual quality in Dark Mode.
