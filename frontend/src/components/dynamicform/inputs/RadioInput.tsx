import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function RadioInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const value = String(field.value ?? "");
  const options = field.options || [];
  return (
    <View style={styles.row} testID={`df-${field.name}`}>
      {options.map((opt) => {
        const selected = String(opt.value) === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => !ro && !opt.disabled && onChange?.(field.name, opt.value)}
            style={styles.opt}
          >
            <View
              style={[
                styles.outer,
                { borderColor: selected ? theme.brand : theme.border },
              ]}
            >
              {selected && (
                <View style={[styles.inner, { backgroundColor: theme.brand }]} />
              )}
            </View>
            <Text style={[styles.label, { color: theme.onSurface }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 16, alignItems: "center", minHeight: 42 },
  opt: { flexDirection: "row", alignItems: "center", gap: 8 },
  outer: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  inner: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 14 },
});
