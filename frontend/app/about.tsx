import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function About() {
  const { theme } = useTheme();
  const links = [
    { key: "terms", label: "Terms of Service", icon: "document-text-outline" as const },
    { key: "privacy", label: "Privacy Policy", icon: "shield-outline" as const },
    { key: "licenses", label: "Open-source licenses", icon: "code-slash-outline" as const },
    { key: "rate", label: "Rate this app", icon: "star-outline" as const },
    { key: "share", label: "Share Marine", icon: "share-social-outline" as const },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="about-screen">
      <ScreenHeader title="About" testIDPrefix="about" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <View style={styles.brandWrap}>
          <View style={[styles.logo, { backgroundColor: theme.brand }]}>
            <Ionicons name="boat" size={36} color={theme.onBrand} />
          </View>
          <Text style={[styles.appName, { color: theme.onSurface }]}>Marine</Text>
          <Text style={[styles.version, { color: theme.muted }]}>Version 1.0.0 (build 100)</Text>
          <Text style={[styles.tagline, { color: theme.onSurfaceTertiary }]}>
            Sail through your day with calm focus.
          </Text>
        </View>

        {links.map((l) => (
          <Pressable
            key={l.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`about-${l.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name={l.icon} size={20} color={theme.brand} />
            </View>
            <Text style={[styles.label, { color: theme.onSurface }]}>{l.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Pressable>
        ))}

        <Text style={[styles.copyright, { color: theme.muted }]}>
          © 2026 Marine Labs. Made with care.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  brandWrap: { alignItems: "center", paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  logo: {
    width: 88, height: 88, borderRadius: RADIUS.lg,
    alignItems: "center", justifyContent: "center", marginBottom: SPACING.md,
  },
  appName: { fontSize: 24, fontWeight: "700" },
  version: { fontSize: 13, marginTop: SPACING.xs },
  tagline: { fontSize: 13, marginTop: SPACING.sm, textAlign: "center", paddingHorizontal: SPACING.lg },
  row: {
    flexDirection: "row", alignItems: "center", padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  label: { flex: 1, fontSize: 14, fontWeight: "600" },
  copyright: { textAlign: "center", fontSize: 12, marginTop: SPACING.xl },
});
