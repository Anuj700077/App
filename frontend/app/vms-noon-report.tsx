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
import { TabPageView } from "@/src/components/simpletabs";
import { Accordion } from "@/src/components/accordion";
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
  const [tabsOpen, setTabsOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);

  return (
    <>
      <VmsPageTemplate
        title="Noon Report"
        testIDPrefix="noon-report"
        onTopButtonPress={(i) => {
          if (i === 0) setFormOpen(true);
          else if (i === 1) setTabsOpen(true);
          else if (i === 2) setAccOpen(true);
        }}
      />
      <NoonReportFormModal visible={formOpen} onClose={() => setFormOpen(false)} />
      <NoonReportTabsModal visible={tabsOpen} onClose={() => setTabsOpen(false)} />
      <NoonReportAccordionModal visible={accOpen} onClose={() => setAccOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Form modal (button1)                                               */
/* ------------------------------------------------------------------ */

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
      { name: "voyage_note", type: "note", label: "All entries auto-save as draft until you submit the report.", noteVariant: "info" },
      { name: "cargo_tags", type: "tags", label: "Cargo Tags", value: form.cargo_tags, placeholder: "Add tag", col: 12 },
      { name: "voyage_acknowledged", type: "checkbox", label: "Acknowledgement", value: form.voyage_acknowledged, placeholder: "I confirm the information is accurate", col: 12 },
      { name: "fuel_signature", type: "signature", label: "Master Signature", value: form.fuel_signature, col: 12 },
    );
    return base;
  }, [form, hireStatus]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.surface, paddingTop: insets.top }} testID="noon-report-form-modal">
        <ModalHeader theme={theme} title="Noon Report — New Entry" onClose={onClose} testIDPrefix="noon-report-form" />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
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

/* ------------------------------------------------------------------ */
/* Tabs modal (button2)                                               */
/* ------------------------------------------------------------------ */

function NoonReportTabsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const tabs = useMemo(
    () => [
      {
        key: "voyage",
        label: "Voyage",
        icon: "navigate-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "Departure", v: "Singapore" },
              { k: "Destination", v: "Rotterdam" },
              { k: "ETA", v: "Mar 12, 2026" },
              { k: "Speed", v: "12.4 kn" },
              { k: "Course", v: "045°" },
            ]}
          />
        ),
      },
      {
        key: "cargo",
        label: "Cargo",
        icon: "cube-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "Type", v: "Container" },
              { k: "TEU", v: "8,140" },
              { k: "Reefer plugs", v: "246" },
              { k: "Hazardous", v: "12 units" },
            ]}
          />
        ),
      },
      {
        key: "crew",
        label: "Crew",
        icon: "people-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "Master", v: "Capt. R. Singh" },
              { k: "Chief Officer", v: "M. Alvarez" },
              { k: "Chief Engineer", v: "K. Tanaka" },
              { k: "Total onboard", v: "21" },
            ]}
          />
        ),
      },
      {
        key: "logs",
        label: "Logs",
        icon: "list-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "10:24", v: "Position update sent" },
              { k: "08:00", v: "Watch changed" },
              { k: "06:30", v: "Aux engine #2 stopped" },
              { k: "05:15", v: "Drill briefing complete" },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <TabPageView
        tabs={tabs}
        title="Noon Report"
        onClose={onClose}
        onSave={(key) => console.log("save", key)}
        onSaveAndNext={(cur, next) => console.log("save-next", cur, "→", next)}
        onSubmit={(key) => {
          console.log("submit", key);
          onClose();
        }}
      />
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion modal (button3)                                          */
/* ------------------------------------------------------------------ */

function NoonReportAccordionModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const items = useMemo(
    () => [
      {
        key: "summary",
        title: "Daily Summary",
        subtitle: "12.4 kn · 045° · 142 nm",
        icon: "stats-chart-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "Distance run (24h)", v: "298 nm" },
              { k: "Avg speed", v: "12.4 kn" },
              { k: "Remaining to port", v: "1,820 nm" },
              { k: "ETA", v: "Mar 12, 2026 06:00" },
            ]}
          />
        ),
      },
      {
        key: "fuel",
        title: "Fuel Consumption",
        subtitle: "ROB 1,240 MT",
        icon: "flame-outline" as const,
        badge: "↓ 4%",
        content: (
          <InfoList
            rows={[
              { k: "HFO consumed", v: "22.1 MT" },
              { k: "MGO consumed", v: "3.4 MT" },
              { k: "Lube oil", v: "120 L" },
              { k: "Fresh water", v: "8.6 MT" },
            ]}
          />
        ),
      },
      {
        key: "weather",
        title: "Weather",
        subtitle: "Force 4 · SW",
        icon: "cloudy-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "Wind", v: "SW · 16 kn" },
              { k: "Sea state", v: "Moderate" },
              { k: "Swell", v: "1.8 m" },
              { k: "Visibility", v: "Good" },
              { k: "Air temp", v: "27 °C" },
            ]}
          />
        ),
      },
      {
        key: "position",
        title: "Position History",
        subtitle: "Last 24 hours",
        icon: "compass-outline" as const,
        content: (
          <InfoList
            rows={[
              { k: "12:00", v: "07439.686 N / 07439.686 E" },
              { k: "06:00", v: "07512.220 N / 07412.901 E" },
              { k: "00:00", v: "07585.110 N / 07385.012 E" },
            ]}
          />
        ),
      },
      {
        key: "remarks",
        title: "Master's Remarks",
        icon: "create-outline" as const,
        content: (
          <Text style={{ fontSize: 13, lineHeight: 20, color: theme.onSurfaceTertiary }}>
            All systems nominal. Smooth weather expected for next 12h.
            Aux #2 maintenance complete; back online at 10:42.
          </Text>
        ),
      },
    ],
    [theme.onSurfaceTertiary],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.surface, paddingTop: insets.top }} testID="noon-report-accordion-modal">
        <ModalHeader theme={theme} title="Noon Report — Details" onClose={onClose} testIDPrefix="noon-report-accordion" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: SPACING.lg,
            paddingBottom: insets.bottom + SPACING.xxl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Accordion items={items} initiallyExpanded={["summary"]} />
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Local helpers                                                      */
/* ------------------------------------------------------------------ */

function InfoList({ rows }: { rows: { k: string; v: string }[] }) {
  const { theme } = useTheme();
  return (
    <View style={{ padding: SPACING.md }}>
      {rows.map((r, i) => (
        <View
          key={i}
          style={[
            styles.infoRow,
            i < rows.length - 1 && {
              borderBottomColor: theme.divider,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <Text style={[styles.infoKey, { color: theme.muted }]}>{r.k}</Text>
          <Text style={[styles.infoVal, { color: theme.onSurface }]}>{r.v}</Text>
        </View>
      ))}
    </View>
  );
}

function ModalHeader({
  theme,
  title,
  onClose,
  testIDPrefix,
}: {
  theme: any;
  title: string;
  onClose: () => void;
  testIDPrefix: string;
}) {
  return (
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
        testID={`${testIDPrefix}-close`}
      >
        <Ionicons name="close" size={26} color={theme.onSurface} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: theme.onSurface }]} numberOfLines={1}>
        {title}
      </Text>
      <Pressable
        onPress={onClose}
        style={[styles.saveBtn, { backgroundColor: theme.brand }]}
        testID={`${testIDPrefix}-save`}
      >
        <Text style={{ color: theme.onBrand, fontWeight: "700", fontSize: 13 }}>
          Done
        </Text>
      </Pressable>
    </View>
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm + 2,
  },
  infoKey: { fontSize: 13 },
  infoVal: { fontSize: 13, fontWeight: "600" },
});
