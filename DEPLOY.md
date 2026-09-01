# Déploiement démo public

## Problème Vercel

Les previews Vercel de ce projet sont protégées par **Vercel Authentication** (SSO).
Sans connexion au compte Vercel du projet, les liens preview renvoient vers une page de login ou une erreur.

Le domaine `pre-op-assistant.vercel.app` pointe vers un ancien déploiement (404).

## Solution : GitHub Pages (public, sans login)

### Activation unique (30 secondes)

1. Ouvrir : https://github.com/shutypique-PreOp/PreOp-assistant/settings/pages
2. Sous **Build and deployment** → **Source** : choisir la branche **`gh-pages`** / dossier **`/(root)`**
3. Cliquer **Save**
4. Attendre 1–2 minutes

### URL publique attendue

**https://shutypique-preop.github.io/PreOp-assistant/**

Parcours de test direct :
**https://shutypique-preop.github.io/PreOp-assistant/consultation/case-ortopedie**

### Déclencher un nouveau déploiement

Le workflow `.github/workflows/deploy-pages.yml` se lance automatiquement à chaque push sur `cursor/clinical-workflow-e3e0` ou `main`.

Relance manuelle : Actions → Deploy GitHub Pages → Run workflow.

## Alternative Vercel (si vous préférez)

1. https://vercel.com/shutypique-6315s-projects/pre-op-assistant/settings/deployment-protection
2. Désactiver **Vercel Authentication** sur les Preview (ou ajouter votre email en exception)
3. Redéployer depuis la PR #4
