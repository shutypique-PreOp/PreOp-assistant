import type { RenalFunction, ThromboembolicRisk } from "@/lib/types";

export interface ClinicalAssessmentInput {
  drugId: string;
  indicationId?: string;
  surgeryId?: string;
  thromboembolicRisk?: ThromboembolicRisk;
  renalFunction?: RenalFunction;
  /** ISO date (YYYY-MM-DD) — jamais supposée par le moteur */
  surgeryDate?: string;
}

export interface RecommendationOutput {
  lastDose: string;
  bridging: string;
  resume: string;
}

export interface ReasoningDetail {
  variables: string[];
  reasoning: string[];
  exceptions: string[];
  references: string[];
  methodology?: string[];
}

export type MissingField =
  | "indication"
  | "surgery"
  | "thromboembolicRisk"
  | "renalFunction"
  | "surgeryDate";

export interface IncompleteEvaluation {
  status: "incomplete";
  missing: MissingField[];
  message?: string;
}

export interface CompleteEvaluation {
  status: "complete";
  recommendation: RecommendationOutput;
  reasoning: ReasoningDetail;
  /** Dates calendaires — uniquement si surgeryDate fournie */
  calendarDates?: {
    lastDoseDate: string;
    surgeryDate: string;
  };
}

export interface UnavailableEvaluation {
  status: "unavailable";
  message: string;
}

export type EvaluationResult =
  | IncompleteEvaluation
  | CompleteEvaluation
  | UnavailableEvaluation;
