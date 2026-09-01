# PreOp Assistant — MVP UI

Prototype Next.js/TypeScript d’un copilote de consultation préopératoire, centré
sur la **gestion des médicaments avant anesthésie**.

Voir le [plan MVP](./PLAN.md) pour le découpage des tâches et le périmètre.

## Important

Cette version ne contient **aucune recommandation médicale active**. Elle ne doit
pas être utilisée pour une décision clinique. Les résultats sont des saisies
clinicien et des emplacements d’interface.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Parcours

1. Accueil — identité produit + disclaimer
2. Sélection d’un dossier démo
3. Consultation guidée — contexte, allergies, médicaments, terrain
4. Synthèse imprimable — plan médicamenteux renseigné par le clinicien

L’état de saisie est conservé en `sessionStorage` pour la durée de la session
navigateur.

## Publier

1. Pousser la branche sur GitHub
2. Dans Vercel : **Add New > Project**, importer le dépôt
3. Conserver les réglages Next.js détectés automatiquement et déployer

## Étape Supabase suivante

Supabase n’est pas branché au runtime dans ce MVP. Le fichier
`supabase/schema.sql` prépare le stockage de fiches et de versions après
validation scientifique.
