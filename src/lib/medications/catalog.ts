import type { MedicationReference } from "./types";

/**
 * Catalogue initial — médicaments fréquents en consultation préopératoire.
 * Extensible : ajouter des entrées ici ou via import futur (BDPM, Supabase…).
 */
export const MEDICATION_CATALOG: MedicationReference[] = [
  // Anticoagulants
  {
    id: "apixaban",
    dci: "Apixaban",
    commercialNames: ["Eliquis"],
    therapeuticClass: "Anticoagulant",
  },
  {
    id: "rivaroxaban",
    dci: "Rivaroxaban",
    commercialNames: ["Xarelto"],
    therapeuticClass: "Anticoagulant",
  },
  {
    id: "edoxaban",
    dci: "Edoxaban",
    commercialNames: ["Lixiana"],
    therapeuticClass: "Anticoagulant",
  },
  {
    id: "dabigatran",
    dci: "Dabigatran",
    commercialNames: ["Pradaxa"],
    therapeuticClass: "Anticoagulant",
  },
  {
    id: "warfarine",
    dci: "Warfarine",
    commercialNames: ["Coumadine"],
    therapeuticClass: "Anticoagulant",
  },
  {
    id: "enoxaparine",
    dci: "Énoxaparine",
    commercialNames: ["Lovenox", "Inhixa"],
    therapeuticClass: "Anticoagulant",
  },

  // Antiagrégants
  {
    id: "aspirine",
    dci: "Aspirine",
    commercialNames: ["Aspégic", "Kardegic", "Aspegic"],
    therapeuticClass: "Antiagrégant",
  },
  {
    id: "clopidogrel",
    dci: "Clopidogrel",
    commercialNames: ["Plavix"],
    therapeuticClass: "Antiagrégant",
  },
  {
    id: "prasugrel",
    dci: "Prasugrel",
    commercialNames: ["Efient"],
    therapeuticClass: "Antiagrégant",
  },
  {
    id: "ticagrelor",
    dci: "Ticagrelor",
    commercialNames: ["Brilique"],
    therapeuticClass: "Antiagrégant",
  },

  // Antidiabétiques
  {
    id: "metformine",
    dci: "Metformine",
    commercialNames: ["Glucophage", "Stagid"],
    therapeuticClass: "Antidiabétique",
  },
  {
    id: "gliclazide",
    dci: "Gliclazide",
    commercialNames: ["Diamicron"],
    therapeuticClass: "Antidiabétique",
  },
  {
    id: "insuline",
    dci: "Insuline",
    commercialNames: ["Lantus", "Novorapid", "Humalog"],
    therapeuticClass: "Antidiabétique",
  },

  // Cardiovasculaire / antihypertenseurs
  {
    id: "bisoprolol",
    dci: "Bisoprolol",
    commercialNames: ["Cardensiel"],
    therapeuticClass: "Antihypertenseur",
  },
  {
    id: "ramipril",
    dci: "Ramipril",
    commercialNames: ["Triatec"],
    therapeuticClass: "Antihypertenseur",
  },
  {
    id: "amlodipine",
    dci: "Amlodipine",
    commercialNames: ["Amlor"],
    therapeuticClass: "Antihypertenseur",
  },
  {
    id: "losartan",
    dci: "Losartan",
    commercialNames: ["Cozaar"],
    therapeuticClass: "Antihypertenseur",
  },
  {
    id: "atorvastatine",
    dci: "Atorvastatine",
    commercialNames: ["Tahor"],
    therapeuticClass: "Autre",
  },

  // Autres fréquents en préop
  {
    id: "pantoprazole",
    dci: "Pantoprazole",
    commercialNames: ["Inipomp"],
    therapeuticClass: "Autre",
  },
];

const catalogById = new Map(
  MEDICATION_CATALOG.map((drug) => [drug.id, drug]),
);

export function getMedicationById(id: string): MedicationReference | undefined {
  return catalogById.get(id);
}

export function getMedicationsByIds(ids: string[]): MedicationReference[] {
  return ids
    .map((id) => catalogById.get(id))
    .filter((drug): drug is MedicationReference => drug !== undefined);
}
