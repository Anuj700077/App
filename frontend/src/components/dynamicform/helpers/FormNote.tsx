import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField } from "../dynamicform.types";

export default function FormNote({ field }: { field: DynamicField }) {
  const { theme } = useTheme();
  const variant = field.noteVariant || "info";
  const palette = {
    info: { bg: theme.brandTertiary, fg: theme.brand, icon: "information-circle" as const },
    warning: { bg: "rgba(244,162,97,0.18)", fg: theme.warning, icon: "warning" as const },
    error: { bg: "rgba(231,111,81,0.18)", fg: theme.error, icon: "alert-circle" as const },
    success: { bg: "rgba(42,157,143,0.18)", fg: theme.success, icon: "checkmark-circle" as const },
  }[variant];

  return (
    <View style={[styles.wrap, { backgroundColor: palette.bg }]}>
      <Ionicons name={palette.icon} size={18} color={palette.fg} />
      <Text style={[styles.text, { color: palette.fg }]}>{field.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  text: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "500" },
});
