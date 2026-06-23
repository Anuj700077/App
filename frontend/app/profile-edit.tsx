import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function ProfileEdit() {
  const { theme } = useTheme();
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [bio, setBio] = useState("Designer and product builder. Loves the ocean.");
  const [phone, setPhone] = useState("+1 (555) 123-4567");

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }} testID="profile-edit-screen">
      <ScreenHeader
        title="Edit Profile"
        testIDPrefix="profile-edit"
        rightSlot={
          <Pressable testID="profile-edit-save">
            <Text style={{ color: theme.brand, fontWeight: "700", fontSize: 14 }}>Save</Text>
          </Pressable>
        }
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: "https://images.pexels.com/photos/35129368/pexels-photo-35129368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" }}
              style={styles.avatar}
            />
            <Pressable
              style={[styles.avatarEdit, { backgroundColor: theme.brand, borderColor: theme.surface }]}
              testID="profile-edit-change-photo"
            >
              <Ionicons name="camera" size={16} color={theme.onBrand} />
            </Pressable>
          </View>

          {[
            { key: "name", label: "Full name", value: name, set: setName, multi: false },
            { key: "email", label: "Email", value: email, set: setEmail, multi: false },
            { key: "phone", label: "Phone", value: phone, set: setPhone, multi: false },
            { key: "bio", label: "Bio", value: bio, set: setBio, multi: true },
          ].map((f) => (
            <View key={f.key} style={{ marginBottom: SPACING.md }}>
              <Text style={[styles.label, { color: theme.onSurfaceTertiary }]}>{f.label}</Text>
              <TextInput
                value={f.value}
                onChangeText={f.set}
                multiline={f.multi}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    color: theme.onSurface,
                    borderColor: theme.border,
                    height: f.multi ? 90 : 48,
                    textAlignVertical: f.multi ? "top" : "center",
                  },
                ]}
                placeholderTextColor={theme.muted}
                testID={`profile-edit-input-${f.key}`}
              />
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignSelf: "center", marginVertical: SPACING.lg },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarEdit: {
    position: "absolute", right: -4, bottom: -4,
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3,
  },
  label: {
    fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  input: {
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth, fontSize: 15,
  },
});
