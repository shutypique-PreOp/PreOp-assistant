# PreOp Assistant — Plan MVP

**Copilote d’aide à la consultation pré-anesthésique**  
Statut : dépôt initial (README seul). Pas encore d’application déployable dans ce repo.  
Lien Vercel indiqué (`https://pre-op-assistant.vercel.app`) : actuellement 404.

## Objectif

Livrer un **prototype UI Next.js/TypeScript** qui structure le flux de consultation préopératoire, sans aucune recommandation médicale active. Les écrans et résultats sont des **emplacements d’interface** destinés à la démo et à la validation produit, pas à la décision clinique.

## Hors périmètre (MVP)

- Aucun moteur de décision clinique, score, ni alerte thérapeutique
- Pas d’authentification utilisateurs réellement sécurisée en production
- Pas d’intégration DPI / HL7 / FHIR
- Pas de génération LLM de conseils médicaux
- Supabase optionnel après stabilisation de l’UI (schéma prévu, pas bloquant)

## Personas & usage

| Persona | Besoin principal |
| --- | --- |
| Anesthésiste / MAR | Parcourir un dossier préop, saisir/contrôler les items, voir une synthèse UI |
| Chef de projet / scientifique | Valider la structure des fiches et le parcours avant contenu médical |
| Démo investisseur / partner | Parcours fluide, crédible, clairement non-clinique |

## Parcours MVP (écrans)

1. **Accueil** — identité produit, disclaimer non-clinique, CTA « démarrer »
2. **Sélection / création de fiche** — patient factice ou session démo locale
3. **Consultation guidée** — sections (antécédents, traitements, allergies, voie aérienne, cardio, etc.) en mode formulaire / checklist
4. **Synthèse** — résumé structuré des réponses (placeholders, pas de conclusion médicale)
5. **Export / aperçu** — impression ou PDF simple (optionnel si temps)

Chaque écran affiche un bandeau fixe : *Prototype — aucune recommandation médicale*.

## Architecture technique

```
app/ (Next.js App Router)
  layout, page, routes consultation/
components/  UI du parcours
lib/         types, mock data, copy disclaimer
supabase/    schema.sql (préparé, non branché au runtime MVP)
```

- **Stack** : Next.js + TypeScript + CSS modules ou Tailwind (un seul choix, cohérent)
- **État** : local (React state / URL) — pas de backend obligatoire
- **Données** : fixtures JSON pour 1–2 cas patients de démo
- **Hébergement** : Vercel (auto-détect Next.js)
- **Qualité** : ESLint, TypeScript strict, disclaimer partout

## Modèle de données (cible, aligné README)

Préparer `supabase/schema.sql` pour plus tard :

- `fiches` — identité de fiche / patient démo
- `fiche_versions` — contenu versionné après validation scientifique
- métadonnées : `status` (draft / reviewed / published), `validated_by`, `validated_at`

Le MVP UI lit des mocks ; l’écriture Supabase vient après.

## Découpage des tâches

### Phase 0 — Socle repo
- [ ] Initialiser Next.js/TypeScript (`package.json`, `app/`, configs)
- [ ] README aligné (commandes, disclaimer, lien déploiement)
- [ ] Page d’accueil + disclaimer + CTA

### Phase 1 — Parcours consultation
- [ ] Types TypeScript des sections de fiche
- [ ] Mock patient(s) + navigation par étapes
- [ ] Formulaires / checklists par section
- [ ] Écran synthèse (agrégation des réponses)

### Phase 2 — Polish démo
- [ ] Responsive mobile (source mobile du projet)
- [ ] États vides / progression
- [ ] Export impression CSS ou PDF léger
- [ ] Déploiement Vercel fonctionnel

### Phase 3 — Préparation données (post-MVP UI)
- [ ] `supabase/schema.sql` versionné
- [ ] Doc de validation scientifique des fiches
- [ ] Branchement lecture versions publiées (sans logique clinique)

## Critères d’acceptation MVP

1. `npm install && npm run dev` démarre l’app sur `:3000`
2. Un utilisateur peut parcourir un cas démo de bout en bout
3. Aucun texte ne présente de recommandation médicale active
4. Déploiement Vercel OK (plus de 404)
5. Code TypeScript sans erreur de build

## Risques & garde-fous

| Risque | Mitigation |
| --- | --- |
| Confusion usage clinique | Disclaimer permanent + README + copy UI |
| Scope creep « vraie IA médicale » | Bloquer toute génération de conseil dans le MVP |
| Repo vide vs expectations | Livrer le socle Next avant features avancées |
| Contenu métier non validé | Placeholders clairement étiquetés ; versions Supabase plus tard |

## Prochaine action concrète

Exécuter **Phase 0** : scaffold Next.js dans ce dépôt, page d’accueil avec disclaimer, puis enchaîner Phase 1 (parcours consultation mock).
