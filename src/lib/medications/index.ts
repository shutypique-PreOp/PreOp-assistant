export type { MedicationReference, MedicationSearchResult } from "./types";
export {
  MEDICATION_CATALOG,
  getMedicationById,
  getMedicationsByIds,
} from "./catalog";
export {
  INDICATION_CATALOG,
  getIndicationById,
  getIndicationsForDrug,
} from "./indications";
export type { IndicationReference, ThromboembolicRiskHelp } from "./indications";
export { normalizeSearchText } from "./normalize";
export { searchMedications, findMedicationByAnyName } from "./search";
export {
  createPatientMedication,
  formatMedicationLabel,
} from "./patient-medication";
