import React, { useState } from "react";
import { View, Text, TextInput as RNTextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function TagsInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const tags: string[] = Array.isArray(field.value)
    ? (field.value as any[]).map(String)
    : [];
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    onChange?.(field.name, [...tags, v]);
    setDraft("");
  };

  const remove = (t: string) =>
    onChange?.(field.name, tags.filter((x) => x !== t));

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
      testID={`df-${field.name}`}
    >
      {tags.map((t) => (
        <View
          key={t}
          style={[styles.chip, { backgroundColor: theme.brandTertiary }]}
        >
          <Text style={[styles.chipText, { color: theme.brand }]}>{t}</Text>
          {!ro && (
            <Pressable onPress={() => remove(t)} hitSlop={6}>
              <Ionicons name="close" size={14} color={theme.brand} />
            </Pressable>
          )}
        </View>
      ))}
      {!ro && (
        <RNTextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={add}
          onBlur={add}
          placeholder={field.placeholder || "Add tag"}
          placeholderTextColor={theme.muted}
          style={[styles.input, { color: theme.onSurface }]}
          returnKeyType="done"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 42,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: "600" },
  input: { flex: 1, minWidth: 80, paddingVertical: 4, fontSize: 13 },
});
