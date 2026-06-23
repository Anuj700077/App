import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function AccountSettings() {
  const { theme } = useTheme();
  const rows = [
    { key: "name", label: "Name", value: "Alex Morgan", icon: "person-outline" as const },
    { key: "email", label: "Email", value: "alex.morgan@example.com", icon: "mail-outline" as const },
    { key: "phone", label: "Phone", value: "+1 (555) 123-4567", icon: "call-outline" as const },
    { key: "password", label: "Password", value: "Change password", icon: "lock-closed-outline" as const },
    { key: "twofa", label: "Two-Factor Auth", value: "Enabled", icon: "shield-checkmark-outline" as const },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="account-settings-screen">
      <ScreenHeader title="Account Settings" testIDPrefix="account" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <View style={[styles.avatarCard, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <Image
            source={{ uri: "https://images.pexels.com/photos/35129368/pexels-photo-35129368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" }}
            style={styles.avatar}
          />
          <Pressable style={[styles.avatarBtn, { backgroundColor: theme.brand }]} testID="account-change-avatar">
            <Ionicons name="camera-outline" size={14} color={theme.onBrand} />
            <Text style={[styles.avatarBtnText, { color: theme.onBrand }]}>Change photo</Text>
          </Pressable>
        </View>

        {rows.map((r) => (
          <Pressable
            key={r.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`account-row-${r.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name={r.icon} size={18} color={theme.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: theme.muted }]}>{r.label}</Text>
              <Text style={[styles.rowValue, { color: theme.onSurface }]}>{r.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.lg,
  },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: SPACING.md },
  avatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  avatarBtnText: { fontSize: 12, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  rowLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  rowValue: { fontSize: 14, fontWeight: "500" },
});
