import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { HOME_SUPPORT, HOME_TAGLINE, PRODUCT_NAME } from "@/lib/copy";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="main-pad">
        <section className="hero">
          <p className="hero-brand">{PRODUCT_NAME}</p>
          <h1>{HOME_TAGLINE}</h1>
          <p className="hero-support">{HOME_SUPPORT}</p>
          <div className="hero-cta">
            <Link href="/consultation" className="btn btn-primary">
              Démarrer une consultation démo
            </Link>
            <a href="#fonctionnement" className="btn btn-secondary">
              Voir le fonctionnement
            </a>
          </div>
        </section>

        <section id="fonctionnement" className="section-block">
          <h2>Un parcours guidé, centré sur les traitements</h2>
          <p>
            Sélectionnez un dossier fictif, parcourez le contexte et les
            allergies, puis renseignez pour chaque médicament la conduite
            envisagée avant l’anesthésie. La synthèse regroupe vos saisies pour
            le jour J — sans moteur de décision clinique.
          </p>
        </section>
      </main>
    </>
  );
}
