import { CONSULTATION_STEPS } from "@/lib/copy";
import type { ConsultationStepId } from "@/lib/types";

export function StepProgress({
  current,
}: {
  current: ConsultationStepId;
}) {
  const index = CONSULTATION_STEPS.findIndex((s) => s.id === current);

  return (
    <nav className="step-progress" aria-label="Étapes de consultation">
      <ol>
        {CONSULTATION_STEPS.map((step, i) => {
          const state =
            i < index ? "done" : i === index ? "current" : "todo";
          return (
            <li key={step.id} data-state={state}>
              <span className="step-progress__index">{i + 1}</span>
              <span className="step-progress__label">{step.short}</span>
            </li>
          );
        })}
      </ol>
      <div
        className="step-progress__bar"
        style={{ ["--progress" as string]: `${(index / (CONSULTATION_STEPS.length - 1)) * 100}%` }}
      />
    </nav>
  );
}
