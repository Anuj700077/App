import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "./ScreenHeader";
import { useTheme } from "../theme/ThemeProvider";
import { SPACING, RADIUS } from "../theme/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TOP_BTN_ICONS: IoniconName[] = [
  "add-circle-outline",
  "swap-horizontal-outline",
  "checkmark-done-outline",
  "cloud-upload-outline",
  "ellipsis-horizontal-circle-outline",
];

const SHEET_ACTIONS: { key: string; label: string; icon: IoniconName }[] = [
  { key: "filter", label: "Filter", icon: "funnel-outline" },
  { key: "sort", label: "Sort", icon: "swap-vertical-outline" },
  { key: "export", label: "Export to PDF", icon: "document-text-outline" },
  { key: "share", label: "Share", icon: "share-social-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
  { key: "help", label: "Help", icon: "help-circle-outline" },
];

const SAMPLE_CARDS = [
  { id: "001", title: "Entry #001", status: "Open", date: "Today, 10:24", body: "Updated by Capt. Singh. Awaiting officer review." },
  { id: "002", title: "Entry #002", status: "Pending", date: "Yesterday", body: "Submitted with attachments. Verification queued." },
  { id: "003", title: "Entry #003", status: "Closed", date: "May 12, 2026", body: "Approved and archived. Reference INV-3349." },
  { id: "004", title: "Entry #004", status: "Open", date: "May 10, 2026", body: "Draft created. Add remarks before submitting." },
];

export function VmsPageTemplate({
  title,
  testIDPrefix,
}: {
  title: string;
  testIDPrefix: string;
}) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID={`${testIDPrefix}-screen`}>
      <ScreenHeader title={title} testIDPrefix={testIDPrefix} />
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* 5 top buttons */}
        <View style={styles.topRow} testID={`${testIDPrefix}-top-buttons`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.topBtn,
                { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                pressed && { backgroundColor: theme.surfaceTertiary },
              ]}
              testID={`${testIDPrefix}-top-button-${i + 1}`}
            >
              <View style={[styles.topBtnIcon, { backgroundColor: theme.brandTertiary }]}>
                <Ionicons name={TOP_BTN_ICONS[i]} size={18} color={theme.brand} />
              </View>
              <Text style={[styles.topBtnLabel, { color: theme.onSurface }]}>
                button{i + 1}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 9-dot + search row */}
        <View style={styles.controlRow}>
          <Pressable
            onPress={() => setSheetOpen(true)}
            style={[
              styles.nineDotBtn,
              { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
            ]}
            testID={`${testIDPrefix}-nine-dot-button`}
          >
            <Ionicons name="apps" size={20} color={theme.brand} />
          </Pressable>

          <View
            style={[
              styles.searchWrap,
              { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
            ]}
          >
            <Ionicons name="search" size={18} color={theme.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={theme.muted}
              style={[styles.searchInput, { color: theme.onSurface }]}
              testID={`${testIDPrefix}-search-input`}
            />
          </View>
        </View>

        {/* Cards */}
        {SAMPLE_CARDS.map((c) => (
          <View
            key={c.id}
            style={[styles.card, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
            testID={`${testIDPrefix}-card-${c.id}`}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.onSurface }]}>{c.title}</Text>
              <StatusPill status={c.status} />
            </View>
            <Text style={[styles.cardBody, { color: theme.onSurfaceTertiary }]}>
              {c.body}
            </Text>
            <Text style={[styles.cardDate, { color: theme.muted }]}>{c.date}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom drawer (sheet) */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable
          style={[styles.sheetBackdrop, { backgroundColor: theme.scrim }]}
          onPress={() => setSheetOpen(false)}
          testID={`${testIDPrefix}-sheet-backdrop`}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => {}}
            testID={`${testIDPrefix}-bottom-sheet`}
          >
            <View style={[styles.sheetHandle, { backgroundColor: theme.surfaceTertiary }]} />
            <Text style={[styles.sheetTitle, { color: theme.onSurface }]}>Quick actions</Text>

            <View style={styles.sheetGrid}>
              {SHEET_ACTIONS.map((a) => (
                <Pressable
                  key={a.key}
                  onPress={() => setSheetOpen(false)}
                  style={({ pressed }) => [
                    styles.sheetItem,
                    pressed && { backgroundColor: theme.surfaceTertiary },
                  ]}
                  testID={`${testIDPrefix}-sheet-${a.key}`}
                >
                  <View style={[styles.sheetIconBox, { backgroundColor: theme.brandTertiary }]}>
                    <Ionicons name={a.icon} size={20} color={theme.brand} />
                  </View>
                  <Text style={[styles.sheetLabel, { color: theme.onSurface }]}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function StatusPill({ status }: { status: string }) {
  const { theme } = useTheme();
  const color =
    status === "Open" ? theme.brand : status === "Pending" ? theme.warning : theme.success;
  return (
    <View
      style={{
        backgroundColor: color + "22",
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.pill,
      }}
    >
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  topBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  topBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  topBtnLabel: {
    fontSize: 11,
    fontWeight: "500",
  },

  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  nineDotBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchWrap: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
  },

  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardBody: { fontSize: 13, lineHeight: 18, marginBottom: SPACING.xs },
  cardDate: { fontSize: 11 },

  sheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: SPACING.sm,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  sheetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  sheetItem: {
    width: "31%",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  sheetIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  sheetLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
