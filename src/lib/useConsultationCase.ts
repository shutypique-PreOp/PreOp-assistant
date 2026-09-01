"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createPatientMedication,
  getMedicationById,
} from "@/lib/medications";
import type { MedicationReference } from "@/lib/medications";
import type { Medication, MedicationDecision, PatientCase } from "./types";
import { getCaseTemplateById } from "./cases";

const STORAGE_PREFIX = "preop-case:";

function buildInitialMedications(
  template: Omit<PatientCase, "medications">,
): Medication[] {
  return template.initialMedicationDrugIds
    .map((drugId) => {
      const drug = getMedicationById(drugId);
      if (!drug) return null;
      const details = template.initialMedicationDetails?.[drugId];
      return createPatientMedication(drug, details);
    })
    .filter((med): med is Medication => med !== null);
}

function hydrateCase(template: Omit<PatientCase, "medications">): PatientCase {
  return {
    ...template,
    medications: buildInitialMedications(template),
  };
}

export function useConsultationCase(caseId: string) {
  const [patientCase, setPatientCase] = useState<PatientCase | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const template = getCaseTemplateById(caseId);
    if (!template) {
      setPatientCase(null);
      setReady(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_PREFIX + caseId);
      if (raw) {
        setPatientCase(JSON.parse(raw) as PatientCase);
      } else {
        setPatientCase(hydrateCase(template));
      }
    } catch {
      setPatientCase(hydrateCase(template));
    }
    setReady(true);
  }, [caseId]);

  useEffect(() => {
    if (!patientCase || !ready) return;
    sessionStorage.setItem(
      STORAGE_PREFIX + caseId,
      JSON.stringify(patientCase),
    );
  }, [patientCase, caseId, ready]);

  const updateMedication = useCallback(
    (medId: string, patch: Partial<Medication>) => {
      setPatientCase((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          medications: prev.medications.map((m) =>
            m.id === medId ? { ...m, ...patch } : m,
          ),
        };
      });
    },
    [],
  );

  const addMedication = useCallback((drug: MedicationReference) => {
    setPatientCase((prev) => {
      if (!prev) return prev;
      if (prev.medications.some((m) => m.drugId === drug.id)) {
        return prev;
      }
      return {
        ...prev,
        medications: [...prev.medications, createPatientMedication(drug)],
      };
    });
  }, []);

  const removeMedication = useCallback((medId: string) => {
    setPatientCase((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        medications: prev.medications.filter((m) => m.id !== medId),
      };
    });
  }, []);

  const setDecision = useCallback(
    (medId: string, decision: MedicationDecision) => {
      updateMedication(medId, { decision });
    },
    [updateMedication],
  );

  const setAirwayNotes = useCallback((airwayNotes: string) => {
    setPatientCase((prev) => (prev ? { ...prev, airwayNotes } : prev));
  }, []);

  const setCardioNotes = useCallback((cardioNotes: string) => {
    setPatientCase((prev) => (prev ? { ...prev, cardioNotes } : prev));
  }, []);

  const resetCase = useCallback(() => {
    const template = getCaseTemplateById(caseId);
    if (!template) return;
    sessionStorage.removeItem(STORAGE_PREFIX + caseId);
    setPatientCase(hydrateCase(template));
  }, [caseId]);

  return {
    patientCase,
    ready,
    updateMedication,
    addMedication,
    removeMedication,
    setDecision,
    setAirwayNotes,
    setCardioNotes,
    resetCase,
  };
}
