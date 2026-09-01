export const PRODUCT_NAME = "PreOp Assistant";

export const DISCLAIMER =
  "Prototype — aucune recommandation médicale. À usage de démonstration uniquement. Ne pas utiliser pour une décision clinique.";

export const HOME_TAGLINE =
  "Structurez la gestion préopératoire des traitements lors de la consultation d’anesthésie.";

export const HOME_SUPPORT =
  "Parcourez un dossier démo, renseignez la conduite pour chaque médicament et produisez une synthèse claire pour le jour J.";

export const CONSULTATION_STEPS = [
  { id: "contexte", title: "Contexte opératoire", short: "Contexte" },
  { id: "allergies", title: "Allergies & alertes", short: "Allergies" },
  { id: "medicaments", title: "Médicaments préopératoires", short: "Médicaments" },
  { id: "terrain", title: "Terrain & voie aérienne", short: "Terrain" },
  { id: "synthese", title: "Synthèse", short: "Synthèse" },
] as const;

export const DECISION_LABELS: Record<string, string> = {
  continuer: "Poursuivre",
  suspendre: "Suspendre",
  adapter: "Adapter",
  a_discuter: "À discuter",
  non_renseigne: "Non renseigné",
};

export const DECISION_HINT =
  "Recommandation générée à partir des variables renseignées. Valider selon le contexte clinique.";
