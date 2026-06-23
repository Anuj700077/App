import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.root} testID="forgot-password-screen">
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={8}
          testID="forgot-back-button"
        >
          <Ionicons name="chevron-back" size={26} color={theme.onSurface} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={28} color={theme.onBrand} />
          </View>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={theme.muted} />
            <TextInput
              testID="forgot-email-input"
              placeholder="you@example.com"
              placeholderTextColor={theme.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {sent && (
            <View style={styles.successBox} testID="forgot-success">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.success}
              />
              <Text style={[styles.successText, { color: theme.success }]}>
                Reset link sent! Check your inbox.
              </Text>
            </View>
          )}

          <Pressable
            onPress={() => setSent(true)}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85 },
            ]}
            testID="forgot-submit-button"
          >
            <Text style={styles.primaryBtnText}>Send reset link</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={styles.backToLogin}
            testID="forgot-back-to-login"
          >
            <Text style={styles.link}>Back to login</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.surface },
    topBar: {
      height: 56,
      paddingHorizontal: SPACING.md,
      justifyContent: "center",
    },
    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxl },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: RADIUS.lg,
      backgroundColor: theme.brand,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.onSurface,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: 14,
      color: theme.muted,
      marginBottom: SPACING.xl,
      lineHeight: 20,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.onSurfaceTertiary,
      marginBottom: SPACING.xs,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceSecondary,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      color: theme.onSurface,
      fontSize: 15,
    },
    successBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor: theme.brandTertiary,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      marginBottom: SPACING.lg,
    },
    successText: { fontSize: 13, fontWeight: "600" },
    primaryBtn: {
      backgroundColor: theme.brand,
      paddingVertical: SPACING.md + 2,
      borderRadius: RADIUS.md,
      alignItems: "center",
    },
    primaryBtnText: {
      color: theme.onBrand,
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    backToLogin: { alignSelf: "center", marginTop: SPACING.xl },
    link: { color: theme.brand, fontWeight: "600", fontSize: 14 },
  });
}
