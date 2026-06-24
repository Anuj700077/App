import React from "react";
import { View, TextInput as RNTextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function TimePickerInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: ro ? theme.surfaceTertiary : theme.surfaceSecondary,
          borderColor: theme.border,
        },
      ]}
      testID={`df-${field.name}`}
    >
      <RNTextInput
        value={String(field.value ?? "")}
        onChangeText={(v) => onChange?.(field.name, v)}
        placeholder={field.placeholder || "HH:MM"}
        placeholderTextColor={theme.muted}
        editable={!ro}
        style={[styles.input, { color: theme.onSurface }]}
      />
      <Ionicons name="time-outline" size={18} color={theme.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 42, gap: 8,
  },
  input: { flex: 1, fontSize: 14, paddingVertical: 8 },
});
