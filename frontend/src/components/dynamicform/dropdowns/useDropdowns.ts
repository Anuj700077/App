import type { DropdownMode, DropdownStatus, DynamicOption } from "../dynamicform.types";

/**
 * Stubbed hook — no backend integration.
 * Always returns empty for any requested key.
 * Fields that supply `options` directly do not need this.
 */
export function useDropdowns(
  reqs: { key: string; status: DropdownStatus; mode?: DropdownMode }[],
) {
  const byKey: Record<string, DynamicOption[]> = {};
  for (const r of reqs) byKey[r.key] = [];
  return {
    byKey,
    emptyKeys: reqs.map((r) => r.key),
    missingKeys: reqs.map((r) => r.key),
    loading: false,
    error: null as string | null,
  };
}
