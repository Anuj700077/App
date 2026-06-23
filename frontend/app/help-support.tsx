import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

const TOPICS = [
  { key: "1", q: "How do I reset my password?" },
  { key: "2", q: "How does billing work?" },
  { key: "3", q: "Can I export my data?" },
  { key: "4", q: "How do I invite team members?" },
];

const CONTACT = [
  { key: "chat", label: "Live chat", icon: "chatbubbles-outline" as const, sub: "Usually replies in minutes" },
  { key: "email", label: "Email support", icon: "mail-outline" as const, sub: "support@marine.app" },
  { key: "docs", label: "Documentation", icon: "book-outline" as const, sub: "Browse our help center" },
];

export default function HelpSupport() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="help-support-screen">
      <ScreenHeader title="Help & Support" testIDPrefix="help" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <Text style={[styles.section, { color: theme.muted }]}>Get in touch</Text>
        {CONTACT.map((c) => (
          <Pressable
            key={c.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`help-contact-${c.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name={c.icon} size={20} color={theme.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.onSurface }]}>{c.label}</Text>
              <Text style={[styles.sub, { color: theme.muted }]}>{c.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Pressable>
        ))}

        <Text style={[styles.section, { color: theme.muted }]}>Frequently asked</Text>
        {TOPICS.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.faqRow, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`help-faq-${t.key}`}
          >
            <Ionicons name="help-circle-outline" size={20} color={theme.brand} />
            <Text style={[styles.faqText, { color: theme.onSurface }]}>{t.q}</Text>
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
  title: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
  faqRow: {
    flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  faqText: { flex: 1, fontSize: 14, fontWeight: "500" },
});
