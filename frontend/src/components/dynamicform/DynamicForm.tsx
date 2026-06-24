import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import FieldShell from "./FieldShell";
import FieldRenderer from "./FieldRenderer";

import FormHeader from "./helpers/FormHeader";
import FormNote from "./helpers/FormNote";
import FormDivider from "./helpers/FormDivider";
import FormSpacer from "./helpers/FormSpacer";

import { getFieldWidthStyle } from "./dynamicform.utils";
import type {
  DropdownMode,
  DropdownStatus,
  DynamicField,
  DynamicFormProps,
} from "./dynamicform.types";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useDropdowns } from "./dropdowns/useDropdowns";

export default function DynamicForm({
  fields,
  onChange,
  layout = 12,
  onDropdownStateChange,
}: DynamicFormProps) {
  const { theme } = useTheme();

  const dropdownReqs = useMemo(() => {
    const reqs: { key: string; status: DropdownStatus; mode?: DropdownMode }[] = [];
    for (const f of fields as any[]) {
      const t = f?.type;
      const isSelect = t === "select" || t === "multiselect" || t === "combo";
      if (!isSelect) continue;
      const hasOptions = Array.isArray(f?.options) && f.options.length > 0;
      if (hasOptions) continue;
      const key = String(f?.dropdownKey || "").trim();
      if (!key) continue;
      const status = (String(f?.dropdownStatus || "active").trim() as DropdownStatus) || "active";
      const mode = (f?.dropdownMode as DropdownMode) || "label";
      reqs.push({ key, status, mode });
    }
    const seen = new Set<string>();
    return reqs.filter((r) => {
      const k = `${r.status}:${r.mode ?? "label"}:${r.key}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [fields]);

  const { byKey, emptyKeys, missingKeys, loading, error } = useDropdowns(dropdownReqs);

  useEffect(() => {
    onDropdownStateChange?.({
      emptyKeys,
      missingKeys,
      loading,
      error: error || undefined,
    });
  }, [emptyKeys, missingKeys, loading, error, onDropdownStateChange]);

  const hydratedFields = useMemo(() => {
    return (fields as any[]).map((f) => {
      const t = f?.type;
      const isSelect = t === "select" || t === "multiselect" || t === "combo";
      if (!isSelect) return f;
      if (Array.isArray(f?.options) && f.options.length) return f;
      const key = String(f?.dropdownKey || "").trim();
      if (!key) return f;
      const opts = byKey[key] || [];
      return { ...f, options: opts, _dropdownLoading: loading && opts.length === 0 };
    }) as DynamicField[];
  }, [fields, byKey, loading]);

  useEffect(() => {
    if (!onChange) return;
    for (const f of hydratedFields as any[]) {
      const t = f?.type;
      const isSingleSelect = t === "select" || t === "combo";
      if (!isSingleSelect) continue;
      if (!f?.setFirstValue) continue;
      if (f?.readonly || f?.disabled) continue;
      const current = String(f?.value || "").trim();
      if (current) continue;
      const first = Array.isArray(f?.options) ? f.options[0] : null;
      const firstValue = String(first?.value || "").trim();
      if (firstValue) onChange(String(f.name), firstValue);
    }
  }, [hydratedFields, onChange]);

  return (
    <View style={styles.wrap}>
      {hydratedFields.map((field) => {
        const key = String((field as any).name);

        if ((field as any).type === "header") {
          return <FormHeader key={key} field={field as any} />;
        }
        if ((field as any).type === "paragraph") {
          return (
            <View key={key} style={styles.fullWidth}>
              <Text style={[styles.paragraph, { color: theme.onSurfaceTertiary }]}>
                {(field as any).label}
              </Text>
            </View>
          );
        }
        if ((field as any).type === "divider") {
          return <FormDivider key={key} />;
        }
        if ((field as any).type === "spacer") {
          return <FormSpacer key={key} height={(field as any).height ?? 16} />;
        }
        if ((field as any).type === "note") {
          return <FormNote key={key} field={field as any} />;
        }
        if ((field as any).type === "checklist") {
          return (
            <View key={key} style={styles.fullWidth}>
              <FieldRenderer field={field as any} onChange={onChange} />
            </View>
          );
        }

        return (
          <View
            key={key}
            style={[styles.item, getFieldWidthStyle(field as DynamicField, layout)]}
          >
            <FieldShell
              label={(field as any).label}
              required={(field as any).required}
              helperRight={(field as any).helperRight}
              help={(field as any).help}
              helpText={(field as any).helpText}
            >
              <FieldRenderer field={field as any} onChange={onChange} />
            </FieldShell>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  item: { paddingHorizontal: 8, marginBottom: 18 },
  fullWidth: { width: "100%", paddingHorizontal: 8, marginBottom: 18 },
  paragraph: { fontSize: 13, lineHeight: 20 },
});
