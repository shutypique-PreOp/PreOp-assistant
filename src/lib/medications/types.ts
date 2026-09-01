import type { MedicationClass } from "@/lib/types";

/**
 * Référentiel médicament — données de référence, sans logique clinique.
 * Le futur moteur de décision consommera ces entrées via `drugId`.
 */
export interface MedicationReference {
  id: string;
  dci: string;
  commercialNames: string[];
  therapeuticClass: MedicationClass;
}

export interface MedicationSearchResult {
  drug: MedicationReference;
  matchedOn: "dci" | "commercial";
  matchedLabel: string;
}
