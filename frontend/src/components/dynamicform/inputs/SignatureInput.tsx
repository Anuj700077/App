import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function SignatureInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const signed = !!field.value;

  return (
    <Pressable
      onPress={() => !ro && onChange?.(field.name, signed ? null : "mock-signature")}
      style={[
        styles.box,
        {
          backgroundColor: theme.surfaceSecondary,
          borderColor: signed ? theme.brand : theme.border,
        },
      ]}
      testID={`df-${field.name}`}
    >
      <Ionicons
        name={signed ? "checkmark-circle" : "create-outline"}
        size={22}
        color={signed ? theme.success : theme.brand}
      />
      <Text
        style={[
          styles.text,
          { color: signed ? theme.success : theme.onSurfaceTertiary },
        ]}
      >
        {signed ? "Signature captured" : "Tap to sign"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1, borderStyle: "dashed",
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 64,
  },
  text: { fontSize: 14, fontWeight: "500" },
});
