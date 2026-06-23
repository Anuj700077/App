# Marine – UI Layout MVP

## Flow
Splash (auto 1.6s) → Login → Main shell

## Auth screens (static, no real backend)
- `/login` — email, OTP, password, forgot-password link, signup link, theme toggle button
- `/signup` — email, OTP, password, back-to-login link
- `/forgot-password` — email only, sends a (mock) reset link

## Main shell (`/main`)
- Top header: hamburger | dynamic tab title | theme-toggle | bell + badge | 3-dot overflow
- Left drawer (slide-in): Account Settings, Billing, Integrations, Help & Support, Dark/Light Mode toggle, Sign Out
- Right notification panel (slide-in from right): 4 notification rows, "Mark all read"
- 3-dot popup: Refresh, Share, Settings
- Bottom tabs: Home, Tasks, Analytics, Profile

## Sub-pages
- `/account-settings` — name/email/phone/password/2FA rows + avatar
- `/billing` — Marine Pro plan card, payment method, invoice history
- `/integrations` — Slack/GitHub/Google Calendar/Drive/Zapier with toggles
- `/help-support` — Live chat / Email / Docs + FAQ list
- `/profile-edit` — editable name, email, phone, bio + change-photo
- `/preferences` — theme toggle + push/email/sound/haptics switches
- `/privacy` — analytics/personalization/marketing/online-status switches + blocked/data/delete-account actions
- `/about` — app logo, version, links to terms/privacy/licenses/rate/share

## Theme
- Marine sky-blue palette (`#0288D1` brand light / `#4FC3F7` brand dark)
- Light + Dark both supported via React Context (`ThemeProvider`)
- Toggle accessible from: header icon, drawer row, Preferences screen, login screen

## Tech
- Expo Router (file-based routes)
- React Context for theme
- React Native `Animated` for drawer + right notif panel
- `@expo/vector-icons` Ionicons
- `react-native-safe-area-context`

## Out of scope (future)
- Real auth + OTP delivery
- Real backend (tasks, analytics, notifications, billing)
- Theme persistence across reloads (uses in-memory state)
