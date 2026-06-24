import React, { useMemo, useState } from "react";
import {
  View, Text, Pressable, Modal, ScrollView, StyleSheet, TextInput as RNTextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function ComboSelectInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const options = field.options || [];
  const value = String(field.value ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q),
    );
  }, [options, query]);

  const selectedLabel =
    options.find((o) => String(o.value) === value)?.label ||
    (value ? value : "");

  return (
    <>
      <Pressable
        onPress={() => !ro && setOpen(true)}
        style={[
          styles.field,
          {
            backgroundColor: ro ? theme.surfaceTertiary : theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
        testID={`df-${field.name}`}
      >
        <Text
          style={[
            styles.fieldText,
            { color: selectedLabel ? theme.onSurface : theme.muted },
          ]}
          numberOfLines={1}
        >
          {selectedLabel || field.placeholder || "Select..."}
        </Text>
        <Ionicons name="search" size={16} color={theme.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: theme.scrim }]}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => {}}
          >
            <View
              style={[
                styles.searchRow,
                { backgroundColor: theme.surfaceTertiary, borderColor: theme.border },
              ]}
            >
              <Ionicons name="search" size={16} color={theme.muted} />
              <RNTextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                placeholderTextColor={theme.muted}
                style={[styles.searchInput, { color: theme.onSurface }]}
                autoFocus
              />
            </View>
            <ScrollView style={{ maxHeight: 360 }}>
              {filtered.length === 0 && (
                <Text style={{ color: theme.muted, padding: 16 }}>No matches</Text>
              )}
              {filtered.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange?.(field.name, opt.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && { backgroundColor: theme.surfaceTertiary },
                  ]}
                >
                  <Text style={[styles.optionText, { color: theme.onSurface }]}>
                    {opt.label}
                  </Text>
                  {String(opt.value) === value && (
                    <Ionicons name="checkmark" size={18} color={theme.brand} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 42,
    gap: 8,
  },
  fieldText: { flex: 1, fontSize: 14 },
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 16, paddingBottom: 32,
  },
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 10, borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10, paddingVertical: 6,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 4 },
  option: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(127,127,127,0.15)",
  },
  optionText: { fontSize: 14 },
});
