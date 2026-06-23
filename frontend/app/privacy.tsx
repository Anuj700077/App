import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function Privacy() {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState(true);
  const [personalized, setPersonalized] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [activity, setActivity] = useState(true);

  const switches = [
    { key: "analytics", label: "Usage analytics", sub: "Help us improve with anonymous data", v: analytics, set: setAnalytics, icon: "analytics-outline" as const },
    { key: "personalized", label: "Personalized content", sub: "Tailor your feed to your interests", v: personalized, set: setPersonalized, icon: "sparkles-outline" as const },
    { key: "marketing", label: "Marketing emails", sub: "News and product updates", v: marketing, set: setMarketing, icon: "megaphone-outline" as const },
    { key: "activity", label: "Show online status", sub: "Let teammates see when you're active", v: activity, set: setActivity, icon: "radio-outline" as const },
  ];

  const actions = [
    { key: "blocked", label: "Blocked users", icon: "ban-outline" as const },
    { key: "data", label: "Download my data", icon: "download-outline" as const },
    { key: "delete", label: "Delete account", icon: "trash-outline" as const, danger: true },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="privacy-screen">
      <ScreenHeader title="Privacy" testIDPrefix="privacy" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <Text style={[styles.section, { color: theme.muted }]}>Data & Personalization</Text>
        {switches.map((r) => (
          <View
            key={r.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`privacy-${r.key}`}
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
              testID={`privacy-switch-${r.key}`}
            />
          </View>
        ))}

        <Text style={[styles.section, { color: theme.muted }]}>Account</Text>
        {actions.map((a) => (
          <Pressable
            key={a.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`privacy-action-${a.key}`}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: a.danger ? "rgba(231,111,81,0.15)" : theme.brandTertiary },
              ]}
            >
              <Ionicons name={a.icon} size={20} color={a.danger ? theme.error : theme.brand} />
            </View>
            <Text style={[styles.title, { color: a.danger ? theme.error : theme.onSurface, flex: 1 }]}>
              {a.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Pressable>
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
