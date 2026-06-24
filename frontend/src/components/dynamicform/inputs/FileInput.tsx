import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function FileInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const name =
    typeof field.value === "string"
      ? field.value
      : (field.value as any)?.name || "";

  return (
    <Pressable
      onPress={() => !ro && onChange?.(field.name, `mock-file-${Date.now()}.pdf`)}
      style={[
        styles.box,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
      testID={`df-${field.name}`}
    >
      <Ionicons name="cloud-upload-outline" size={20} color={theme.brand} />
      <Text style={[styles.text, { color: name ? theme.onSurface : theme.muted }]} numberOfLines={1}>
        {name || field.placeholder || "Tap to upload file"}
      </Text>
      {!!name && !ro && (
        <Pressable onPress={() => onChange?.(field.name, null)} hitSlop={6}>
          <Ionicons name="close-circle" size={18} color={theme.muted} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: StyleSheet.hairlineWidth, borderStyle: "dashed",
    borderRadius: 10, paddingHorizontal: 12,
    minHeight: 56,
  },
  text: { flex: 1, fontSize: 14 },
});
