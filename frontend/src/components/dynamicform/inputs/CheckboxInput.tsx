import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function CheckboxInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const checked = !!field.value;
  return (
    <Pressable
      onPress={() => !ro && onChange?.(field.name, !checked)}
      style={styles.row}
      testID={`df-${field.name}`}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? theme.brand : theme.border,
            backgroundColor: checked ? theme.brand : "transparent",
          },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color={theme.onBrand} />}
      </View>
      {!!field.placeholder && (
        <Text style={[styles.text, { color: theme.onSurface }]}>
          {field.placeholder}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 42 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 14, flex: 1 },
});
