import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
  useColorScheme,
  Image,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

/* ------------------------------------------------------------------ */
/* Theme                                                              */
/* ------------------------------------------------------------------ */

const lightColors = {
  surface: "#F9F8F6",
  onSurface: "#1A1A1A",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#1A1A1A",
  surfaceTertiary: "#EAE9E5",
  onSurfaceTertiary: "#4A4A4A",
  surfaceInverse: "#1A1A1A",
  onSurfaceInverse: "#F9F8F6",
  brand: "#E05D3A",
  onBrand: "#FFFFFF",
  brandTertiary: "#FCECE7",
  onBrandTertiary: "#E05D3A",
  border: "#EAE9E5",
  divider: "#EAE9E5",
  muted: "#7A7A78",
  error: "#E76F51",
  success: "#2A9D8F",
  warning: "#E9C46A",
  shadow: "rgba(0,0,0,0.08)",
  scrim: "rgba(0,0,0,0.45)",
};

const darkColors = {
  surface: "#121212",
  onSurface: "#F0EFEA",
  surfaceSecondary: "#1E1E1E",
  onSurfaceSecondary: "#F0EFEA",
  surfaceTertiary: "#2C2C2C",
  onSurfaceTertiary: "#A3A3A0",
  surfaceInverse: "#F0EFEA",
  onSurfaceInverse: "#121212",
  brand: "#E87A5D",
  onBrand: "#121212",
  brandTertiary: "#3A2119",
  onBrandTertiary: "#E87A5D",
  border: "#2C2C2C",
  divider: "#2C2C2C",
  muted: "#8A8A88",
  error: "#E76F51",
  success: "#2A9D8F",
  warning: "#E9C46A",
  shadow: "rgba(0,0,0,0.4)",
  scrim: "rgba(0,0,0,0.6)",
};

type Theme = typeof lightColors;

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const RADIUS = { sm: 6, md: 12, lg: 20, pill: 999 };

const { width: SCREEN_W } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(300, SCREEN_W * 0.82);

/* ------------------------------------------------------------------ */
/* Static data                                                        */
/* ------------------------------------------------------------------ */

type TabKey = "home" | "tasks" | "analytics" | "profile";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  key: TabKey;
  label: string;
  icon: IoniconName;
  iconActive: IoniconName;
}[] = [
  { key: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  { key: "tasks", label: "Tasks", icon: "checkbox-outline", iconActive: "checkbox" },
  { key: "analytics", label: "Analytics", icon: "stats-chart-outline", iconActive: "stats-chart" },
  { key: "profile", label: "Profile", icon: "person-outline", iconActive: "person" },
];

const DRAWER_ITEMS: { key: string; label: string; icon: IoniconName }[] = [
  { key: "account", label: "Account Settings", icon: "person-circle-outline" },
  { key: "billing", label: "Billing", icon: "card-outline" },
  { key: "integrations", label: "Integrations", icon: "extension-puzzle-outline" },
  { key: "help", label: "Help & Support", icon: "help-circle-outline" },
  { key: "signout", label: "Sign Out", icon: "log-out-outline" },
];

const OVERFLOW_ITEMS: { key: string; label: string; icon: IoniconName }[] = [
  { key: "refresh", label: "Refresh", icon: "refresh-outline" },
  { key: "share", label: "Share", icon: "share-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

const TAB_TITLES: Record<TabKey, string> = {
  home: "Home",
  tasks: "Tasks",
  analytics: "Analytics",
  profile: "Profile",
};

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export default function Index() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

function AppShell() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [notifCount] = useState(3);

  /* Drawer animation */
  const drawerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen, drawerAnim]);

  const drawerTranslate = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });
  const scrimOpacity = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="app-shell">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.surface}
      />

      {/* Top Header */}
      <TopHeader
        theme={theme}
        title={TAB_TITLES[activeTab]}
        notifCount={notifCount}
        onMenuPress={openDrawer}
        onBellPress={() => {}}
        onOverflowPress={() => setOverflowOpen(true)}
      />

      {/* Main content */}
      <View style={styles.content} testID="tab-content">
        {activeTab === "home" && <HomeScreen theme={theme} />}
        {activeTab === "tasks" && <TasksScreen theme={theme} />}
        {activeTab === "analytics" && <AnalyticsScreen theme={theme} />}
        {activeTab === "profile" && <ProfileScreen theme={theme} />}
      </View>

      {/* Bottom Tabs */}
      <BottomTabs
        theme={theme}
        activeTab={activeTab}
        onChange={setActiveTab}
        bottomInset={insets.bottom}
      />

      {/* Drawer scrim */}
      {drawerOpen && (
        <Animated.View
          pointerEvents={drawerOpen ? "auto" : "none"}
          style={[styles.scrim, { opacity: scrimOpacity }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDrawer}
            testID="drawer-scrim"
          />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + SPACING.lg,
            paddingBottom: insets.bottom + SPACING.lg,
            transform: [{ translateX: drawerTranslate }],
          },
        ]}
        testID="left-drawer"
      >
        <DrawerContent theme={theme} onItemPress={closeDrawer} />
      </Animated.View>

      {/* Overflow popup */}
      <OverflowMenu
        theme={theme}
        visible={overflowOpen}
        onClose={() => setOverflowOpen(false)}
        topInset={insets.top}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Top Header                                                         */
