export type BleedingRiskLevel = "faible" | "intermédiaire" | "élevé";

export interface SurgeryReference {
  id: string;
  shortLabel: string;
  label: string;
  bleedingRisk: BleedingRiskLevel;
  source?: string;
}

export interface SurgerySearchResult {
  surgery: SurgeryReference;
  matchedOn: "shortLabel" | "label";
  matchedLabel: string;
}
