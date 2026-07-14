"use client";

import { useCallback, useEffect, useState } from "react";
import type { Medication, MedicationDecision, PatientCase } from "./types";
import { getCaseById } from "./cases";

const STORAGE_PREFIX = "preop-case:";

function cloneCase(base: PatientCase): PatientCase {
  return structuredClone(base);
}

export function useConsultationCase(caseId: string) {
  const [patientCase, setPatientCase] = useState<PatientCase | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const base = getCaseById(caseId);
    if (!base) {
      setPatientCase(null);
      setReady(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_PREFIX + caseId);
      if (raw) {
        setPatientCase(JSON.parse(raw) as PatientCase);
      } else {
        setPatientCase(cloneCase(base));
      }
    } catch {
      setPatientCase(cloneCase(base));
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
    const base = getCaseById(caseId);
    if (!base) return;
    sessionStorage.removeItem(STORAGE_PREFIX + caseId);
    setPatientCase(cloneCase(base));
  }, [caseId]);

  return {
    patientCase,
    ready,
    updateMedication,
    setDecision,
    setAirwayNotes,
    setCardioNotes,
    resetCase,
  };
}