/* ------------------------------------------------------------------ */

function TopHeader({
  theme,
  title,
  notifCount,
  onMenuPress,
  onBellPress,
  onOverflowPress,
}: {
  theme: Theme;
  title: string;
  notifCount: number;
  onMenuPress: () => void;
  onBellPress: () => void;
  onOverflowPress: () => void;
}) {
  const styles = makeStyles(theme);
  return (
    <View style={styles.header} testID="top-header">
      <Pressable
        onPress={onMenuPress}
        style={styles.iconBtn}
        hitSlop={8}
        testID="header-menu-button"
      >
        <Ionicons name="menu" size={26} color={theme.onSurface} />
      </Pressable>

      <Text style={styles.headerTitle} numberOfLines={1} testID="header-title">
        {title}
      </Text>

      <View style={styles.headerRight}>
        <Pressable
          onPress={onBellPress}
          style={styles.iconBtn}
          hitSlop={8}
          testID="header-bell-button"
        >
          <Ionicons name="notifications-outline" size={24} color={theme.onSurface} />
          {notifCount > 0 && (
            <View style={styles.badge} testID="header-bell-badge">
              <Text style={styles.badgeText} testID="header-bell-badge-text">
                {notifCount > 99 ? "99+" : String(notifCount)}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={onOverflowPress}
          style={styles.iconBtn}
          hitSlop={8}
          testID="header-overflow-button"
        >
          <Ionicons name="ellipsis-vertical" size={22} color={theme.onSurface} />
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer                                                             */
/* ------------------------------------------------------------------ */

function DrawerContent({
  theme,
  onItemPress,
}: {
  theme: Theme;
  onItemPress: () => void;
}) {
  const styles = makeStyles(theme);
  return (
    <View style={styles.drawerInner}>
      <View style={styles.drawerHeader} testID="drawer-header">
        <View style={styles.avatarRing}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/35129368/pexels-photo-35129368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            }}
            style={styles.avatar}
          />
        </View>
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
          <Text style={styles.drawerName} numberOfLines={1}>
            Alex Morgan
          </Text>
          <Text style={styles.drawerEmail} numberOfLines={1}>
            alex.morgan@example.com
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={{ paddingVertical: SPACING.sm }}>
        {DRAWER_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            onPress={onItemPress}
            style={({ pressed }) => [
              styles.drawerRow,
              pressed && { backgroundColor: theme.surfaceTertiary },
            ]}
            testID={`drawer-item-${item.key}`}
          >
            <View style={styles.drawerIconBox}>
              <Ionicons name={item.icon} size={20} color={theme.brand} />
            </View>
            <Text style={styles.drawerRowLabel}>{item.label}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.muted}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.divider} />
      <Text style={styles.drawerVersion}>v1.0.0</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Overflow Menu                                                      */
/* ------------------------------------------------------------------ */

function OverflowMenu({
  theme,
  visible,
  onClose,
  topInset,
}: {
  theme: Theme;
  visible: boolean;
  onClose: () => void;
  topInset: number;
}) {
  const styles = makeStyles(theme);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalBackdrop}
        onPress={onClose}
        testID="overflow-backdrop"
      >
        <View
          style={[
            styles.overflowCard,
            { top: topInset + 56 },
          ]}
          testID="overflow-menu"
        >
          {OVERFLOW_ITEMS.map((item, idx) => (
            <Pressable
              key={item.key}
              onPress={onClose}
              style={({ pressed }) => [
                styles.overflowRow,
                pressed && { backgroundColor: theme.surfaceTertiary },
                idx === OVERFLOW_ITEMS.length - 1 && { borderBottomWidth: 0 },
              ]}
              testID={`overflow-item-${item.key}`}
            >
              <Ionicons name={item.icon} size={18} color={theme.onSurface} />
              <Text style={styles.overflowText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom Tabs                                                        */
/* ------------------------------------------------------------------ */

function BottomTabs({
  theme,
  activeTab,
  onChange,
  bottomInset,
}: {
  theme: Theme;
  activeTab: TabKey;
  onChange: (k: TabKey) => void;
  bottomInset: number;
}) {
  const styles = makeStyles(theme);
  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: Math.max(bottomInset, SPACING.sm) },
      ]}
      testID="bottom-tabs"
    >
      {TABS.map((t) => {
        const active = t.key === activeTab;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={styles.tabItem}
            testID={`tab-${t.key}`}
          >
            <Ionicons
              name={active ? t.iconActive : t.icon}
              size={24}
              color={active ? theme.brand : theme.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: active ? theme.brand : theme.muted },
                active && { fontWeight: "600" },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Screens (static placeholders)                                      */
/* ------------------------------------------------------------------ */

function HomeScreen({ theme }: { theme: Theme }) {
  const styles = makeStyles(theme);
  return (
    <ScrollView
      contentContainerStyle={styles.screenScroll}
      showsVerticalScrollIndicator={false}
      testID="home-screen"
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Welcome back</Text>
        <Text style={styles.heroTitle}>Stay on top of your day</Text>
        <Text style={styles.heroSubtitle}>
          You have 3 tasks pending and 2 new updates.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { marginRight: SPACING.md }]}>
          <Text style={styles.metricLabel}>Active Tasks</Text>
          <Text style={styles.metricValue}>12</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Reviews</Text>
          <Text style={styles.metricValue}>4</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {[
        { t: "New comment on Report Q2", s: "2 min ago", icon: "chatbubble-outline" as IoniconName },
        { t: "Invoice #1042 paid", s: "1 hr ago", icon: "card-outline" as IoniconName },
        { t: "Marie joined your team", s: "Yesterday", icon: "person-add-outline" as IoniconName },
      ].map((row, i) => (
        <View key={i} style={styles.listRow}>
          <View style={styles.listIconBox}>
            <Ionicons name={row.icon} size={18} color={theme.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{row.t}</Text>
            <Text style={styles.listSubtitle}>{row.s}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function TasksScreen({ theme }: { theme: Theme }) {
  const styles = makeStyles(theme);
  const tasks = [
    { t: "Review design handoff", s: "Due today" },
    { t: "Send invoice to Acme Co.", s: "Due tomorrow" },
    { t: "Sync with engineering", s: "This week" },
    { t: "Update onboarding copy", s: "This week" },
  ];
  return (
    <ScrollView
      contentContainerStyle={styles.screenScroll}
      showsVerticalScrollIndicator={false}
      testID="tasks-screen"
    >
      <Text style={styles.sectionTitle}>Your Tasks</Text>
      {tasks.map((row, i) => (
        <View key={i} style={styles.taskCard}>
          <View style={styles.checkbox} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{row.t}</Text>
            <Text style={styles.listSubtitle}>{row.s}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.muted} />
        </View>
      ))}
    </ScrollView>
  );
}

function AnalyticsScreen({ theme }: { theme: Theme }) {
  const styles = makeStyles(theme);
  return (
    <ScrollView
      contentContainerStyle={styles.screenScroll}
      showsVerticalScrollIndicator={false}
      testID="analytics-screen"
    >
      <Text style={styles.sectionTitle}>Overview</Text>
      {[
        { l: "Revenue", v: "$12,480", d: "+8.2%" },
        { l: "Active Users", v: "1,284", d: "+3.1%" },
      ].map((m, i) => (
        <View key={i} style={styles.analyticsCard}>
          <Text style={styles.metricLabel}>{m.l}</Text>
          <Text style={styles.analyticsValue}>{m.v}</Text>
          <Text style={styles.analyticsDelta}>{m.d} this week</Text>
          <View style={styles.chartPlaceholder} />
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileScreen({ theme }: { theme: Theme }) {
  const styles = makeStyles(theme);
  const rows: { key: string; label: string; icon: IoniconName }[] = [
    { key: "edit", label: "Edit Profile", icon: "create-outline" },
    { key: "prefs", label: "Preferences", icon: "options-outline" },
    { key: "privacy", label: "Privacy", icon: "lock-closed-outline" },
    { key: "about", label: "About", icon: "information-circle-outline" },
  ];
  return (
    <ScrollView
      contentContainerStyle={styles.screenScroll}
      showsVerticalScrollIndicator={false}
      testID="profile-screen"
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarRingLg}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/35129368/pexels-photo-35129368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            }}
            style={styles.avatarLg}
          />
        </View>
        <Text style={styles.profileName}>Alex Morgan</Text>
        <Text style={styles.profileEmail}>alex.morgan@example.com</Text>
      </View>

      {rows.map((r) => (
        <Pressable
          key={r.key}
          style={({ pressed }) => [
            styles.profileRow,
            pressed && { backgroundColor: theme.surfaceTertiary },
          ]}
          testID={`profile-row-${r.key}`}
        >
          <View style={styles.listIconBox}>
            <Ionicons name={r.icon} size={18} color={theme.brand} />
          </View>
          <Text style={styles.listTitle}>{r.label}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.muted}
            style={{ marginLeft: "auto" }}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    content: {
      flex: 1,
      backgroundColor: theme.surface,
    },

    /* Header */
    header: {
      height: 56,
      paddingHorizontal: SPACING.md,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: theme.onSurface,
      marginHorizontal: SPACING.sm,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    badge: {
      position: "absolute",
      top: 6,
      right: 4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.error,
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.surface,
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
      lineHeight: 12,
    },

    /* Bottom tabs */
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.surfaceSecondary,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
      paddingTop: SPACING.sm,
    },
    tabItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: SPACING.xs,
      gap: 2,
    },
    tabLabel: {
      fontSize: 11,
      marginTop: 2,
    },

    /* Drawer */
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.scrim,
    },
    drawer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: theme.surfaceSecondary,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 12,
    },
    drawerInner: {
      flex: 1,
      paddingHorizontal: SPACING.md,
    },
    drawerHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SPACING.sm,
      paddingBottom: SPACING.lg,
    },
    avatarRing: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.brandTertiary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
    },
    drawerName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.onSurface,
    },
    drawerEmail: {
      fontSize: 12,
      color: theme.muted,
      marginTop: 2,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
      marginVertical: SPACING.sm,
    },
    drawerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      borderRadius: RADIUS.md,
    },
    drawerIconBox: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.md,
      backgroundColor: theme.brandTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SPACING.md,
    },
    drawerRowLabel: {
      fontSize: 15,
      color: theme.onSurface,
    },
    drawerVersion: {
      fontSize: 12,
      color: theme.muted,
      textAlign: "center",
      marginTop: SPACING.sm,
    },

    /* Overflow modal */
    modalBackdrop: {
      flex: 1,
      backgroundColor: "transparent",
    },
    overflowCard: {
      position: "absolute",
      right: SPACING.md,
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.xs,
      minWidth: 180,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    overflowRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      gap: SPACING.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    overflowText: {
      fontSize: 14,
      color: theme.onSurface,
    },

    /* Screen common */
    screenScroll: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xxl,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.muted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: SPACING.md,
      marginTop: SPACING.sm,
    },

    /* Home */
    heroCard: {
      backgroundColor: theme.brand,
      borderRadius: RADIUS.lg,
      padding: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    heroEyebrow: {
      color: "#FFFFFF",
      opacity: 0.85,
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginBottom: SPACING.xs,
    },
    heroTitle: {
      color: "#FFFFFF",
      fontSize: 22,
      fontWeight: "700",
      marginBottom: SPACING.xs,
    },
    heroSubtitle: {
      color: "#FFFFFF",
      opacity: 0.9,
      fontSize: 13,
      lineHeight: 18,
    },
    metricsRow: {
      flexDirection: "row",
      marginBottom: SPACING.lg,
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    metricLabel: {
      fontSize: 12,
      color: theme.muted,
      marginBottom: SPACING.xs,
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.onSurface,
    },
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    listIconBox: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.brandTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SPACING.md,
    },
    listTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.onSurface,
    },
    listSubtitle: {
      fontSize: 12,
      color: theme.muted,
      marginTop: 2,
    },

    /* Tasks */
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: RADIUS.sm,
      borderWidth: 2,
      borderColor: theme.brand,
      marginRight: SPACING.md,
    },

    /* Analytics */
    analyticsCard: {
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    analyticsValue: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.onSurface,
      marginTop: SPACING.xs,
    },
    analyticsDelta: {
      fontSize: 12,
      color: theme.success,
      marginTop: 2,
    },
    chartPlaceholder: {
      marginTop: SPACING.md,
      height: 80,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceTertiary,
    },

    /* Profile */
    profileHeader: {
      alignItems: "center",
      paddingVertical: SPACING.lg,
      marginBottom: SPACING.md,
    },
    avatarRingLg: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.brandTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACING.md,
    },
    avatarLg: {
      width: 88,
      height: 88,
      borderRadius: 44,
    },
    profileName: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.onSurface,
    },
    profileEmail: {
      fontSize: 13,
      color: theme.muted,
      marginTop: 2,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
  });
}
