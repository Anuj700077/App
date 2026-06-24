import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type AccordionItem = {
  key: string;
  title: string;
  subtitle?: string;
  icon?: IoniconName;
  content: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Allow multiple sections expanded at once. Default: false */
  allowMultiple?: boolean;
  initiallyExpanded?: string[];
  onChange?: (expandedKeys: string[]) => void;
};

export default function Accordion({
  items,
  allowMultiple = false,
  initiallyExpanded = [],
  onChange,
}: AccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(initiallyExpanded);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      let next: string[];
      if (prev.includes(key)) {
        next = prev.filter((k) => k !== key);
      } else if (allowMultiple) {
        next = [...prev, key];
      } else {
        next = [key];
      }
      onChange?.(next);
      return next;
    });
  };

  return (
    <View testID="accordion">
      {items.map((item) => (
        <AccordionRow
          key={item.key}
          item={item}
          open={expanded.includes(item.key)}
          onToggle={() => !item.disabled && toggle(item.key)}
        />
      ))}
    </View>
  );
}

function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: AccordionItem;
  open: boolean;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const rotate = useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotate, {
      toValue: open ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open, rotate]);

  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
        open && { borderColor: theme.brand },
      ]}
      testID={`accordion-item-${item.key}`}
    >
      <Pressable
        onPress={onToggle}
        disabled={item.disabled}
        style={({ pressed }) => [
          styles.header,
          pressed && { backgroundColor: theme.surfaceTertiary },
          item.disabled && { opacity: 0.5 },
        ]}
        testID={`accordion-header-${item.key}`}
      >
        {!!item.icon && (
          <View style={[styles.iconBox, { backgroundColor: theme.brandTertiary }]}>
            <Ionicons name={item.icon} size={18} color={theme.brand} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.onSurface }]} numberOfLines={1}>
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text style={[styles.subtitle, { color: theme.muted }]} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
        </View>
        {item.badge !== undefined && (
          <View
            style={[styles.badge, { backgroundColor: theme.brandTertiary }]}
          >
            <Text style={{ color: theme.brand, fontSize: 11, fontWeight: "700" }}>
              {String(item.badge)}
            </Text>
          </View>
        )}
        <Animated.View style={{ transform: [{ rotate: rotateDeg }] }}>
          <Ionicons name="chevron-down" size={18} color={theme.muted} />
        </Animated.View>
      </Pressable>

      {open && (
        <View
          style={[styles.body, { borderTopColor: theme.divider }]}
          testID={`accordion-body-${item.key}`}
        >
          {item.content}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 14, fontWeight: "600" },
  subtitle: { fontSize: 12, marginTop: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginRight: 4,
  },
  body: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
