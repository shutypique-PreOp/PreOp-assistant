import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { DEMO_CASE_TEMPLATES } from "@/lib/cases";

export default function ConsultationIndexPage() {
  return (
    <>
      <SiteHeader compact />
      <main className="main-pad">
        <div className="page-intro">
          <p className="eyebrow">Dossiers de démonstration</p>
          <h1>Choisir un cas</h1>
          <p>
            Deux parcours fictifs pour explorer la gestion préopératoire des
            médicaments. Les données restent en session locale.
          </p>
        </div>

        <div className="case-list">
          {DEMO_CASE_TEMPLATES.map((c) => (
            <Link
              key={c.id}
              href={`/consultation/${c.id}`}
              className="case-link"
            >
              <strong>{c.label}</strong>
              <span>
                {c.patientInitials} · {c.age} ans · {c.asa} ·{" "}
                {c.initialMedicationDrugIds.length} traitements initiaux ·
                risque {c.bleedingRisk}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
