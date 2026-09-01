import type { SurgeryReference } from "./types";

/**
 * Catalogue de chirurgies structurées — données de référence pour le moteur.
 */
export const SURGERY_CATALOG: SurgeryReference[] = [
  {
    id: "pth",
    shortLabel: "PTH",
    label: "Prothèse totale de hanche",
    bleedingRisk: "élevé",
    source: "Chirurgie orthopédique majeure — risque hémorragique élevé",
  },
  {
    id: "ptg",
    shortLabel: "PTG",
    label: "Prothèse totale de genou",
    bleedingRisk: "élevé",
    source: "Chirurgie orthopédique majeure — risque hémorragique élevé",
  },
  {
    id: "cholecystectomie",
    shortLabel: "Cholécystectomie",
    label: "Cholécystectomie laparoscopique",
    bleedingRisk: "intermédiaire",
    source: "Chirurgie digestive laparoscopique",
  },
  {
    id: "hernie",
    shortLabel: "Hernie",
    label: "Hernie inguinale",
    bleedingRisk: "faible",
    source: "Chirurgie ambulatoire",
  },
  {
    id: "cataracte",
    shortLabel: "Cataracte",
    label: "Chirurgie de la cataracte",
    bleedingRisk: "faible",
    source: "Chirurgie ophtalmologique",
  },
  {
    id: "polypectomie",
    shortLabel: "Polypectomie",
    label: "Polypectomie colique",
    bleedingRisk: "intermédiaire",
    source: "Endoscopie digestive",
  },
];

const catalogById = new Map(
  SURGERY_CATALOG.map((surgery) => [surgery.id, surgery]),
);

export function getSurgeryById(id: string): SurgeryReference | undefined {
  return catalogById.get(id);
}
