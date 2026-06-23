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

export default function Signup() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.root} testID="signup-screen">
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={8}
          testID="signup-back-button"
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Set sail with Marine. It only takes a minute.
          </Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={theme.muted} />
            <TextInput
              testID="signup-email-input"
              placeholder="you@example.com"
              placeholderTextColor={theme.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>OTP</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="keypad-outline" size={18} color={theme.muted} />
            <TextInput
              testID="signup-otp-input"
              placeholder="6-digit code"
              placeholderTextColor={theme.muted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />
            <Pressable testID="signup-send-otp" hitSlop={6}>
              <Text style={styles.linkSmall}>Send OTP</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.muted} />
            <TextInput
              testID="signup-password-input"
              placeholder="Choose a password"
              placeholderTextColor={theme.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={6}
              testID="signup-toggle-password"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.muted}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace("/login")}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85 },
            ]}
            testID="signup-submit-button"
          >
            <Text style={styles.primaryBtnText}>Create account</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              onPress={() => router.replace("/login")}
              testID="signup-login-link"
            >
              <Text style={styles.link}> Login</Text>
            </Pressable>
          </View>
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
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.onSurfaceTertiary,
      marginBottom: SPACING.xs,
      marginTop: SPACING.sm,
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
      marginBottom: SPACING.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      color: theme.onSurface,
      fontSize: 15,
    },
    linkSmall: { color: theme.brand, fontSize: 13, fontWeight: "600" },
    primaryBtn: {
      backgroundColor: theme.brand,
      paddingVertical: SPACING.md + 2,
      borderRadius: RADIUS.md,
      alignItems: "center",
      marginTop: SPACING.lg,
    },
    primaryBtnText: {
      color: theme.onBrand,
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: SPACING.xl,
    },
    footerText: { color: theme.muted, fontSize: 14 },
    link: { color: theme.brand, fontWeight: "600", fontSize: 14 },
  });
}
