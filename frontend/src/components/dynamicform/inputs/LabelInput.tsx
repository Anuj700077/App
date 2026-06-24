import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField } from "../dynamicform.types";
import { toDisplayString } from "../dynamicform.utils";

export default function LabelInput({ field }: { field: DynamicField }) {
  const { theme } = useTheme();
  const text = toDisplayString(field.value) || "—";
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.surfaceTertiary, borderColor: theme.border },
      ]}
      testID={`df-${field.name}`}
    >
      <Text style={[styles.text, { color: theme.onSurface }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 42,
    justifyContent: "center",
  },
  text: { fontSize: 14, fontWeight: "500" },
});
