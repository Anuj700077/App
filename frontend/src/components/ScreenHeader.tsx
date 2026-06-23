import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeProvider";
import { SPACING, RADIUS } from "../theme/tokens";

type Props = {
  title: string;
  rightSlot?: React.ReactNode;
  testIDPrefix?: string;
};

export function ScreenHeader({ title, rightSlot, testIDPrefix = "screen" }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: theme.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.divider,
      }}
    >
      <View style={styles.row}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={8}
          testID={`${testIDPrefix}-back-button`}
        >
          <Ionicons name="chevron-back" size={26} color={theme.onSurface} />
        </Pressable>
        <Text
          style={[styles.title, { color: theme.onSurface }]}
          numberOfLines={1}
          testID={`${testIDPrefix}-title`}
        >
          {title}
        </Text>
        <View style={styles.rightSlot}>{rightSlot}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    fontSize: 18,
    fontWeight: "600",
  },
  rightSlot: {
    minWidth: 44,
    alignItems: "flex-end",
  },
});
