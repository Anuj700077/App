import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function Preferences() {
  const { theme, isDark, toggle } = useTheme();
  const [push, setPush] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [sound, setSound] = useState(false);
  const [haptics, setHaptics] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="preferences-screen">
      <ScreenHeader title="Preferences" testIDPrefix="preferences" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <Text style={[styles.section, { color: theme.muted }]}>Appearance</Text>
        <Pressable
          onPress={toggle}
          style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
          testID="preferences-theme-toggle"
        >
          <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={theme.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.onSurface }]}>Theme</Text>
            <Text style={[styles.sub, { color: theme.muted }]}>{isDark ? "Dark mode" : "Light mode"}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: theme.surfaceTertiary, true: theme.brand }}
            thumbColor="#FFFFFF"
          />
        </Pressable>

        <Text style={[styles.section, { color: theme.muted }]}>Notifications</Text>
        {[
          { key: "push", label: "Push notifications", sub: "Get alerts on your device", v: push, set: setPush, icon: "notifications-outline" as const },
          { key: "email", label: "Weekly digest email", sub: "Summary every Monday", v: emailDigest, set: setEmailDigest, icon: "mail-outline" as const },
          { key: "sound", label: "In-app sounds", sub: "Play sound on events", v: sound, set: setSound, icon: "volume-high-outline" as const },
          { key: "haptics", label: "Haptic feedback", sub: "Vibrate on interactions", v: haptics, set: setHaptics, icon: "phone-portrait-outline" as const },
        ].map((r) => (
          <View
            key={r.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`preferences-${r.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name={r.icon} size={20} color={theme.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.onSurface }]}>{r.label}</Text>
              <Text style={[styles.sub, { color: theme.muted }]}>{r.sub}</Text>
            </View>
            <Switch
              value={r.v}
              onValueChange={r.set}
              trackColor={{ false: theme.surfaceTertiary, true: theme.brand }}
              thumbColor="#FFFFFF"
              testID={`preferences-switch-${r.key}`}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6,
    marginBottom: SPACING.sm, marginTop: SPACING.md,
  },
  row: {
    flexDirection: "row", alignItems: "center", padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  title: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
});
