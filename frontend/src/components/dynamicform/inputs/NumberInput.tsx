import React from "react";
import { TextInput as RNTextInput, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function NumberInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  return (
    <RNTextInput
      value={field.value === null || field.value === undefined ? "" : String(field.value)}
      onChangeText={(v) => {
        const cleaned = v.replace(/[^0-9.\-]/g, "");
        onChange?.(field.name, cleaned);
      }}
      placeholder={field.placeholder}
      placeholderTextColor={theme.muted}
      keyboardType="numeric"
      editable={!ro}
      style={[
        styles.input,
        {
          backgroundColor: ro ? theme.surfaceTertiary : theme.surfaceSecondary,
          color: theme.onSurface,
          borderColor: theme.border,
        },
      ]}
      testID={`df-${field.name}`}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 42,
  },
});
