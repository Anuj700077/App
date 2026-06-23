# Marine – UI Layout MVP

## Flow
Splash (auto 1.6s) → Login → Main shell (Dashboard tab)

## Auth screens (static, no real backend)
- `/login` — email, OTP, password, forgot-password link, signup link, theme toggle
- `/signup` — email, OTP, password
- `/forgot-password` — email only

## Main shell (`/main`)
- Sticky top header: hamburger | dynamic tab title | theme-toggle | bell + badge | 3-dot overflow
- Left drawer (slide-in): tappable profile header → /profile-edit, Account Settings, Billing, Integrations, Help & Support, Dark/Light Mode toggle, Sign Out
- Right notification panel (slide-in from right): 4 items + Mark all read
- **Per-tab 3-dot popup** (different items per tab):
  - Dashboard: Refresh, Customize widgets, Export summary
  - VMS: New entry, Filter groups, Sync now, VMS settings
  - CAPA: New CAPA, Filter status, Export report
  - Chat: New chat, Starred, Archived, Chat settings
- Bottom tabs: **Dashboard, VMS, CAPA, Chat**

## VMS tab
Three groups with tap-through buttons:
- **Reports** — Noon Report, Rest Hour, Events, Forms
- **PMS** — Updated Jobs, Defect Report
- **HSSEQ** — Drills, RA, PTW

## VMS sub-pages (`/vms-noon-report`, `/vms-rest-hour`, ..., `/vms-ptw`)
All 9 sub-pages share the same template:
- ScreenHeader with back button
- 5 top buttons in a single row (icon + "button1"…"button5")
- Row: 9-dot grid icon (left) + search input (right)
- Sample data cards (Open / Pending / Closed status pills)
- 9-dot opens a bottom-up drawer with quick actions grid: Filter, Sort, Export to PDF, Share, Settings, Help

## Other sub-pages
- `/account-settings`, `/billing`, `/integrations`, `/help-support`
- `/profile-edit`, `/preferences`, `/privacy`, `/about` (still routable; accessible via drawer header tap on avatar)

## Theme
Marine sky-blue palette, Light + Dark both supported. Toggle accessible from header, drawer, Preferences, and Login screen.

## Tech
- Expo Router (file-based routes)
- React Context for theme (`ThemeProvider`)
- React Native `Animated` for left drawer + right notif panel
- Modal with `slide` animation for the VMS bottom sheet
- `@expo/vector-icons` Ionicons
- `react-native-safe-area-context`

## Out of scope (future)
- Real auth + OTP delivery
- Real backend (reports, jobs, drills, CAPAs, chat messages)
- Theme persistence across reloads
- Push notifications (only build upon explicit user request)
