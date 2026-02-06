# Captures d'écran TaskFlow Kanban

## Fichiers

| Fichier | Description |
|---------|-------------|
| `01-login-page.png` | Page de connexion (Sign In) |
| `02-register-page.png` | Page d'inscription (Create Account) |
| `03-boards-empty.png` | Liste des boards (vide, après connexion) |
| `04-workspaces-empty.png` | Liste des workspaces (vide) |
| `05-create-workspace-modal.png` | Modal de création de workspace |
| `06-workspace-detail.png` | Détail d'un workspace |
| `07-create-board-modal.png` | Modal de création de board |
| `08-board-empty.png` | Tableau Kanban vide |
| `09-kanban-board-with-card.png` | Tableau Kanban avec colonnes et carte |
| `10-settings-page.png` | Page des paramètres |
| `11-activity-page.png` | Page d'activité (journal des actions) |
| `12-user-dropdown-menu.png` | Menu utilisateur (dropdown) |
| `13-profile-page.png` | Page de profil utilisateur |

## Tests exécutés

- **Backend** : `mvn test` — OK
- **Frontend** : `npm test -- --watch=false --browsers=ChromeHeadless` — 3 tests OK

## Fonctionnalités démontrées

- Authentification (inscription, connexion)
- Workspaces (création, liste, détail)
- Boards (création, colonnes, cartes)
- Paramètres (thème, notifications)
- Profil utilisateur
- Journal d'activité
