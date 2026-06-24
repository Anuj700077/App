import React from "react";
import { View, TextInput as RNTextInput, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function ColorInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const v = String(field.value ?? "");
  const isHex = /^#([0-9a-f]{3}){1,2}$/i.test(v);
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
      testID={`df-${field.name}`}
    >
      <View
        style={[
          styles.swatch,
          { backgroundColor: isHex ? v : theme.surfaceTertiary, borderColor: theme.border },
        ]}
      />
      <RNTextInput
        value={v}
        onChangeText={(t) => onChange?.(field.name, t)}
        placeholder={field.placeholder || "#0288D1"}
        placeholderTextColor={theme.muted}
        autoCapitalize="none"
        editable={!ro}
        style={[styles.input, { color: theme.onSurface }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 8,
    minHeight: 42,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14 },
});
