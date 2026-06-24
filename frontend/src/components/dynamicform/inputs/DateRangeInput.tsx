import React from "react";
import { View, TextInput as RNTextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue, DateRangeValue } from "../dynamicform.types";

export default function DateRangeInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const val: DateRangeValue =
    field.value && typeof field.value === "object" && !Array.isArray(field.value)
      ? (field.value as DateRangeValue)
      : {};

  const set = (patch: Partial<DateRangeValue>) => {
    onChange?.(field.name, { ...val, ...patch } as any);
  };

  return (
    <View style={styles.row} testID={`df-${field.name}`}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: ro ? theme.surfaceTertiary : theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <RNTextInput
          value={val.from || ""}
          onChangeText={(t) => set({ from: t })}
          placeholder="From"
          placeholderTextColor={theme.muted}
          editable={!ro}
          style={[styles.input, { color: theme.onSurface }]}
        />
        <Ionicons name="calendar-outline" size={16} color={theme.muted} />
      </View>
      <Text style={{ color: theme.muted, marginHorizontal: 4 }}>→</Text>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: ro ? theme.surfaceTertiary : theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <RNTextInput
          value={val.to || ""}
          onChangeText={(t) => set({ to: t })}
          placeholder="To"
          placeholderTextColor={theme.muted}
          editable={!ro}
          style={[styles.input, { color: theme.onSurface }]}
        />
        <Ionicons name="calendar-outline" size={16} color={theme.muted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  pill: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 10,
    paddingHorizontal: 10, minHeight: 42,
  },
  input: { flex: 1, fontSize: 13, paddingVertical: 8 },
});
