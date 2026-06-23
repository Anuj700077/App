import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function Billing() {
  const { theme } = useTheme();
  const invoices = [
    { key: "1", id: "INV-1042", date: "May 12, 2026", amount: "$29.00", status: "Paid" },
    { key: "2", id: "INV-1041", date: "Apr 12, 2026", amount: "$29.00", status: "Paid" },
    { key: "3", id: "INV-1040", date: "Mar 12, 2026", amount: "$29.00", status: "Paid" },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="billing-screen">
      <ScreenHeader title="Billing" testIDPrefix="billing" />
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
        <View style={[styles.planCard, { backgroundColor: theme.brand }]} testID="billing-plan-card">
          <Text style={styles.planEyebrow}>Current Plan</Text>
          <Text style={styles.planTitle}>Marine Pro</Text>
          <Text style={styles.planPrice}>$29<Text style={styles.planUnit}>/month</Text></Text>
          <Pressable style={styles.planBtn} testID="billing-manage-plan">
            <Text style={[styles.planBtnText, { color: theme.brand }]}>Manage plan</Text>
          </Pressable>
        </View>

        <Text style={[styles.section, { color: theme.muted }]}>Payment Method</Text>
        <View style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
            <Ionicons name="card-outline" size={18} color={theme.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.onSurface }]}>Visa ending in 4242</Text>
            <Text style={[styles.rowSub, { color: theme.muted }]}>Expires 09/28</Text>
          </View>
          <Pressable testID="billing-edit-card">
            <Text style={{ color: theme.brand, fontWeight: "600" }}>Edit</Text>
          </Pressable>
        </View>

        <Text style={[styles.section, { color: theme.muted }]}>Invoices</Text>
        {invoices.map((inv) => (
          <View
            key={inv.key}
            style={[styles.row, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`billing-invoice-${inv.key}`}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
              <Ionicons name="receipt-outline" size={18} color={theme.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.onSurface }]}>{inv.id}</Text>
              <Text style={[styles.rowSub, { color: theme.muted }]}>{inv.date}</Text>
            </View>
            <Text style={[styles.rowTitle, { color: theme.onSurface }]}>{inv.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  planCard: { borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.lg },
  planEyebrow: {
    color: "#FFFFFF", opacity: 0.85, fontSize: 12, fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.6, marginBottom: SPACING.xs,
  },
  planTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginBottom: SPACING.xs },
  planPrice: { color: "#FFFFFF", fontSize: 32, fontWeight: "700" },
  planUnit: { fontSize: 14, fontWeight: "500", opacity: 0.85 },
  planBtn: {
    marginTop: SPACING.md,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
  },
  planBtnText: { fontWeight: "700", fontSize: 13 },
  section: {
    fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6,
    marginBottom: SPACING.sm, marginTop: SPACING.md,
  },
  row: {
    flexDirection: "row", alignItems: "center", padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  rowTitle: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
});
