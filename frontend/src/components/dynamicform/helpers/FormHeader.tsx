import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField } from "../dynamicform.types";

const SIZES: Record<string, number> = {
  h1: 24, h2: 20, h3: 18, h4: 16, h5: 14, h6: 12,
};

export default function FormHeader({ field }: { field: DynamicField }) {
  const { theme } = useTheme();
  const level = field.headerLevel || "h3";
  return (
    <View style={[styles.wrap, { borderBottomColor: theme.divider }]}>
      <Text
        style={[
          styles.title,
          { fontSize: SIZES[level], color: theme.onSurface },
        ]}
      >
        {field.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 6,
    marginTop: 4,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontWeight: "700" },
});
