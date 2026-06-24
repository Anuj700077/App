import React from "react";
import { View, Pressable, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import type { DynamicField, FieldValue } from "../dynamicform.types";

export default function AvatarInput({
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
    <View style={styles.wrap} testID={`df-${field.name}`}>
      <Pressable
        onPress={() =>
          !ro &&
          onChange?.(
            field.name,
            "https://images.pexels.com/photos/35129368/pexels-photo-35129368.jpeg?auto=compress&cs=tinysrgb&w=400",
          )
        }
        style={[styles.avatar, { backgroundColor: theme.brandTertiary }]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <Ionicons name="person" size={32} color={theme.brand} />
        )}
        {!ro && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.brand, borderColor: theme.surface },
            ]}
          >
            <Ionicons name="camera" size={12} color={theme.onBrand} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "flex-start" },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  badge: {
    position: "absolute", right: -2, bottom: -2,
    width: 26, height: 26, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2,
  },
});
