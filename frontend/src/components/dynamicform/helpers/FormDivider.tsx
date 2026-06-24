import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function FormDivider() {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.line,
        { backgroundColor: theme.divider },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
    marginVertical: 8,
  },
});
