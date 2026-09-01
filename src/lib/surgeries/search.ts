import { normalizeSearchText } from "@/lib/medications/normalize";
import { SURGERY_CATALOG } from "./catalog";
import type { SurgeryReference, SurgerySearchResult } from "./types";

function matchesQuery(normalizedQuery: string, label: string): boolean {
  return normalizeSearchText(label).includes(normalizedQuery);
}

function scoreMatch(normalizedQuery: string, label: string): number {
  const normalized = normalizeSearchText(label);
  if (normalized === normalizedQuery) return 0;
  if (normalized.startsWith(normalizedQuery)) return 1;
  return 2;
}

export function searchSurgeries(
  query: string,
  options?: { limit?: number },
): SurgerySearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const limit = options?.limit ?? 8;
  const results: SurgerySearchResult[] = [];
  const seen = new Set<string>();

  for (const surgery of SURGERY_CATALOG) {
    if (matchesQuery(normalizedQuery, surgery.shortLabel)) {
      if (!seen.has(surgery.id)) {
        seen.add(surgery.id);
        results.push({
          surgery,
          matchedOn: "shortLabel",
          matchedLabel: surgery.shortLabel,
        });
      }
      continue;
    }

    if (matchesQuery(normalizedQuery, surgery.label)) {
      if (!seen.has(surgery.id)) {
        seen.add(surgery.id);
        results.push({
          surgery,
          matchedOn: "label",
          matchedLabel: surgery.label,
        });
      }
    }
  }

  return results
    .sort(
      (a, b) =>
        scoreMatch(normalizedQuery, a.matchedLabel) -
        scoreMatch(normalizedQuery, b.matchedLabel),
    )
    .slice(0, limit);
}

export function formatSurgeryLabel(surgery: SurgeryReference): string {
  return `${surgery.shortLabel} — ${surgery.label}`;
}
