import React, { useMemo, useState } from "react";
import {
  View, Text, Pressable, Modal, ScrollView, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function SelectInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const multi = field.type === "multiselect";
  const [open, setOpen] = useState(false);

  const options = field.options || [];

  const selectedValues = useMemo(() => {
    if (multi) {
      if (Array.isArray(field.value)) return field.value.map(String);
      return [];
    }
    const v = field.value;
    return v ? [String(v)] : [];
  }, [field.value, multi]);

  const displayText = useMemo(() => {
    if (!selectedValues.length) return field.placeholder || "Select...";
    const labels = options
      .filter((o) => selectedValues.includes(String(o.value)))
      .map((o) => o.label);
    return labels.join(", ") || selectedValues.join(", ");
  }, [selectedValues, options, field.placeholder]);

  const toggleValue = (val: string) => {
    if (multi) {
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      onChange?.(field.name, next);
    } else {
      onChange?.(field.name, val);
      setOpen(false);
    }
  };

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
            {
              color: selectedValues.length ? theme.onSurface : theme.muted,
            },
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.muted} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={[styles.backdrop, { backgroundColor: theme.scrim }]} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => {}}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.onSurface }]}>
                {field.label || "Select"}
              </Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={20} color={theme.onSurface} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 360 }}>
              {options.length === 0 && (
                <Text style={{ color: theme.muted, padding: 16 }}>
                  {field._dropdownLoading ? "Loading..." : "No options"}
                </Text>
              )}
              {options.map((opt) => {
                const selected = selectedValues.includes(String(opt.value));
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => !opt.disabled && toggleValue(String(opt.value))}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && { backgroundColor: theme.surfaceTertiary },
                      opt.disabled && { opacity: 0.4 },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: theme.onSurface }]}>
                      {opt.label}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={18} color={theme.brand} />
                    )}
                  </Pressable>
                );
              })}
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
    padding: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 16, fontWeight: "700" },
  option: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(127,127,127,0.15)",
  },
  optionText: { fontSize: 14 },
});
