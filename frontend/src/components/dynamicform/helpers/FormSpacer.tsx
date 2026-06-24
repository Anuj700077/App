import React from "react";
import { View } from "react-native";

export default function FormSpacer({ height = 16 }: { height?: number }) {
  return <View style={{ width: "100%", height }} />;
}
