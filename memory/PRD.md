# Utility Dash – UI Layout MVP

## Scope (current iteration)
Static UI shell only. No backend, no auth, no persistence.

## Navigation Architecture
- Custom slide-in **Left Drawer** (animated, scrim overlay).
- **Top header** (sticky, safe-area aware) with:
  - Left: hamburger menu icon → opens drawer
  - Center: dynamic title (matches active tab)
  - Right: bell icon with red notification badge (currently "3") + 3-dot overflow icon
- **3-dot popup menu** (Modal-based, anchored top-right): Refresh, Share, Settings
- **Bottom tab bar** with 4 tabs: Home, Tasks, Analytics, Profile

## Tabs / Screens
1. **Home** – hero card, 2-column metric cards, recent activity list
2. **Tasks** – stacked task cards with checkbox + chevron
3. **Analytics** – stat cards with chart placeholder block
4. **Profile** – large avatar header + settings rows

## Drawer items
Account Settings, Billing, Integrations, Help & Support, Sign Out

## Theming
- Light + Dark themes via `useColorScheme()`
- Warm Terracotta brand palette (`#E05D3A` / `#E87A5D` dark)
- Plus Jakarta-style typography scale, 8pt spacing grid

## Tech
- Expo SDK 54 + expo-router
- `@expo/vector-icons` Ionicons
- `react-native-safe-area-context`
- React Native `Animated` for drawer slide

## Out of scope (for future iterations)
- Backend API + persistence
- Real notifications, real tasks/analytics data
- Authentication
- Settings persistence (theme toggle, etc.)
