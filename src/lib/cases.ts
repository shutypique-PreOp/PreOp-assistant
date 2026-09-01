import type { PatientCase } from "./types";

/**
 * Gabarits de dossiers démo — sans listes de médicaments figées.
 * Les traitements initiaux sont résolus depuis le catalogue via `initialMedicationDrugIds`.
 */
export const DEMO_CASE_TEMPLATES: Omit<PatientCase, "medications">[] = [
  {
    id: "case-ortopedie",
    label: "PTH — patient polymédiqué",
    patientInitials: "M. D.",
    age: 72,
    sex: "M",
    asa: "ASA III",
    procedure: "Prothèse totale de hanche droite",
    procedureDate: "2026-07-28",
    bleedingRisk: "élevé",
    anesthesiaType: "Rachianesthésie ± sédation",
    comorbidities: [
      "Fibrillation auriculaire",
      "HTA",
      "Diabète de type 2",
      "Stent coronaire > 12 mois",
    ],
    allergies: [
      {
        id: "a1",
        label: "Pénicilline",
        reaction: "Éruption cutanée (enfance)",
      },
    ],
    initialMedicationDrugIds: [
      "apixaban",
      "aspirine",
      "metformine",
      "bisoprolol",
      "ramipril",
    ],
    initialMedicationDetails: {
      apixaban: { dose: "5 mg × 2 / j", indication: "FA non valvulaire" },
      aspirine: {
        dose: "75 mg / j",
        indication: "Prévention secondaire coronaire",
      },
      metformine: { dose: "850 mg × 2 / j", indication: "Diabète de type 2" },
      bisoprolol: { dose: "2,5 mg / j", indication: "HTA / rythme" },
      ramipril: { dose: "5 mg / j", indication: "HTA" },
    },
    airwayNotes: "",
    cardioNotes: "",
  },
  {
    id: "case-chirurgie-digestive",
    label: "Cholécystectomie — bithérapie",
    patientInitials: "Mme L.",
    age: 58,
    sex: "F",
    asa: "ASA II",
    procedure: "Cholécystectomie laparoscopique",
    procedureDate: "2026-08-04",
    bleedingRisk: "intermédiaire",
    anesthesiaType: "Anesthésie générale",
    comorbidities: ["Coronarien récent (stent à 4 mois)", "Dyslipidémie"],
    allergies: [],
    initialMedicationDrugIds: [
      "clopidogrel",
      "aspirine",
      "atorvastatine",
      "pantoprazole",
    ],
    initialMedicationDetails: {
      clopidogrel: {
        dose: "75 mg / j",
        indication: "Bithérapie post-stent",
      },
      aspirine: {
        dose: "75 mg / j",
        indication: "Bithérapie post-stent",
      },
      atorvastatine: { dose: "40 mg / j", indication: "Dyslipidémie" },
      pantoprazole: {
        dose: "40 mg / j",
        indication: "Protection gastrique",
      },
    },
    airwayNotes: "",
    cardioNotes: "",
  },
];

/** @deprecated Utiliser DEMO_CASE_TEMPLATES — conservé pour compatibilité d'import. */
export const DEMO_CASES = DEMO_CASE_TEMPLATES;

export function getCaseTemplateById(
  id: string,
): Omit<PatientCase, "medications"> | undefined {
  return DEMO_CASE_TEMPLATES.find((c) => c.id === id);
}

/** @deprecated Utiliser getCaseTemplateById */
export function getCaseById(
  id: string,
): Omit<PatientCase, "medications"> | undefined {
  return getCaseTemplateById(id);
}
