import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { VmsPageTemplate } from "@/src/components/VmsPageTemplate";
import DynamicForm from "@/src/components/dynamicform/DynamicForm";
import type {
  DynamicField,
  FieldValue,
} from "@/src/components/dynamicform/dynamicform.types";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SPACING } from "@/src/theme/tokens";

const OFF_HIRE_OPTIONS = [
  { label: "Completed Job", value: "COMPLETED" },
  { label: "Weather Delay", value: "WEATHER_DELAY" },
  { label: "Breakdown", value: "BREAKDOWN" },
  { label: "Owner Instruction", value: "OWNER_INSTRUCTION" },
  { label: "No Cargo", value: "NO_CARGO" },
  { label: "Port Delay", value: "PORT_DELAY" },
  { label: "Charterer Instruction", value: "CHARTERER_INSTRUCTION" },
  { label: "Other", value: "OTHER" },
];

export default function VmsNoonReport() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <VmsPageTemplate
        title="Noon Report"
        testIDPrefix="noon-report"
        onTopButtonPress={(i) => {
          if (i === 0) setFormOpen(true);
        }}
      />
      <NoonReportFormModal visible={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}

function NoonReportFormModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<Record<string, FieldValue>>({
    report_no: "NR-2026-0421",
    report_date: "2026-02-15",
    vessel_name: "MV Sea Falcon",
    vimo: "9876543",

    master_name: "",
    report_time: "",
    location_text: "",
    end_user: "",

    latitude_value: { text: "", dir: "N" },
    longitude_value: { text: "", dir: "E" },

    hire_status: "ON_HIRE",
    hire_date: "",
    client_name: "",
    hire_remarks: "",
    offhire_reason: "",

    cargo_tags: [],
    voyage_acknowledged: false,
    fuel_signature: null,
  });

  const onFieldChange = (name: string, value: FieldValue) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "hire_status") {
        if (value === "ON_HIRE") next.offhire_reason = "";
        else {
          next.hire_date = "";
          next.client_name = "";
        }
      }
      return next;
    });
  };

  const hireStatus = String(form.hire_status || "ON_HIRE").toUpperCase();

  const fields: DynamicField[] = useMemo(() => {
    const base: DynamicField[] = [
      { name: "report_header", type: "header", label: "Report Header" },
      { name: "report_header_space", type: "spacer", height: 4 },

      { name: "report_no", type: "label", label: "Report No", value: form.report_no, col: 6 },
      { name: "report_date", type: "label", label: "Report Date", value: form.report_date, col: 6 },
      { name: "vessel_name", type: "label", label: "Vessel", value: form.vessel_name, col: 6 },
      { name: "vimo", type: "label", label: "IMO", value: form.vimo, col: 6 },

      { name: "master_name", type: "text", label: "Master", value: form.master_name, placeholder: "Master name", required: true, col: 6 },
      { name: "report_time", type: "timepicker", label: "Time", value: form.report_time, col: 6 },
      { name: "location_text", type: "text", label: "Location", value: form.location_text, placeholder: "Port / Anchorage", col: 6 },
      { name: "end_user", type: "text", label: "End User", value: form.end_user, placeholder: "Client", col: 6 },

      { name: "latitude_value", type: "latlong", label: "Latitude", value: form.latitude_value, latLongMode: "latitude", placeholder: "07439.686", col: 6 },
      { name: "longitude_value", type: "latlong", label: "Longitude", value: form.longitude_value, latLongMode: "longitude", placeholder: "07439.686", col: 6 },

      { name: "hiring_status", type: "header", label: "Hiring Status" },
      { name: "hiring_status_space", type: "spacer", height: 4 },
      {
        name: "hire_status",
        type: "radio",
        label: "Hire Status",
        value: form.hire_status,
        options: [
          { label: "On Hire", value: "ON_HIRE" },
          { label: "Off Hire", value: "OFF_HIRE" },
        ],
        col: 12,
      },
    ];

    if (hireStatus === "ON_HIRE") {
      base.push(
        { name: "hire_date", type: "date", label: "Hire Date", value: form.hire_date, col: 6 },
        { name: "client_name", type: "text", label: "Client", value: form.client_name, col: 6 },
        { name: "hire_remarks", type: "textarea", label: "Remarks", value: form.hire_remarks, col: 12 },
      );
    } else {
      base.push(
        { name: "offhire_reason", type: "select", label: "Off Hire Reason", value: form.offhire_reason, options: OFF_HIRE_OPTIONS, col: 6 },
        { name: "hire_remarks", type: "textarea", label: "Remarks", value: form.hire_remarks, col: 12 },
      );
    }

    base.push(
      { name: "extras_header", type: "header", label: "Extras" },
      { name: "extras_space", type: "spacer", height: 4 },
      {
        name: "voyage_note",
        type: "note",
        label: "All entries auto-save as draft until you submit the report.",
        noteVariant: "info",
      },
      { name: "cargo_tags", type: "tags", label: "Cargo Tags", value: form.cargo_tags, placeholder: "Add tag", col: 12 },
      { name: "voyage_acknowledged", type: "checkbox", label: "Acknowledgement", value: form.voyage_acknowledged, placeholder: "I confirm the information is accurate", col: 12 },
      { name: "fuel_signature", type: "signature", label: "Master Signature", value: form.fuel_signature, col: 12 },
    );

    return base;
  }, [form, hireStatus]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.surface, paddingTop: insets.top }} testID="noon-report-form-modal">
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.divider, backgroundColor: theme.surface },
          ]}
        >
          <Pressable
            onPress={onClose}
            style={styles.iconBtn}
            hitSlop={8}
            testID="noon-report-form-close"
          >
            <Ionicons name="close" size={26} color={theme.onSurface} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.onSurface }]} numberOfLines={1}>
            Noon Report — New Entry
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.saveBtn, { backgroundColor: theme.brand }]}
            testID="noon-report-form-save"
          >
            <Text style={{ color: theme.onBrand, fontWeight: "700", fontSize: 13 }}>
              Save
            </Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: SPACING.lg,
              paddingHorizontal: SPACING.md,
              paddingBottom: insets.bottom + SPACING.xxl,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <DynamicForm layout={12} fields={fields} onChange={onFieldChange} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "700", marginHorizontal: SPACING.sm },
  saveBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 999,
  },
});
