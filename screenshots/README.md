# Captures d'écran TaskFlow Kanban

## Fichiers

| Fichier | Description |
|---------|-------------|
| `taskflow-login.png` | Page de connexion (Sign In) |
| `taskflow-register.png` | Page d'inscription (Create Account) |
| `taskflow-login-forbidden.png` | Page de connexion après tentative (erreur Forbidden dans ce contexte) |

## Tests exécutés

- **Backend** : `mvn test` — OK
- **Frontend** : `npm test -- --watch=false --browsers=ChromeHeadless` — 3 tests OK

## Captures dashboard / board

Pour obtenir des captures une fois connecté (dashboard, tableaux Kanban) :
1. Démarrer l’app complète : `docker-compose up -d` (Docker Desktop démarré)
2. Ouvrir http://localhost:4200 dans un navigateur
3. S’inscrire ou se connecter puis naviguer vers Dashboard / Workspaces / Board
4. Prendre les captures (Win+Shift+S ou outil de capture)
