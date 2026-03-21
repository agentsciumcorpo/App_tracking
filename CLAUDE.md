# Productivity Tracker App

## Projet

Application web de suivi de productivité quotidienne. L'utilisateur chronomètre ses tâches, les associe à des projets, les note sur 5, et obtient une analyse IA hebdomadaire.

## Stack technique

- **Frontend** : React 18+ (Vite), TypeScript, Tailwind CSS
- **Backend/BDD** : Supabase (PostgreSQL, Auth, Edge Functions)
- **IA** : API Anthropic (`claude-sonnet-4-20250514`) via Supabase Edge Functions
- **Déploiement** : Vercel ou Netlify (frontend), Supabase (backend)

## Structure du projet

```
src/
├── components/          # Composants React réutilisables
│   ├── ui/              # Composants UI de base (Button, Input, Card...)
│   ├── timer/           # Composants liés au timer
│   ├── projects/        # Composants liés aux projets
│   ├── history/         # Composants liés à l'historique
│   └── analysis/        # Composants liés à l'analyse IA
├── hooks/               # Custom hooks React
├── lib/                 # Utilitaires et configuration
│   ├── supabase.ts      # Client Supabase
│   └── utils.ts         # Fonctions utilitaires
├── types/               # Types TypeScript
├── pages/               # Vues principales (Timer, Historique, Projets, Analyse)
└── App.tsx              # Point d'entrée avec routing
```

## Conventions de code

- React fonctionnel uniquement (hooks, pas de classes)
- TypeScript strict
- Composants dans des fichiers individuels, nommés en PascalCase
- Hooks custom préfixés par `use` (ex: `useTimer`, `useProjects`)
- Tailwind CSS pour tout le styling, pas de CSS custom
- Dark mode par défaut
- Noms de variables et fonctions en anglais, commentaires en français si nécessaire

## Variables d'environnement

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`ANTHROPIC_API_KEY` est uniquement côté Supabase Edge Functions (jamais exposée au client).

## Commandes

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Linting
```

## Règles importantes

- Ne jamais exposer de clés API côté client
- Toujours utiliser les RLS Supabase — chaque requête est scopée par `user_id`
- Une seule tâche active (timer) à la fois par utilisateur
- Le timer actif est persisté dans `active_timers` pour survivre aux refresh
- Les durées sont stockées en minutes (integer), affichées en HH:MM:SS
- Les notes de productivité vont de 1 à 5, sont optionnelles

## OpenSpec

Ce projet utilise OpenSpec pour le développement spec-driven. Les spécifications sont dans `openspec/specs/`, les changements dans `openspec/changes/`.

- `/opsx:propose` — Proposer un nouveau changement
- `/opsx:apply` — Implémenter un changement
- `/opsx:archive` — Archiver un changement terminé
- `/opsx:explore` — Explorer une idée
