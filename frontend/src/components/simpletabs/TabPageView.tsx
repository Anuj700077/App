import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type TabPageItem = {
  key: string;
  label: string;
  icon?: IoniconName;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabPageViewProps = {
  tabs: TabPageItem[];
  title: string;
  initialKey?: string;
  onClose?: () => void;
  onChange?: (key: string) => void;
  onSave?: (currentKey: string) => void;
  onSaveAndNext?: (currentKey: string, nextKey: string) => void;
  onSubmit?: (currentKey: string) => void;
  saveLabel?: string;
  submitLabel?: string;
};

const { width: SCREEN_W } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(280, SCREEN_W * 0.78);

export default function TabPageView({
  tabs,
  title,
  initialKey,
  onClose,
  onChange,
  onSave,
  onSaveAndNext,
  onSubmit,
  saveLabel = "Save",
  submitLabel = "Submit",
}: TabPageViewProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeKey, setActiveKey] = useState<string>(
    initialKey || tabs[0]?.key || "",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? 1 : 0,
      duration: 220,
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

  const activeIndex = useMemo(
    () => tabs.findIndex((t) => t.key === activeKey),
    [tabs, activeKey],
  );
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= tabs.length - 1;

  const goTo = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      setActiveKey(key);
      onChange?.(key);
    },
    [activeKey, onChange],
  );

  const goPrev = () => {
    if (isFirst) return;
    goTo(tabs[activeIndex - 1].key);
  };

  const goNext = () => {
    if (isLast) return;
    goTo(tabs[activeIndex + 1].key);
  };

  const handleSave = () => {
    onSave?.(activeKey);
  };

  const handleSaveAndNext = () => {
    if (isLast) return;
    const next = tabs[activeIndex + 1];
    onSaveAndNext?.(activeKey, next.key);
    goTo(next.key);
  };

  const handleSubmit = () => {
    onSubmit?.(activeKey);
  };

  const styles = makeStyles(theme);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-page-view">
      {/* Top bar */}
      <View style={styles.header} testID="tab-page-header">
        <Pressable
          onPress={() => setDrawerOpen(true)}
          style={styles.iconBtn}
          hitSlop={8}
          testID="tab-page-menu-button"
        >
          <Ionicons name="menu" size={24} color={theme.onSurface} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1} testID="tab-page-title">
          {activeTab?.label ? `${title} — ${activeTab.label}` : title}
        </Text>

        <Pressable
          onPress={onClose}
          style={styles.iconBtn}
          hitSlop={8}
          testID="tab-page-close-button"
        >
          <Ionicons name="close" size={24} color={theme.onSurface} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        testID={`tab-page-content-${activeKey}`}
      >
        {activeTab?.content}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
        testID="tab-page-footer"
      >
        <View style={styles.footerSide}>
          <Pressable
            onPress={goPrev}
            disabled={isFirst}
            style={({ pressed }) => [
              styles.navBtn,
              isFirst && styles.disabled,
              pressed && !isFirst && { backgroundColor: theme.surfaceTertiary },
            ]}
            testID="tab-page-prev-button"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={isFirst ? theme.muted : theme.onSurface}
            />
          </Pressable>
          <Pressable
            onPress={goNext}
            disabled={isLast}
            style={({ pressed }) => [
              styles.navBtn,
              isLast && styles.disabled,
              pressed && !isLast && { backgroundColor: theme.surfaceTertiary },
            ]}
            testID="tab-page-next-button"
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isLast ? theme.muted : theme.onSurface}
            />
          </Pressable>
        </View>

        <View style={styles.footerSide}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { backgroundColor: theme.surfaceTertiary },
            ]}
            testID="tab-page-save-button"
          >
            <Text style={[styles.secondaryBtnText, { color: theme.onSurface }]}>
              {saveLabel}
            </Text>
          </Pressable>

          {isLast ? (
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: theme.success },
                pressed && { opacity: 0.88 },
              ]}
              testID="tab-page-submit-button"
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>{submitLabel}</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleSaveAndNext}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.88 },
              ]}
              testID="tab-page-save-next-button"
            >
              <Text style={styles.primaryBtnText}>Save & Next</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.onBrand} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Drawer scrim */}
      {drawerOpen && (
        <Animated.View
          pointerEvents={drawerOpen ? "auto" : "none"}
          style={[styles.scrim, { opacity: scrimOpacity }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setDrawerOpen(false)}
            testID="tab-page-drawer-scrim"
          />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: drawerTranslate }],
          },
        ]}
        testID="tab-page-drawer"
      >
        <View style={styles.drawerHeader}>
          <Text style={[styles.drawerTitle, { color: theme.onSurface }]}>
            {title}
          </Text>
          <Pressable
            onPress={() => setDrawerOpen(false)}
            style={styles.iconBtn}
            hitSlop={8}
            testID="tab-page-drawer-close"
          >
            <Ionicons name="close" size={22} color={theme.onSurface} />
          </Pressable>
        </View>

        <Text style={[styles.drawerSubtitle, { color: theme.muted }]}>
          {tabs.length} sections
        </Text>

        <ScrollView style={{ flex: 1, marginTop: 8 }}>
          {tabs.map((t, idx) => {
            const active = t.key === activeKey;
            return (
              <Pressable
                key={t.key}
                onPress={() => {
                  if (t.disabled) return;
                  goTo(t.key);
                  setDrawerOpen(false);
                }}
                disabled={t.disabled}
                style={({ pressed }) => [
                  styles.drawerRow,
                  active && { backgroundColor: theme.brandTertiary },
                  pressed && !active && { backgroundColor: theme.surfaceTertiary },
                  t.disabled && { opacity: 0.4 },
                ]}
                testID={`tab-page-drawer-item-${t.key}`}
              >
                <View
                  style={[
                    styles.drawerIndex,
                    {
                      backgroundColor: active ? theme.brand : theme.surfaceTertiary,
                    },
                  ]}
                >
                  {t.icon ? (
                    <Ionicons
                      name={t.icon}
                      size={16}
                      color={active ? theme.onBrand : theme.onSurfaceTertiary}
                    />
                  ) : (
                    <Text
                      style={{
                        color: active ? theme.onBrand : theme.onSurfaceTertiary,
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.drawerRowLabel,
                    { color: active ? theme.brand : theme.onSurface },
                    active && { fontWeight: "700" },
                  ]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
                {active && (
                  <Ionicons name="checkmark" size={18} color={theme.brand} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.surface },
    header: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      color: theme.onSurface,
      marginHorizontal: 8,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    content: { flex: 1 },
    contentInner: { padding: 16, paddingBottom: 32 },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingTop: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
      backgroundColor: theme.surfaceSecondary,
      gap: 8,
    },
    footerSide: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    navBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    disabled: { opacity: 0.4 },

    secondaryBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    secondaryBtnText: { fontSize: 13, fontWeight: "600" },
    primaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.brand,
    },
    primaryBtnText: {
      color: theme.onBrand,
      fontSize: 13,
      fontWeight: "700",
    },

    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.scrim,
    },
    drawer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      paddingHorizontal: 12,
      backgroundColor: theme.surfaceSecondary,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 12,
    },
    drawerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 4,
    },
    drawerTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
    },
    drawerSubtitle: {
      fontSize: 12,
      marginLeft: 4,
      marginTop: 2,
    },
    drawerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
      marginVertical: 2,
    },
    drawerIndex: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    drawerRowLabel: { flex: 1, fontSize: 14 },
  });
}
