export type MedicationDecision =
  | "continuer"
  | "suspendre"
  | "adapter"
  | "a_discuter"
  | "non_renseigne";

export type MedicationClass =
  | "Antiagrégant"
  | "Anticoagulant"
  | "Antidiabétique"
  | "Antihypertenseur"
  | "Corticothérapie"
  | "Psychotrope"
  | "Autre";

export type ThromboembolicRisk = "eleve" | "non_eleve" | "a_determiner";

export type RenalFunction = "gte_50" | "30_49" | "lt_30" | "inconnue";

export interface Medication {
  id: string;
  /** Référence stable vers le catalogue (`src/lib/medications`). */
  drugId: string;
  name: string;
  className: MedicationClass;
  dose: string;
  /** Libellé affiché de l'indication */
  indication: string;
  /** Référence catalogue indication */
  indicationId?: string;
  /** Référence catalogue chirurgie */
  surgeryId?: string;
  thromboembolicRisk?: ThromboembolicRisk;
  renalFunction?: RenalFunction;
  /** Date d'intervention (YYYY-MM-DD) — jamais présélectionnée */
  surgeryDate?: string;
  decision: MedicationDecision;
  holdDays: string;
  resumeNote: string;
  clinicianNote: string;
}

export interface Allergy {
  id: string;
  label: string;
  reaction: string;
}

export interface PatientCase {
  id: string;
  label: string;
  patientInitials: string;
  age: number;
  sex: "F" | "M";
  asa: string;
  procedure: string;
  /** Repère démo uniquement — non utilisé par le moteur décisionnel */
  procedureDate: string;
  bleedingRisk: "faible" | "intermédiaire" | "élevé";
  anesthesiaType: string;
  comorbidities: string[];
  allergies: Allergy[];
  initialMedicationDrugIds: string[];
  initialMedicationDetails?: Record<
    string,
    { dose?: string; indication?: string }
  >;
  medications: Medication[];
  airwayNotes: string;
  cardioNotes: string;
}

export type ConsultationStepId =
  | "contexte"
  | "allergies"
  | "medicaments"
  | "terrain"
  | "synthese";

export interface ConsultationStep {
  id: ConsultationStepId;
  title: string;
  short: string;
}
