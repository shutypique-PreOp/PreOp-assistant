# PreOp Assistant — MVP UI

Prototype Next.js/TypeScript d’un assistant de consultation préopératoire.

Voir le [plan MVP](./PLAN.md) pour le découpage des tâches et le périmètre.

## Important

Cette version ne contient aucune recommandation médicale active. Elle ne doit
pas être utilisée pour une décision clinique. Les résultats sont uniquement
des emplacements d’interface.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Publier

1. Créer un dépôt GitHub vide.
2. Ajouter ces fichiers au dépôt et pousser la branche principale.
3. Dans Vercel, choisir **Add New > Project** puis importer le dépôt.
4. Conserver les réglages Next.js détectés automatiquement et déployer.

## Étape Supabase suivante

Supabase n’est pas encore nécessaire pour ce prototype. Le dossier
`supabase/schema.sql` contient une première structure de données destinée à
stocker des fiches et leurs versions après validation scientifique.
