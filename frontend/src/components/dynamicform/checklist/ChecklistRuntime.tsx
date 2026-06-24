import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

type Item = { key: string; label: string; checked?: boolean };

export default function ChecklistRuntime({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const items: Item[] = Array.isArray(field.value)
    ? (field.value as any[])
    : (field.options || []).map((o) => ({
        key: String(o.value),
        label: o.label,
        checked: false,
      }));

  const toggle = (k: string) => {
    if (ro) return;
    const next = items.map((it) =>
      it.key === k ? { ...it, checked: !it.checked } : it,
    );
    onChange?.(field.name, next as any);
  };

  return (
    <View testID={`df-${field.name}`}>
      {!!field.label && (
        <Text style={[styles.title, { color: theme.onSurface }]}>{field.label}</Text>
      )}
      {items.map((it) => (
        <Pressable
          key={it.key}
          onPress={() => toggle(it.key)}
          style={[
            styles.row,
            { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.box,
              {
                borderColor: it.checked ? theme.brand : theme.border,
                backgroundColor: it.checked ? theme.brand : "transparent",
              },
            ]}
          >
            {it.checked && (
              <Ionicons name="checkmark" size={14} color={theme.onBrand} />
            )}
          </View>
          <Text style={[styles.text, { color: theme.onSurface }]}>{it.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 10,
    marginBottom: 6,
  },
  box: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  text: { fontSize: 14, flex: 1 },
});
