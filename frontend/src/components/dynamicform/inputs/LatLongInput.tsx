import React from "react";
import { View, TextInput as RNTextInput, StyleSheet, Pressable, Text } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue, LatLongValue } from "../dynamicform.types";

export default function LatLongInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const mode = field.latLongMode || "latitude";
  const dirs = mode === "latitude" ? (["N", "S"] as const) : (["E", "W"] as const);

  const val: LatLongValue =
    field.value && typeof field.value === "object" && !Array.isArray(field.value)
      ? (field.value as LatLongValue)
      : {};

  const set = (patch: Partial<LatLongValue>) =>
    onChange?.(field.name, { ...val, ...patch } as any);

  const currentDir = val.dir || dirs[0];

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
        value={val.text || ""}
        onChangeText={(t) => set({ text: t })}
        placeholder={field.placeholder || "00000.000"}
        placeholderTextColor={theme.muted}
        editable={!ro}
        keyboardType="numeric"
        style={[styles.input, { color: theme.onSurface }]}
      />
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      {dirs.map((d) => {
        const active = currentDir === d;
        return (
          <Pressable
            key={d}
            onPress={() => !ro && set({ dir: d })}
            style={[
              styles.dir,
              active && { backgroundColor: theme.brand },
            ]}
          >
            <Text
              style={{
                color: active ? theme.onBrand : theme.onSurface,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              {d}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 10,
    paddingLeft: 12, paddingRight: 4,
    minHeight: 42,
  },
  input: { flex: 1, fontSize: 14, paddingVertical: 8 },
  divider: { width: StyleSheet.hairlineWidth, height: "60%", marginHorizontal: 4 },
  dir: {
    paddingHorizontal: 10, paddingVertical: 6,
    marginVertical: 4, marginLeft: 2,
    borderRadius: 6,
  },
});
