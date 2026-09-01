import type { ClinicalAssessmentInput, EvaluationResult } from "./types";
import { evaluateApixaban } from "./drugs/apixaban";

/**
 * Point d'entrée du moteur décisionnel — séparé des données médicaments.
 */
export function evaluateMedication(
  input: ClinicalAssessmentInput,
): EvaluationResult {
  switch (input.drugId) {
    case "apixaban":
      return evaluateApixaban(input);
    default:
      return {
        status: "unavailable",
        message:
          "Recommandation automatique non disponible pour ce médicament dans cette version.",
      };
  }
}

export type {
  ClinicalAssessmentInput,
  EvaluationResult,
  RecommendationOutput,
  ReasoningDetail,
  MissingField,
} from "./types";
