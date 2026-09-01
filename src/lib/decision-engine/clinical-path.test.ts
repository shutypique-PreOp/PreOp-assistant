import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { searchMedications } from "../medications/search";
import { searchSurgeries } from "../surgeries/search";
import { getSurgeryById } from "../surgeries";
import { evaluateMedication } from "./index";

describe("parcours de référence Eliquis → Apixaban → PTH → FA", () => {
  it("Eliquis retrouve Apixaban", () => {
    const results = searchMedications("Eliquis");
    assert.equal(results[0]?.drug.id, "apixaban");
    assert.equal(results[0]?.drug.dci, "Apixaban");
  });

  it("PTH est une chirurgie structurée avec risque hémorragique", () => {
    const results = searchSurgeries("PTH");
    assert.equal(results[0]?.surgery.id, "pth");
    assert.equal(results[0]?.surgery.label, "Prothèse totale de hanche");
    assert.equal(results[0]?.surgery.bleedingRisk, "élevé");

    const surgery = getSurgeryById("pth");
    assert.ok(surgery?.source);
  });

  it("aucune date calendaire sans date opératoire explicite", () => {
    const withoutDate = evaluateMedication({
      drugId: "apixaban",
      indicationId: "apixaban-fa",
      surgeryId: "pth",
      thromboembolicRisk: "non_eleve",
      renalFunction: "gte_50",
    });
    assert.equal(withoutDate.status, "incomplete");
    if (withoutDate.status === "incomplete") {
      assert.ok(withoutDate.missing.includes("surgeryDate"));
    }
    assert.equal(
      "calendarDates" in withoutDate ? withoutDate.calendarDates : undefined,
      undefined,
    );
  });

  it("génère une recommandation complète après saisie manuelle de la date", () => {
    const result = evaluateMedication({
      drugId: "apixaban",
      indicationId: "apixaban-fa",
      surgeryId: "pth",
      thromboembolicRisk: "non_eleve",
      renalFunction: "gte_50",
      surgeryDate: "2026-09-15",
    });

    assert.equal(result.status, "complete");
    if (result.status !== "complete") return;

    assert.match(result.recommendation.lastDose, /Dernière prise le/);
    assert.match(result.recommendation.lastDose, /2026/);
    assert.ok(result.recommendation.bridging.length > 0);
    assert.ok(result.recommendation.resume.length > 0);
    assert.ok(result.calendarDates?.lastDoseDate);
    assert.ok(result.calendarDates?.surgeryDate === "2026-09-15");
    assert.ok(
      result.reasoning.variables.some((v) => v.includes("Fibrillation auriculaire")),
    );
  });

  it("risque thromboembolique à déterminer bloque la recommandation", () => {
    const result = evaluateMedication({
      drugId: "apixaban",
      indicationId: "apixaban-fa",
      surgeryId: "pth",
      thromboembolicRisk: "a_determiner",
      renalFunction: "gte_50",
      surgeryDate: "2026-09-15",
    });
    assert.equal(result.status, "incomplete");
    if (result.status === "incomplete") {
      assert.ok(result.missing.includes("thromboembolicRisk"));
    }
  });
});
