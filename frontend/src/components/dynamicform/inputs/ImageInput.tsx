import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function ImageInput({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
}) {
  const { theme } = useTheme();
  const ro = !!(field.readonly || field.disabled);
  const uri = typeof field.value === "string" ? field.value : "";

  return (
    <Pressable
      onPress={() =>
        !ro &&
        onChange?.(
          field.name,
          "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600",
        )
      }
      style={[
        styles.box,
        {
          backgroundColor: theme.surfaceSecondary,
          borderColor: theme.border,
          height: field.height ?? 140,
        },
      ]}
      testID={`df-${field.name}`}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={32} color={theme.muted} />
          <Text style={[styles.text, { color: theme.muted }]}>
            {field.placeholder || "Tap to add image"}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: StyleSheet.hairlineWidth, borderStyle: "dashed",
    borderRadius: 10, overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center", gap: 4 },
  text: { fontSize: 13 },
});
