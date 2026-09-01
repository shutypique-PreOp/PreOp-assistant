import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findMedicationByAnyName, searchMedications } from "./search";

describe("searchMedications", () => {
  it("trouve Eliquis via apixaban (DCI)", () => {
    const results = searchMedications("apixaban");
    assert.ok(results.some((r) => r.drug.id === "apixaban"));
    assert.ok(
      results.some(
        (r) =>
          r.drug.id === "apixaban" &&
          r.drug.commercialNames.includes("Eliquis"),
      ),
    );
  });

  it("trouve apixaban via Eliquis (nom commercial)", () => {
    const results = searchMedications("Eliquis");
    assert.equal(results[0]?.drug.id, "apixaban");
    assert.equal(results[0]?.matchedOn, "commercial");
    assert.equal(results[0]?.matchedLabel, "Eliquis");
  });

  it("est insensible à la casse", () => {
    const lower = searchMedications("eliquis");
    const upper = searchMedications("ELIQUIS");
    assert.equal(lower[0]?.drug.id, "apixaban");
    assert.equal(upper[0]?.drug.id, "apixaban");
  });

  it("est insensible aux accents", () => {
    const results = searchMedications("enoxaparine");
    assert.ok(results.some((r) => r.drug.id === "enoxaparine"));

    const accented = searchMedications("énoxaparine");
    assert.ok(accented.some((r) => r.drug.id === "enoxaparine"));
  });

  it("trouve Plavix via clopidogrel et inversement", () => {
    const fromDci = searchMedications("clopidogrel");
    assert.equal(fromDci[0]?.drug.id, "clopidogrel");

    const fromBrand = searchMedications("Plavix");
    assert.equal(fromBrand[0]?.drug.id, "clopidogrel");
    assert.equal(fromBrand[0]?.matchedLabel, "Plavix");
  });

  it("trouve metformine via Glucophage", () => {
    const results = searchMedications("Glucophage");
    assert.equal(results[0]?.drug.id, "metformine");
  });

  it("trouve bisoprolol via Cardensiel", () => {
    const results = searchMedications("Cardensiel");
    assert.equal(results[0]?.drug.id, "bisoprolol");
  });

  it("retourne une liste vide pour une requête vide", () => {
    assert.deepEqual(searchMedications(""), []);
    assert.deepEqual(searchMedications("   "), []);
  });

  it("findMedicationByAnyName résout un nom commercial", () => {
    const drug = findMedicationByAnyName("Xarelto");
    assert.equal(drug?.id, "rivaroxaban");
    assert.equal(drug?.dci, "Rivaroxaban");
  });
});
