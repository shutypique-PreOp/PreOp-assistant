/**
 * Indications compatibles par médicament — données de référence, sans logique clinique.
 */

export interface ThromboembolicRiskHelp {
  title: string;
  criteria: string[];
  source?: string;
}

export interface IndicationReference {
  id: string;
  drugId: string;
  label: string;
  requiresThromboembolicRisk: boolean;
  requiresRenalFunction: boolean;
  thromboembolicRiskHelp?: ThromboembolicRiskHelp;
}

export const INDICATION_CATALOG: IndicationReference[] = [
  {
    id: "apixaban-fa",
    drugId: "apixaban",
    label: "Fibrillation auriculaire",
    requiresThromboembolicRisk: true,
    requiresRenalFunction: true,
    thromboembolicRiskHelp: {
      title: "Risque thromboembolique en fibrillation auriculaire",
      criteria: [
        "Risque généralement élevé : antécédent d'AVC/AIT/embolie, score CHA₂DS₂-VASc ≥ 2 (H) ou ≥ 3 (F)",
        "Risque généralement non élevé : CHA₂DS₂-VASc 0–1 (H) ou 2 (F) sans antécédent thromboembolique",
        "En cas de doute, consulter le cardiologue ou l'avis spécialisé",
      ],
      source:
        "Aide à la classification — synthèse prototype, à valider selon protocole local",
    },
  },
  {
    id: "apixaban-tvp",
    drugId: "apixaban",
    label: "TVP / embolie pulmonaire",
    requiresThromboembolicRisk: true,
    requiresRenalFunction: true,
    thromboembolicRiskHelp: {
      title: "Risque thromboembolique en TVP / EP",
      criteria: [
        "Risque élevé : TVP/EP récente (< 3 mois), antécédent récidivant, thrombophilie non contrôlée",
        "Risque non élevé : TVP/EP ancienne (> 12 mois), traitement prolongé stable",
        "Situation intermédiaire : discuter au cas par cas",
      ],
      source:
        "Aide à la classification — synthèse prototype, à valider selon protocole local",
    },
  },
  {
    id: "apixaban-autre",
    drugId: "apixaban",
    label: "Autre indication",
    requiresThromboembolicRisk: true,
    requiresRenalFunction: true,
    thromboembolicRiskHelp: {
      title: "Risque thromboembolique",
      criteria: [
        "Évaluer le risque thromboembolique selon l'indication et le contexte clinique",
        "En l'absence de critères documentés pour cette indication, privilégier un avis spécialisé",
      ],
    },
  },
];

const byDrugId = new Map<string, IndicationReference[]>();

for (const indication of INDICATION_CATALOG) {
  const list = byDrugId.get(indication.drugId) ?? [];
  list.push(indication);
  byDrugId.set(indication.drugId, list);
}

export function getIndicationsForDrug(
  drugId: string,
): IndicationReference[] {
  return byDrugId.get(drugId) ?? [];
}

export function getIndicationById(
  id: string,
): IndicationReference | undefined {
  return INDICATION_CATALOG.find((i) => i.id === id);
}
