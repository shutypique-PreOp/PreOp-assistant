"use client";

import { useMemo } from "react";
import { evaluateMedication } from "@/lib/decision-engine";
import {
  getIndicationById,
  getIndicationsForDrug,
} from "@/lib/medications";
import type { Medication, RenalFunction, ThromboembolicRisk } from "@/lib/types";
import { RecommendationDisplay } from "@/components/RecommendationDisplay";
import { SurgerySearch } from "@/components/SurgerySearch";

const TE_OPTIONS: { value: ThromboembolicRisk; label: string }[] = [
  { value: "non_eleve", label: "Non" },
  { value: "eleve", label: "Oui" },
  { value: "a_determiner", label: "À déterminer" },
];

const RENAL_OPTIONS: { value: RenalFunction; label: string }[] = [
  { value: "gte_50", label: "≥ 50 mL/min" },
  { value: "30_49", label: "30–49 mL/min" },
  { value: "lt_30", label: "< 30 mL/min" },
  { value: "inconnue", label: "Inconnue" },
];

interface Props {
  medication: Medication;
  onChange: (patch: Partial<Medication>) => void;
  onRemove?: () => void;
}

export function MedicationClinicalEditor({
  medication,
  onChange,
  onRemove,
}: Props) {
  const indications = getIndicationsForDrug(medication.drugId);
  const selectedIndication = medication.indicationId
    ? getIndicationById(medication.indicationId)
    : undefined;

  const evaluation = useMemo(
    () =>
      evaluateMedication({
        drugId: medication.drugId,
        indicationId: medication.indicationId,
        surgeryId: medication.surgeryId,
        thromboembolicRisk: medication.thromboembolicRisk,
        renalFunction: medication.renalFunction,
        surgeryDate: medication.surgeryDate || undefined,
      }),
    [
      medication.drugId,
      medication.indicationId,
      medication.surgeryId,
      medication.thromboembolicRisk,
      medication.renalFunction,
      medication.surgeryDate,
    ],
  );

  const showTeRisk = selectedIndication?.requiresThromboembolicRisk ?? false;
  const showRenal = selectedIndication?.requiresRenalFunction ?? false;
  const needsSurgeryDate =
    evaluation.status === "incomplete" &&
    evaluation.missing.includes("surgeryDate");

  return (
    <article className="med-editor med-editor--clinical">
      <div className="med-editor__head">
        <div>
          <p className="med-editor__class">{medication.className}</p>
          <h3>{medication.name}</h3>
          {medication.dose && (
            <p className="med-editor__meta">{medication.dose}</p>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            className="btn btn-ghost med-editor__remove"
            onClick={onRemove}
            aria-label={`Retirer ${medication.name}`}
          >
            Retirer
          </button>
        )}
      </div>

      {indications.length > 0 && (
        <fieldset className="clinical-field">
          <legend className="clinical-field__label">Indication</legend>
          <div className="decision-row">
            {indications.map((ind) => (
              <label
                key={ind.id}
                className="decision-chip"
                data-active={medication.indicationId === ind.id}
              >
                <input
                  type="radio"
                  name={`indication-${medication.id}`}
                  checked={medication.indicationId === ind.id}
                  onChange={() =>
                    onChange({
                      indicationId: ind.id,
                      indication: ind.label,
                    })
                  }
                />
                {ind.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <SurgerySearch
        selectedSurgeryId={medication.surgeryId}
        onSelect={(surgery) => onChange({ surgeryId: surgery.id })}
        onClear={() => onChange({ surgeryId: undefined })}
      />

      {showTeRisk && (
        <fieldset className="clinical-field">
          <legend className="clinical-field__label">
            Risque thromboembolique élevé ?
          </legend>
          <div className="decision-row">
            {TE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="decision-chip"
                data-active={medication.thromboembolicRisk === opt.value}
              >
                <input
                  type="radio"
                  name={`te-${medication.id}`}
                  checked={medication.thromboembolicRisk === opt.value}
                  onChange={() =>
                    onChange({ thromboembolicRisk: opt.value })
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
          {selectedIndication?.thromboembolicRiskHelp && (
            <details className="help-accordion">
              <summary>Comment déterminer le risque ?</summary>
              <div className="help-accordion__body">
                <p className="help-accordion__title">
                  {selectedIndication.thromboembolicRiskHelp.title}
                </p>
                <ul>
                  {selectedIndication.thromboembolicRiskHelp.criteria.map(
                    (c) => (
                      <li key={c}>{c}</li>
                    ),
                  )}
                </ul>
                {selectedIndication.thromboembolicRiskHelp.source && (
                  <p className="help-accordion__source">
                    {selectedIndication.thromboembolicRiskHelp.source}
                  </p>
                )}
              </div>
            </details>
          )}
        </fieldset>
      )}

      {showRenal && (
        <fieldset className="clinical-field">
          <legend className="clinical-field__label">Fonction rénale</legend>
          <div className="decision-row">
            {RENAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="decision-chip"
                data-active={medication.renalFunction === opt.value}
              >
                <input
                  type="radio"
                  name={`renal-${medication.id}`}
                  checked={medication.renalFunction === opt.value}
                  onChange={() => onChange({ renalFunction: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {(needsSurgeryDate ||
        (medication.surgeryId &&
          medication.indicationId &&
          evaluation.status !== "unavailable")) && (
        <div className="clinical-field">
          <label className="clinical-field__label" htmlFor={`surgery-date-${medication.id}`}>
            Date de l&apos;intervention
          </label>
          <input
            id={`surgery-date-${medication.id}`}
            type="date"
            className="clinical-date-input"
            value={medication.surgeryDate ?? ""}
            onChange={(e) =>
              onChange({
                surgeryDate: e.target.value || undefined,
              })
            }
          />
          <p className="clinical-field__hint">
            Aucune date de dernière prise n&apos;est calculée sans cette saisie.
          </p>
        </div>
      )}

      <RecommendationDisplay evaluation={evaluation} />

      <label className="med-editor__note clinical-field">
        <span className="clinical-field__label">Note clinicien</span>
        <textarea
          rows={2}
          placeholder="Particularités, trace collégiale…"
          value={medication.clinicianNote}
          onChange={(e) => onChange({ clinicianNote: e.target.value })}
        />
      </label>
    </article>
  );
}
