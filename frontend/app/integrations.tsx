import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

type IntegItem = { key: string; name: string; desc: string; icon: any; connected: boolean };

const SEED: IntegItem[] = [
  { key: "slack", name: "Slack", desc: "Send updates to channels", icon: "chatbubbles-outline", connected: true },
  { key: "github", name: "GitHub", desc: "Sync issues and PRs", icon: "logo-github", connected: true },
  { key: "gcal", name: "Google Calendar", desc: "Two-way calendar sync", icon: "calendar-outline", connected: false },
  { key: "drive", name: "Google Drive", desc: "Attach files to tasks", icon: "cloud-outline", connected: false },
  { key: "zapier", name: "Zapier", desc: "Connect 5000+ apps", icon: "flash-outline", connected: false },
];

export default function Integrations() {
  const { theme } = useTheme();
  const [items, setItems] = useState(SEED);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="integrations-screen">
      <ScreenHeader title="Integrations" testIDPrefix="integrations" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        {items.map((it) => (
          <View
            key={it.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`integration-${it.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name={it.icon} size={20} color={theme.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.onSurface }]}>{it.name}</Text>
              <Text style={[styles.desc, { color: theme.muted }]}>{it.desc}</Text>
            </View>
            <Switch
              value={it.connected}
              onValueChange={(v) =>
                setItems((prev) => prev.map((x) => (x.key === it.key ? { ...x, connected: v } : x)))
              }
              trackColor={{ false: theme.surfaceTertiary, true: theme.brand }}
              thumbColor={"#FFFFFF"}
              testID={`integration-switch-${it.key}`}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  name: { fontSize: 15, fontWeight: "600" },
  desc: { fontSize: 12, marginTop: 2 },
});
