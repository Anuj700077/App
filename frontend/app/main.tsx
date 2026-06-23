import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS, Theme } from "@/src/theme/tokens";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const { width: SCREEN_W } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(300, SCREEN_W * 0.82);
const NOTIF_WIDTH = Math.min(340, SCREEN_W * 0.88);

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

const DRAWER_ITEMS: {
  key: string;
  label: string;
  icon: IoniconName;
  route: string;
}[] = [
  { key: "account", label: "Account Settings", icon: "person-circle-outline", route: "/account-settings" },
  { key: "billing", label: "Billing", icon: "card-outline", route: "/billing" },
  { key: "integrations", label: "Integrations", icon: "extension-puzzle-outline", route: "/integrations" },
  { key: "help", label: "Help & Support", icon: "help-circle-outline", route: "/help-support" },
];

const OVERFLOW_ITEMS: { key: string; label: string; icon: IoniconName }[] = [
  { key: "refresh", label: "Refresh", icon: "refresh-outline" },
  { key: "share", label: "Share", icon: "share-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

const NOTIFICATIONS: {
  key: string;
  title: string;
  body: string;
  time: string;
  icon: IoniconName;
  unread: boolean;
}[] = [
  {
    key: "1",
    title: "New comment on Q2 Report",
    body: "Marie left feedback on your shared document.",
    time: "2m ago",
    icon: "chatbubble-outline",
    unread: true,
  },
  {
    key: "2",
    title: "Invoice paid",
    body: "Acme Co. paid invoice #1042 for $1,240.",
    time: "1h ago",
    icon: "card-outline",
    unread: true,
  },
  {
    key: "3",
    title: "Marie joined your team",
    body: "Welcome them aboard in #general.",
    time: "Yesterday",
    icon: "person-add-outline",
    unread: true,
  },
  {
    key: "4",
    title: "Weekly summary ready",
    body: "Your weekly analytics digest is ready to view.",
    time: "2d ago",
    icon: "stats-chart-outline",
    unread: false,
  },
];

const TAB_TITLES: Record<TabKey, string> = {
  home: "Home",
  tasks: "Tasks",
  analytics: "Analytics",
  profile: "Profile",
};

/* ------------------------------------------------------------------ */
/* Main shell                                                         */
/* ------------------------------------------------------------------ */

export default function Main() {
  const { theme, isDark, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(
    NOTIFICATIONS.filter((n) => n.unread).length,
  );

  const drawerAnim = useRef(new Animated.Value(0)).current;
  const notifAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen, drawerAnim]);

  useEffect(() => {
    Animated.timing(notifAnim, {
      toValue: notifOpen ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [notifOpen, notifAnim]);

  const drawerTranslate = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });
  const drawerScrim = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const notifTranslate = notifAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [NOTIF_WIDTH, 0],
  });
  const notifScrim = notifAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openNotif = useCallback(() => setNotifOpen(true), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  const onDrawerItem = useCallback(
    (route: string) => {
      setDrawerOpen(false);
      setTimeout(() => router.push(route as never), 120);
    },
    [router],
  );

  const onSignOut = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => router.replace("/login"), 120);
  }, [router]);

  const onProfileRow = useCallback(
    (route: string) => {
      router.push(route as never);
    },
    [router],
  );

  const markAllRead = useCallback(() => {
    setNotifCount(0);
  }, []);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="main-shell">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.surface}
      />

      {/* Header */}
      <View style={styles.header} testID="top-header">
        <Pressable
          onPress={openDrawer}
          style={styles.iconBtn}
          hitSlop={8}
          testID="header-menu-button"
        >
          <Ionicons name="menu" size={26} color={theme.onSurface} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1} testID="header-title">
          {TAB_TITLES[activeTab]}
        </Text>

        <View style={styles.headerRight}>
          <Pressable
            onPress={toggle}
            style={styles.iconBtn}
            hitSlop={8}
            testID="header-theme-toggle"
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={22}
              color={theme.onSurface}
            />
          </Pressable>

          <Pressable
            onPress={openNotif}
            style={styles.iconBtn}
            hitSlop={8}
            testID="header-bell-button"
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.onSurface}
            />
            {notifCount > 0 && (
              <View style={styles.badge} testID="header-bell-badge">
                <Text style={styles.badgeText}>
                  {notifCount > 99 ? "99+" : String(notifCount)}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => setOverflowOpen(true)}
            style={styles.iconBtn}
            hitSlop={8}
            testID="header-overflow-button"
          >
            <Ionicons name="ellipsis-vertical" size={22} color={theme.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content} testID="tab-content">
        {activeTab === "home" && <HomeScreen theme={theme} />}
        {activeTab === "tasks" && <TasksScreen theme={theme} />}
        {activeTab === "analytics" && <AnalyticsScreen theme={theme} />}
        {activeTab === "profile" && (
          <ProfileScreen theme={theme} onRow={onProfileRow} />
        )}
      </View>

      {/* Bottom Tabs */}
      <View
        style={[
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, SPACING.sm) },
        ]}
        testID="bottom-tabs"
      >
        {TABS.map((t) => {
          const active = t.key === activeTab;
          return (
            <Pressable
              key={t.key}
              onPress={() => setActiveTab(t.key)}
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

      {/* Drawer scrim */}
      {drawerOpen && (
        <Animated.View
          pointerEvents={drawerOpen ? "auto" : "none"}
          style={[styles.scrim, { opacity: drawerScrim }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDrawer}
            testID="drawer-scrim"
          />
        </Animated.View>
      )}

      {/* Left Drawer */}
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
        <DrawerContent
          theme={theme}
          isDark={isDark}
          onThemeToggle={toggle}
          onItem={onDrawerItem}
          onSignOut={onSignOut}
        />
      </Animated.View>

      {/* Notif scrim */}
      {notifOpen && (
        <Animated.View
          pointerEvents={notifOpen ? "auto" : "none"}
          style={[styles.scrim, { opacity: notifScrim }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeNotif}
            testID="notif-scrim"
          />
        </Animated.View>
      )}

      {/* Right Notification Panel */}
      <Animated.View
        style={[
          styles.notifPanel,
          {
            width: NOTIF_WIDTH,
            paddingTop: insets.top + SPACING.md,
            paddingBottom: insets.bottom + SPACING.lg,
            transform: [{ translateX: notifTranslate }],
          },
        ]}
        testID="notif-panel"
      >
        <View style={styles.notifHeader}>
          <Text style={styles.notifHeaderTitle}>Notifications</Text>
          <Pressable
            onPress={markAllRead}
            hitSlop={6}
            testID="notif-mark-all-read"
          >
            <Text style={[styles.link, { color: theme.brand }]}>
              Mark all read
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: SPACING.sm }}>
          {NOTIFICATIONS.map((n) => (
            <View
              key={n.key}
              style={styles.notifRow}
              testID={`notif-item-${n.key}`}
            >
              <View
                style={[
                  styles.notifIconBox,
                  n.unread && { backgroundColor: theme.brandTertiary },
                ]}
              >
                <Ionicons
                  name={n.icon}
                  size={18}
                  color={n.unread ? theme.brand : theme.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>
                  {n.body}
                </Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
              {n.unread && notifCount > 0 && <View style={styles.unreadDot} />}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Overflow popup */}
      <Modal
        visible={overflowOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setOverflowOpen(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setOverflowOpen(false)}
          testID="overflow-backdrop"
        >
          <View
            style={[styles.overflowCard, { top: insets.top + 56 }]}
            testID="overflow-menu"
          >
            {OVERFLOW_ITEMS.map((item, idx) => (
              <Pressable
                key={item.key}
                onPress={() => setOverflowOpen(false)}
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
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer                                                             */
/* ------------------------------------------------------------------ */

function DrawerContent({
  theme,
  isDark,
  onThemeToggle,
  onItem,
  onSignOut,
}: {
  theme: Theme;
  isDark: boolean;
  onThemeToggle: () => void;
  onItem: (route: string) => void;
  onSignOut: () => void;
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
            onPress={() => onItem(item.route)}
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

        <Pressable
          onPress={onThemeToggle}
          style={({ pressed }) => [
            styles.drawerRow,
            pressed && { backgroundColor: theme.surfaceTertiary },
          ]}
          testID="drawer-theme-toggle"
        >
          <View style={styles.drawerIconBox}>
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color={theme.brand}
            />
          </View>
          <Text style={styles.drawerRowLabel}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </Text>
        </Pressable>

        <Pressable
          onPress={onSignOut}
          style={({ pressed }) => [
            styles.drawerRow,
            pressed && { backgroundColor: theme.surfaceTertiary },
          ]}
          testID="drawer-item-signout"
        >
          <View
            style={[styles.drawerIconBox, { backgroundColor: "rgba(231,111,81,0.15)" }]}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.error} />
          </View>
          <Text style={[styles.drawerRowLabel, { color: theme.error }]}>
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.divider} />
      <Text style={styles.drawerVersion}>v1.0.0 • Marine</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Tab Screens                                                        */
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
        <Text style={styles.heroTitle}>Smooth sailing today</Text>
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

function ProfileScreen({
  theme,
  onRow,
}: {
  theme: Theme;
  onRow: (route: string) => void;
}) {
  const styles = makeStyles(theme);
  const rows: { key: string; label: string; icon: IoniconName; route: string }[] = [
    { key: "edit", label: "Edit Profile", icon: "create-outline", route: "/profile-edit" },
    { key: "prefs", label: "Preferences", icon: "options-outline", route: "/preferences" },
    { key: "privacy", label: "Privacy", icon: "lock-closed-outline", route: "/privacy" },
    { key: "about", label: "About", icon: "information-circle-outline", route: "/about" },
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
          onPress={() => onRow(r.route)}
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
    root: { flex: 1, backgroundColor: theme.surface },
    content: { flex: 1, backgroundColor: theme.surface },

    header: {
      height: 56,
      paddingHorizontal: SPACING.sm,
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
    headerRight: { flexDirection: "row", alignItems: "center" },
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
    },
    tabLabel: { fontSize: 11, marginTop: 2 },

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
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 12,
    },
    drawerInner: { flex: 1, paddingHorizontal: SPACING.md },
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
    avatar: { width: 46, height: 46, borderRadius: 23 },
    drawerName: { fontSize: 16, fontWeight: "600", color: theme.onSurface },
    drawerEmail: { fontSize: 12, color: theme.muted, marginTop: 2 },
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
    drawerRowLabel: { fontSize: 15, color: theme.onSurface },
    drawerVersion: {
      fontSize: 12,
      color: theme.muted,
      textAlign: "center",
      marginTop: SPACING.sm,
    },

    /* Notif panel (right side) */
    notifPanel: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: theme.surfaceSecondary,
      shadowColor: "#000",
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 12,
      paddingHorizontal: SPACING.md,
    },
    notifHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: SPACING.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    notifHeaderTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.onSurface,
    },
    link: { fontSize: 13, fontWeight: "600" },
    notifRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: SPACING.md,
      paddingVertical: SPACING.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    notifIconBox: {
      width: 36,
      height: 36,
      borderRadius: RADIUS.md,
      backgroundColor: theme.surfaceTertiary,
      alignItems: "center",
      justifyContent: "center",
    },
    notifTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.onSurface,
      marginBottom: 2,
    },
    notifBody: { fontSize: 12, color: theme.onSurfaceTertiary, lineHeight: 16 },
    notifTime: { fontSize: 11, color: theme.muted, marginTop: 4 },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.brand,
      marginTop: 6,
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
    overflowText: { fontSize: 14, color: theme.onSurface },

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
    metricsRow: { flexDirection: "row", marginBottom: SPACING.lg },
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
    metricValue: { fontSize: 24, fontWeight: "700", color: theme.onSurface },
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
    listTitle: { fontSize: 14, fontWeight: "600", color: theme.onSurface },
    listSubtitle: { fontSize: 12, color: theme.muted, marginTop: 2 },

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
    analyticsDelta: { fontSize: 12, color: theme.success, marginTop: 2 },
    chartPlaceholder: {
      marginTop: SPACING.md,
      height: 80,
      borderRadius: RADIUS.sm,
      backgroundColor: theme.surfaceTertiary,
    },

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
    avatarLg: { width: 88, height: 88, borderRadius: 44 },
    profileName: { fontSize: 18, fontWeight: "700", color: theme.onSurface },
    profileEmail: { fontSize: 13, color: theme.muted, marginTop: 2 },
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
