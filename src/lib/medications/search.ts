import { MEDICATION_CATALOG } from "./catalog";
import { normalizeSearchText } from "./normalize";
import type { MedicationReference, MedicationSearchResult } from "./types";

function matchesQuery(normalizedQuery: string, label: string): boolean {
  if (!normalizedQuery) return false;
  return normalizeSearchText(label).includes(normalizedQuery);
}

function scoreMatch(normalizedQuery: string, label: string): number {
  const normalized = normalizeSearchText(label);
  if (normalized === normalizedQuery) return 0;
  if (normalized.startsWith(normalizedQuery)) return 1;
  return 2;
}

/**
 * Recherche dans le catalogue par DCI ou nom commercial.
 * Insensible à la casse et aux accents.
 */
export function searchMedications(
  query: string,
  options?: { limit?: number },
): MedicationSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const limit = options?.limit ?? 8;
  const results: MedicationSearchResult[] = [];
  const seen = new Set<string>();

  for (const drug of MEDICATION_CATALOG) {
    if (matchesQuery(normalizedQuery, drug.dci)) {
      if (!seen.has(drug.id)) {
        seen.add(drug.id);
        results.push({
          drug,
          matchedOn: "dci",
          matchedLabel: drug.dci,
        });
      }
      continue;
    }

    for (const commercial of drug.commercialNames) {
      if (matchesQuery(normalizedQuery, commercial)) {
        if (!seen.has(drug.id)) {
          seen.add(drug.id);
          results.push({
            drug,
            matchedOn: "commercial",
            matchedLabel: commercial,
          });
        }
        break;
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

export function findMedicationByAnyName(
  name: string,
): MedicationReference | undefined {
  const result = searchMedications(name, { limit: 1 })[0];
  return result?.drug;
}
