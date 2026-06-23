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

export default function Login() {
  const { theme, toggle, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={styles.root} testID="login-screen">
      <Pressable
        onPress={toggle}
        style={styles.themeToggle}
        testID="login-theme-toggle"
      >
        <Ionicons
          name={isDark ? "sunny-outline" : "moon-outline"}
          size={20}
          color={theme.onSurface}
        />
      </Pressable>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="boat" size={28} color={theme.onBrand} />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Marine</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={theme.muted} />
            <TextInput
              testID="login-email-input"
              placeholder="you@example.com"
              placeholderTextColor={theme.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {/* OTP */}
          <Text style={styles.label}>OTP</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="keypad-outline" size={18} color={theme.muted} />
            <TextInput
              testID="login-otp-input"
              placeholder="6-digit code"
              placeholderTextColor={theme.muted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />
            <Pressable testID="login-send-otp" hitSlop={6}>
              <Text style={styles.linkSmall}>Send OTP</Text>
            </Pressable>
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.muted} />
            <TextInput
              testID="login-password-input"
              placeholder="Enter your password"
              placeholderTextColor={theme.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={6}
              testID="login-toggle-password"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={theme.muted}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/forgot-password")}
            style={styles.forgotRow}
            testID="login-forgot-link"
          >
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/main")}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85 },
            ]}
            testID="login-submit-button"
          >
            <Text style={styles.primaryBtnText}>Login</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Pressable
              onPress={() => router.push("/signup")}
              testID="login-signup-link"
            >
              <Text style={styles.link}> Sign up</Text>
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
    themeToggle: {
      position: "absolute",
      top: 56,
      right: SPACING.lg,
      zIndex: 1,
      width: 40,
      height: 40,
      borderRadius: RADIUS.pill,
      backgroundColor: theme.surfaceSecondary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    scroll: {
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xxl,
      paddingBottom: SPACING.xxl,
    },
    logoCircle: {
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
    linkSmall: {
      color: theme.brand,
      fontSize: 13,
      fontWeight: "600",
    },
    forgotRow: {
      alignSelf: "flex-end",
      marginTop: SPACING.xs,
      marginBottom: SPACING.lg,
    },
    link: { color: theme.brand, fontWeight: "600", fontSize: 14 },
    primaryBtn: {
      backgroundColor: theme.brand,
      paddingVertical: SPACING.md + 2,
      borderRadius: RADIUS.md,
      alignItems: "center",
      marginTop: SPACING.sm,
    },
    primaryBtnText: {
      color: theme.onBrand,
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: SPACING.xl,
      gap: SPACING.sm,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
    },
    dividerText: { color: theme.muted, fontSize: 12 },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    footerText: { color: theme.muted, fontSize: 14 },
  });
}
