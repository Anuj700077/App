import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type SimpleTab = {
  key: string;
  label: string;
  icon?: IoniconName;
  content: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
};

export type SimpleTabsProps = {
  tabs: SimpleTab[];
  initialKey?: string;
  onChange?: (key: string) => void;
  /** "underline" (default) or "pill" */
  variant?: "underline" | "pill";
  scrollable?: boolean;
};

export default function SimpleTabs({
  tabs,
  initialKey,
  onChange,
  variant = "underline",
  scrollable = true,
}: SimpleTabsProps) {
  const { theme } = useTheme();
  const [activeKey, setActiveKey] = useState<string>(
    initialKey || tabs[0]?.key || "",
  );
  const fade = useRef(new Animated.Value(1)).current;

  const setActive = (key: string) => {
    if (key === activeKey) return;
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 90, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setActiveKey(key);
    onChange?.(key);
  };

  const activeTab = tabs.find((t) => t.key === activeKey) || tabs[0];

  const StripWrap: any = scrollable ? ScrollView : View;
  const stripProps = scrollable
    ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.stripContent,
      }
    : {
        style: [styles.stripContent, { flexDirection: "row" as const }],
      };

  return (
    <View testID="simple-tabs">
      <View
        style={[
          styles.strip,
          { borderBottomColor: variant === "underline" ? theme.divider : "transparent" },
        ]}
      >
        <StripWrap {...stripProps}>
          {tabs.map((t) => {
            const active = t.key === activeKey;
            const tint = active ? theme.brand : theme.muted;
            return (
              <Pressable
                key={t.key}
                onPress={() => !t.disabled && setActive(t.key)}
                disabled={t.disabled}
                style={({ pressed }) => [
                  variant === "pill"
                    ? [
                        styles.pillItem,
                        {
                          backgroundColor: active
                            ? theme.brand
                            : theme.surfaceTertiary,
                        },
                      ]
                    : styles.underlineItem,
                  pressed && { opacity: 0.85 },
                  t.disabled && { opacity: 0.4 },
                ]}
                testID={`tab-${t.key}`}
              >
                {!!t.icon && (
                  <Ionicons
                    name={t.icon}
                    size={16}
                    color={variant === "pill" && active ? theme.onBrand : tint}
                  />
                )}
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        variant === "pill" && active
                          ? theme.onBrand
                          : tint,
                      fontWeight: active ? "700" : "500",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
                {t.badge !== undefined && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          variant === "pill" && active
                            ? theme.onBrand
                            : theme.brand,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          variant === "pill" && active
                            ? theme.brand
                            : theme.onBrand,
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      {String(t.badge)}
                    </Text>
                  </View>
                )}
                {variant === "underline" && active && (
                  <View
                    style={[styles.underline, { backgroundColor: theme.brand }]}
                  />
                )}
              </Pressable>
            );
          })}
        </StripWrap>
      </View>

      <Animated.View style={{ opacity: fade }} testID={`tab-content-${activeKey}`}>
        {activeTab?.content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stripContent: {
    gap: 4,
    paddingHorizontal: 4,
  },
  underlineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: "relative",
  },
  pillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginVertical: 6,
  },
  label: { fontSize: 13 },
  underline: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: -StyleSheet.hairlineWidth,
    height: 2.5,
    borderRadius: 2,
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
});
