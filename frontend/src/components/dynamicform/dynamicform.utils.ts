import type { DynamicField } from "./dynamicform.types";

export function getFieldWidthStyle(
  field: DynamicField,
  layout: 12 | 8 | 6 = 12,
) {
  const col = Math.min(Math.max(Number(field.col || layout), 1), layout);
  const pct = (col / layout) * 100;
  return { width: `${pct}%` as `${number}%` };
}

export function toDisplayString(v: any): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.join(", ");
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}
