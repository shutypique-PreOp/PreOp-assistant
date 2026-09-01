"use client";

import { useState } from "react";
import type { EvaluationResult } from "@/lib/decision-engine";

const MISSING_LABELS: Record<string, string> = {
  indication: "Indication du médicament",
  surgery: "Chirurgie",
  thromboembolicRisk: "Risque thromboembolique",
  renalFunction: "Fonction rénale",
  surgeryDate: "Date de l'intervention",
};

interface Props {
  evaluation: EvaluationResult;
}

export function RecommendationDisplay({ evaluation }: Props) {
  const [reasoningOpen, setReasoningOpen] = useState(false);

  if (evaluation.status === "incomplete") {
    return (
      <div className="recommendation recommendation--pending">
        <p className="recommendation__status">
          Informations nécessaires pour la recommandation :
        </p>
        <ul className="recommendation__missing">
          {evaluation.missing.map((field) => (
            <li key={field}>{MISSING_LABELS[field] ?? field}</li>
          ))}
        </ul>
        {evaluation.message && (
          <p className="recommendation__hint">{evaluation.message}</p>
        )}
      </div>
    );
  }

  if (evaluation.status === "unavailable") {
    return (
      <div className="recommendation recommendation--unavailable">
        <p>{evaluation.message}</p>
      </div>
    );
  }

  const { recommendation, reasoning } = evaluation;

  return (
    <div className="recommendation recommendation--complete">
      <div className="recommendation__highlights">
        <div className="recommendation__item">
          <span className="recommendation__label">Dernière prise</span>
          <p className="recommendation__value">{recommendation.lastDose}</p>
        </div>
        <div className="recommendation__item">
          <span className="recommendation__label">Relais</span>
          <p className="recommendation__value">{recommendation.bridging}</p>
        </div>
        <div className="recommendation__item">
          <span className="recommendation__label">Reprise</span>
          <p className="recommendation__value">{recommendation.resume}</p>
        </div>
      </div>

      <details
        className="reasoning-accordion"
        open={reasoningOpen}
        onToggle={(e) => setReasoningOpen(e.currentTarget.open)}
      >
        <summary>Voir le raisonnement</summary>
        <div className="reasoning-accordion__body">
          <section>
            <h4>Variables utilisées</h4>
            <ul>
              {reasoning.variables.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Raisonnement</h4>
            <ul>
              {reasoning.reasoning.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          {reasoning.exceptions.length > 0 && (
            <section>
              <h4>Exceptions</h4>
              <ul>
                {reasoning.exceptions.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h4>Références</h4>
            <ul>
              {reasoning.references.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          {reasoning.methodology && reasoning.methodology.length > 0 && (
            <section>
              <h4>Détails méthodologiques</h4>
              <ul>
                {reasoning.methodology.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </details>
    </div>
  );
}
