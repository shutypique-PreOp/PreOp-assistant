"use client";

import type { Medication, MedicationDecision } from "@/lib/types";
import { DECISION_HINT, DECISION_LABELS } from "@/lib/copy";

const DECISIONS: MedicationDecision[] = [
  "continuer",
  "suspendre",
  "adapter",
  "a_discuter",
];

interface Props {
  medication: Medication;
  onChange: (patch: Partial<Medication>) => void;
}

export function MedicationEditor({ medication, onChange }: Props) {
  return (
    <article className="med-editor">
      <div className="med-editor__head">
        <div>
          <p className="med-editor__class">{medication.className}</p>
          <h3>{medication.name}</h3>
          <p className="med-editor__meta">
            {medication.dose} · {medication.indication}
          </p>
        </div>
      </div>

      <fieldset className="med-editor__decisions">
        <legend>Conduite préopératoire</legend>
        <p className="field-hint">{DECISION_HINT}</p>
        <div className="decision-row">
          {DECISIONS.map((d) => (
            <label key={d} className="decision-chip" data-active={medication.decision === d}>
              <input
                type="radio"
                name={`decision-${medication.id}`}
                value={d}
                checked={medication.decision === d}
                onChange={() => onChange({ decision: d })}
              />
              {DECISION_LABELS[d]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="med-editor__fields">
        <label>
          Délai / dernière prise
          <input
            type="text"
            placeholder="ex. dernière prise J-3"
            value={medication.holdDays}
            onChange={(e) => onChange({ holdDays: e.target.value })}
          />
        </label>
        <label>
          Reprise prévue
          <input
            type="text"
            placeholder="ex. reprise J+1 si hémostase"
            value={medication.resumeNote}
            onChange={(e) => onChange({ resumeNote: e.target.value })}
          />
        </label>
        <label className="med-editor__note">
          Note clinicien
          <textarea
            rows={2}
            placeholder="Trace collégiale, particularités…"
            value={medication.clinicianNote}
            onChange={(e) => onChange({ clinicianNote: e.target.value })}
          />
        </label>
      </div>
    </article>
  );
}
