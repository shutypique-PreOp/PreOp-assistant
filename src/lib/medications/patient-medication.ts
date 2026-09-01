import type { Medication } from "@/lib/types";
import type { MedicationReference } from "./types";

let instanceCounter = 0;

export function createPatientMedication(
  drug: MedicationReference,
  overrides?: Partial<Pick<Medication, "dose" | "indication">>,
): Medication {
  instanceCounter += 1;
  return {
    id: `med-${drug.id}-${instanceCounter}-${Date.now()}`,
    drugId: drug.id,
    name: drug.dci,
    className: drug.therapeuticClass,
    dose: overrides?.dose ?? "",
    indication: overrides?.indication ?? "",
    decision: "non_renseigne",
    holdDays: "",
    resumeNote: "",
    clinicianNote: "",
  };
}

export function formatMedicationLabel(drug: MedicationReference): string {
  if (drug.commercialNames.length === 0) return drug.dci;
  return `${drug.dci} (${drug.commercialNames[0]})`;
}
