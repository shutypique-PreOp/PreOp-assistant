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

export interface Medication {
  id: string;
  name: string;
  className: MedicationClass;
  dose: string;
  indication: string;
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
  procedureDate: string;
  bleedingRisk: "faible" | "intermédiaire" | "élevé";
  anesthesiaType: string;
  comorbidities: string[];
  allergies: Allergy[];
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
