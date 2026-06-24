import React from "react";
import { View, Switch, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function ToggleInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  return (
    <View style={styles.row} testID={`df-${field.name}`}>
      <Switch
        value={!!field.value}
        onValueChange={(v) => onChange?.(field.name, v)}
        disabled={ro}
        trackColor={{ false: theme.surfaceTertiary, true: theme.brand }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 42, justifyContent: "center" },
});
