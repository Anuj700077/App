import React from "react";
import { TextInput as RNTextInput, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function TextInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const isPassword = field.type === "password";
  const isEmail = field.type === "email";
  return (
    <RNTextInput
      value={String(field.value ?? "")}
      onChangeText={(v) => onChange?.(field.name, v)}
      placeholder={field.placeholder}
      placeholderTextColor={theme.muted}
      secureTextEntry={isPassword}
      autoCapitalize={isEmail ? "none" : undefined}
      keyboardType={isEmail ? "email-address" : field.keyboardType || "default"}
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
