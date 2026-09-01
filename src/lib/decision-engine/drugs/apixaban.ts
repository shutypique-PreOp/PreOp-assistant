import { getIndicationById } from "@/lib/medications/indications";
import { getSurgeryById } from "@/lib/surgeries";
import type { RenalFunction, ThromboembolicRisk } from "@/lib/types";
import { formatFrenchDate, subtractDays } from "../dates";
import type {
  ClinicalAssessmentInput,
  CompleteEvaluation,
  EvaluationResult,
  IncompleteEvaluation,
  MissingField,
} from "../types";

const RENAL_LABELS: Record<RenalFunction, string> = {
  gte_50: "≥ 50 mL/min",
  "30_49": "30–49 mL/min",
  lt_30: "< 30 mL/min",
  inconnue: "Inconnue",
};

const TE_LABELS: Record<Exclude<ThromboembolicRisk, "a_determiner">, string> = {
  eleve: "Élevé",
  non_eleve: "Non élevé",
};

function incomplete(
  missing: MissingField[],
  message?: string,
): IncompleteEvaluation {
  return { status: "incomplete", missing, message };
}

/**
 * Règles prototype documentées pour l'apixaban en périopératoire.
 * Source de référence : synthèse des recommandations SFAR / ESC sur les AOD.
 * À valider scientifiquement avant usage clinique.
 */
export function evaluateApixaban(
  input: ClinicalAssessmentInput,
): EvaluationResult {
  const missing: MissingField[] = [];

  if (!input.indicationId) missing.push("indication");
  if (!input.surgeryId) missing.push("surgery");

  const indication = input.indicationId
    ? getIndicationById(input.indicationId)
    : undefined;
  const surgery = input.surgeryId ? getSurgeryById(input.surgeryId) : undefined;

  if (indication?.requiresThromboembolicRisk) {
    if (!input.thromboembolicRisk) {
      missing.push("thromboembolicRisk");
    } else if (input.thromboembolicRisk === "a_determiner") {
      return incomplete(
        ["thromboembolicRisk"],
        "Précisez le risque thromboembolique ou consultez l'aide « Comment déterminer le risque ? »",
      );
    }
  }

  if (indication?.requiresRenalFunction && !input.renalFunction) {
    missing.push("renalFunction");
  }

  if (!input.surgeryDate) {
    missing.push("surgeryDate");
  }

  if (missing.length > 0) {
    return incomplete(missing);
  }

  if (!indication || !surgery || !input.surgeryDate) {
    return incomplete(missing);
  }

  const teRisk = input.thromboembolicRisk as Exclude<
    ThromboembolicRisk,
    "a_determiner"
  >;
  const renal = input.renalFunction!;

  if (renal === "inconnue") {
    return incomplete(
      ["renalFunction"],
      "La fonction rénale est nécessaire pour déterminer l'intervalle d'arrêt de l'apixaban.",
    );
  }

  if (renal === "lt_30") {
    return {
      status: "unavailable",
      message:
        "Clairance < 30 mL/min : conduite spécifique à discuter (réduction posologique, avis spécialisé). Recommandation automatique non disponible.",
    };
  }

  const interruptionDays = computeInterruptionDays(teRisk, surgery.bleedingRisk, renal);

  const lastDoseIso = subtractDays(input.surgeryDate, interruptionDays);
  if (!lastDoseIso) {
    return incomplete(["surgeryDate"], "Date d'intervention invalide.");
  }

  const lastDoseCalendar = formatFrenchDate(lastDoseIso);
  const surgeryCalendar = formatFrenchDate(input.surgeryDate);

  const bridging =
    teRisk === "eleve"
      ? "À discuter — relais héparinique rarement indiqué avec les AOD ; avis spécialisé recommandé"
      : "Non requis";

  const resume =
    surgery.bleedingRisk === "élevé"
      ? "Réévaluer à 48–72 h post-opératoires si hémostase acquise"
      : "Réévaluer à 24 h post-opératoires si hémostase acquise";

  const result: CompleteEvaluation = {
    status: "complete",
    recommendation: {
      lastDose: `Dernière prise le ${lastDoseCalendar} (${interruptionDays * 24} h avant l'intervention)`,
      bridging,
      resume,
    },
    calendarDates: {
      lastDoseDate: lastDoseIso,
      surgeryDate: input.surgeryDate,
    },
    reasoning: {
      variables: [
        `Indication : ${indication.label}`,
        `Chirurgie : ${surgery.label} (risque hémorragique ${surgery.bleedingRisk})`,
        `Risque thromboembolique : ${TE_LABELS[teRisk]}`,
        `Fonction rénale : ${RENAL_LABELS[renal]}`,
        `Date d'intervention : ${surgeryCalendar}`,
      ],
      reasoning: [
        `Interruption de l'apixaban ${interruptionDays * 24} h avant l'intervention selon le risque hémorragique de la chirurgie et la fonction rénale.`,
        teRisk === "non_eleve"
          ? "Risque thromboembolique non élevé : pas de relais systématique."
          : "Risque thromboembolique élevé : intervalle d'arrêt prolongé ; discussion spécialisée.",
      ],
      exceptions: [
        "Insuffisance rénale sévère, double antiagrégation, antécédent thromboembolique récent : réévaluer au cas par cas.",
        "En cas de doute, avis cardiologique ou hémostase.",
      ],
      references: [
        "SFAR — Recommandations sur la gestion des anticoagulants en périopératoire (synthèse prototype)",
        "ESC Guidelines — antithrombotic therapy (synthèse prototype)",
      ],
      methodology: [
        "Calcul de la dernière prise : date d'intervention validée par l'utilisateur moins l'intervalle d'arrêt documenté.",
        "Aucune date n'est générée sans saisie explicite de la date d'intervention.",
        "Pas de calculateur rénal intégré — la clairance est renseignée directement par le clinicien.",
      ],
    },
  };

  return result;
}

function computeInterruptionDays(
  teRisk: "eleve" | "non_eleve",
  bleedingRisk: "faible" | "intermédiaire" | "élevé",
  renal: RenalFunction,
): number {
  let days = 2;

  if (teRisk === "eleve") days = 3;
  if (bleedingRisk === "élevé" && teRisk === "non_eleve") days = 2;
  if (bleedingRisk === "élevé" && teRisk === "eleve") days = 3;
  if (renal === "30_49") days += 1;

  return days;
}
