import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING, RADIUS } from "@/src/theme/tokens";

export default function Splash() {
  const { theme } = useTheme();
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();

    const id = setTimeout(() => {
      router.replace("/login");
    }, 1600);

    return () => clearTimeout(id);
  }, [fade, scale, router]);

  return (
    <View
      style={[styles.root, { backgroundColor: theme.brand }]}
      testID="splash-screen"
    >
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: fade,
            transform: [{ scale }],
            backgroundColor: theme.surfaceSecondary,
          },
        ]}
      >
        <Ionicons name="boat" size={48} color={theme.brand} />
      </Animated.View>
      <Animated.Text
        style={[styles.title, { opacity: fade, color: "#FFFFFF" }]}
        testID="splash-title"
      >
        Marine
      </Animated.Text>
      <Animated.Text
        style={[styles.subtitle, { opacity: fade, color: "#E0F2FB" }]}
      >
        Sail through your day
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: SPACING.xs,
  },
});
