"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MedicationEditor } from "@/components/MedicationEditor";
import { MedicationSearch } from "@/components/MedicationSearch";
import { StepProgress } from "@/components/StepProgress";
import { CONSULTATION_STEPS, DECISION_LABELS } from "@/lib/copy";
import type { MedicationReference } from "@/lib/medications";
import type { ConsultationStepId, PatientCase } from "@/lib/types";
import { useConsultationCase } from "@/lib/useConsultationCase";

const BLEEDING_LABELS = {
  faible: "Faible",
  intermédiaire: "Intermédiaire",
  élevé: "Élevé",
} as const;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ContextPanel({ patientCase }: { patientCase: PatientCase }) {
  return (
    <section className="panel">
      <h2>Contexte opératoire</h2>
      <p className="panel-lead">
        Repères du dossier démo — non modifiables dans ce prototype.
      </p>
      <dl className="fact-grid">
        <div>
          <dt>Patient</dt>
          <dd>
            {patientCase.patientInitials} · {patientCase.age} ans ·{" "}
            {patientCase.sex} · {patientCase.asa}
          </dd>
        </div>
        <div>
          <dt>Intervention</dt>
          <dd>{patientCase.procedure}</dd>
        </div>
        <div>
          <dt>Date prévue</dt>
          <dd>{formatDate(patientCase.procedureDate)}</dd>
        </div>
        <div>
          <dt>Risque hémorragique</dt>
          <dd>{BLEEDING_LABELS[patientCase.bleedingRisk]}</dd>
        </div>
        <div>
          <dt>Anesthésie envisagée</dt>
          <dd>{patientCase.anesthesiaType}</dd>
        </div>
        <div>
          <dt>Comorbidités</dt>
          <dd>{patientCase.comorbidities.join(" · ")}</dd>
        </div>
      </dl>
    </section>
  );
}

