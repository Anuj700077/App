import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function FileViewInput({
  field,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const title = field.viewTitle || (field.value as any)?.name || "Document";
  const sub = field.viewSubtitle || "Tap to preview";
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
      testID={`df-${field.name}`}
    >
      <View style={[styles.icon, { backgroundColor: theme.brandTertiary }]}>
        <Ionicons name="document-text-outline" size={20} color={theme.brand} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.onSurface }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.sub, { color: theme.muted }]} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <Pressable hitSlop={6}>
        <Ionicons name="open-outline" size={18} color={theme.brand} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 10,
    padding: 10,
  },
  icon: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
});
