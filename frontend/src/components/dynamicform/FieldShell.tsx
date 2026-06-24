import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";

type Props = {
  label?: string;
  required?: boolean;
  helperRight?: string;
  help?: boolean;
  helpText?: string;
  children: React.ReactNode;
};

export default function FieldShell({
  label,
  required,
  helperRight,
  help,
  helpText,
  children,
}: Props) {
  const { theme } = useTheme();
  return (
    <View>
      {(label || helperRight) && (
        <View style={styles.labelRow}>
          {!!label && (
            <Text style={[styles.label, { color: theme.onSurfaceTertiary }]}>
              {label}
              {required && <Text style={{ color: theme.error }}> *</Text>}
            </Text>
          )}
          {!!helperRight && (
            <Text style={[styles.helperRight, { color: theme.muted }]}>
              {helperRight}
            </Text>
          )}
        </View>
      )}
      {children}
      {help && !!helpText && (
        <Text style={[styles.help, { color: theme.muted }]}>{helpText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  helperRight: {
    fontSize: 11,
  },
  help: {
    fontSize: 11,
    marginTop: 4,
  },
});