function AllergiesPanel({ patientCase }: { patientCase: PatientCase }) {
  return (
    <section className="panel">
      <h2>Allergies & alertes</h2>
      <p className="panel-lead">
        Vérifiez les allergies avant de décider des traitements périopératoires.
      </p>
      {patientCase.allergies.length === 0 ? (
        <p className="empty-state">Aucune allergie renseignée sur ce dossier démo.</p>
      ) : (
        <ul className="allergy-list">
          {patientCase.allergies.map((a) => (
            <li key={a.id}>
              <strong>{a.label}</strong>
              <span>{a.reaction}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MedicationsPanel({
  patientCase,
  onChange,
  onAdd,
  onRemove,
}: {
  patientCase: PatientCase;
  onChange: (
    medId: string,
    patch: Partial<PatientCase["medications"][number]>,
  ) => void;
  onAdd: (drug: MedicationReference) => void;
  onRemove: (medId: string) => void;
}) {
  const stats = useMemo(() => {
    const total = patientCase.medications.length;
    const filled = patientCase.medications.filter(
      (m) => m.decision !== "non_renseigne",
    ).length;
    return { total, filled };
  }, [patientCase.medications]);

  const existingDrugIds = useMemo(
    () => patientCase.medications.map((m) => m.drugId),
    [patientCase.medications],
  );

  return (
    <section className="panel">
      <div className="panel-head-row">
        <div>
          <h2>Médicaments préopératoires</h2>
          <p className="panel-lead">
            Recherchez et ajoutez les traitements du patient, puis indiquez la
            conduite envisagée avant l’anesthésie. Aucune suggestion automatique.
          </p>
        </div>
        <p className="med-count">
          {stats.filled}/{stats.total} renseignés
        </p>
      </div>

      <MedicationSearch existingDrugIds={existingDrugIds} onSelect={onAdd} />

      <div className="med-stack">
        {patientCase.medications.length === 0 ? (
          <p className="empty-state">
            Aucun traitement ajouté. Utilisez la recherche ci-dessus pour
            commencer.
          </p>
        ) : (
          patientCase.medications.map((med) => (
            <MedicationEditor
              key={med.id}
              medication={med}
              onChange={(patch) => onChange(med.id, patch)}
              onRemove={() => onRemove(med.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TerrainPanel({
  patientCase,
  onAirway,
  onCardio,
}: {
  patientCase: PatientCase;
  onAirway: (v: string) => void;
  onCardio: (v: string) => void;
}) {
  return (
    <section className="panel">
      <h2>Terrain & voie aérienne</h2>
      <p className="panel-lead">
        Notes libres pour compléter la synthèse — emplacements d’interface.
      </p>
      <div className="notes-grid">
        <label>
          Voie aérienne / intubabilité
          <textarea
            rows={4}
            value={patientCase.airwayNotes}
            onChange={(e) => onAirway(e.target.value)}
            placeholder="Mallampati, ouverture buccale, dentition…"
          />
        </label>
        <label>
          Évaluation cardio / autres
          <textarea
            rows={4}
            value={patientCase.cardioNotes}
            onChange={(e) => onCardio(e.target.value)}
            placeholder="Tolérance effort, ECG, avis spécialisés…"
          />
        </label>
      </div>
    </section>
  );
}

function SummaryPanel({ patientCase }: { patientCase: PatientCase }) {
  return (
    <section className="panel panel--summary">
      <h2>Synthèse de consultation</h2>
      <p className="panel-lead">
        Résumé structuré des réponses saisies. Pas de conclusion médicale.
      </p>

      <div className="summary-block">
        <h3>Dossier</h3>
        <p>
          {patientCase.patientInitials} — {patientCase.procedure} (
          {formatDate(patientCase.procedureDate)}) · Risque hémorragique{" "}
          {BLEEDING_LABELS[patientCase.bleedingRisk].toLowerCase()} ·{" "}
          {patientCase.anesthesiaType}
        </p>
      </div>

      <div className="summary-block">
        <h3>Plan médicamenteux</h3>
        <ul className="summary-meds">
          {patientCase.medications.map((m) => (
            <li key={m.id}>
              <div className="summary-meds__title">
                <strong>{m.name}</strong>
                <span data-decision={m.decision}>
                  {DECISION_LABELS[m.decision]}
                </span>
              </div>
              <p>
                {[m.holdDays, m.resumeNote, m.clinicianNote]
                  .filter(Boolean)
                  .join(" · ") || "Aucun détail saisi"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {(patientCase.airwayNotes || patientCase.cardioNotes) && (
        <div className="summary-block">
          <h3>Notes</h3>
          {patientCase.airwayNotes && (
            <p>
              <em>Voie aérienne — </em>
              {patientCase.airwayNotes}
            </p>
          )}
          {patientCase.cardioNotes && (
            <p>
              <em>Cardio — </em>
              {patientCase.cardioNotes}
            </p>
          )}
        </div>
      )}

      <div className="summary-actions no-print">
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          Imprimer / PDF
        </button>
        <Link href="/consultation" className="btn btn-ghost">
          Retour aux dossiers
        </Link>
      </div>
    </section>
  );
}

export function ConsultationWorkspace({ caseId }: { caseId: string }) {
  const {
    patientCase,
    ready,
    updateMedication,
    addMedication,
    removeMedication,
    setAirwayNotes,
    setCardioNotes,
    resetCase,
  } = useConsultationCase(caseId);

  const [step, setStep] = useState<ConsultationStepId>("contexte");
  const stepIndex = CONSULTATION_STEPS.findIndex((s) => s.id === step);

  if (!ready) {
    return <p className="loading-line">Chargement du dossier…</p>;
  }

  if (!patientCase) {
    return (
      <section className="panel">
        <h2>Dossier introuvable</h2>
        <p>Ce cas de démonstration n’existe pas.</p>
        <Link href="/consultation" className="btn btn-primary">
          Voir les dossiers
        </Link>
      </section>
    );
  }

  const goPrev = () => {
    if (stepIndex > 0) setStep(CONSULTATION_STEPS[stepIndex - 1].id);
  };
  const goNext = () => {
    if (stepIndex < CONSULTATION_STEPS.length - 1) {
      setStep(CONSULTATION_STEPS[stepIndex + 1].id);
    }
  };

  return (
    <div className="consultation">
      <div className="consultation__toolbar no-print">
        <div>
          <p className="eyebrow">{patientCase.label}</p>
          <h1>
            {patientCase.patientInitials}
            <span>
              {" "}
              · {patientCase.procedure}
            </span>
          </h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={resetCase}>
          Réinitialiser
        </button>
      </div>

      <div className="no-print">
        <StepProgress current={step} />
      </div>

      <div className="consultation__body">
        {step === "contexte" && <ContextPanel patientCase={patientCase} />}
        {step === "allergies" && <AllergiesPanel patientCase={patientCase} />}
        {step === "medicaments" && (
          <MedicationsPanel
            patientCase={patientCase}
            onChange={updateMedication}
            onAdd={addMedication}
            onRemove={removeMedication}
          />
        )}
        {step === "terrain" && (
          <TerrainPanel
            patientCase={patientCase}
            onAirway={setAirwayNotes}
            onCardio={setCardioNotes}
          />
        )}
        {step === "synthese" && <SummaryPanel patientCase={patientCase} />}
      </div>

      <div className="consultation__nav no-print">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goPrev}
          disabled={stepIndex === 0}
        >
          Précédent
        </button>
        {stepIndex < CONSULTATION_STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Suivant — {CONSULTATION_STEPS[stepIndex + 1].short}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            Imprimer la synthèse
          </button>
        )}
      </div>
    </div>
  );
}
