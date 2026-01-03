# Backend-to-Frontend Integration Mapping

## Executive Summary

This document maps all backend entities, DTOs, and APIs to their corresponding frontend models and services. It serves as the **single source of truth** for frontend development.

---

## 1. Core Entities & Their Relationships

```
User (UUID id)
  └── has many → WorkspaceMember
  └── has many → BoardMember
  └── has many → CardMember
  └── has many → Comment (author)

Workspace (UUID id)
  ├── has many → WorkspaceMember (with roles)
  └── has many → Board

Board (UUID id)
  ├── belongs to → Workspace
  ├── has many → BoardMember (with roles)
  ├── has many → BoardColumn
  └── has many → Label

BoardColumn (UUID id)
  ├── belongs to → Board
  └── has many → Card

Card (UUID id)
  ├── belongs to → BoardColumn
  ├── has many → CardMember (with roles)
  ├── has many-to-many → Label
  ├── has many → Comment
  ├── has many → Attachment
  └── tracked by → ActivityLog

ActivityLog (UUID id)
  └── tracks → any entity (entityId + entityType)

Comment (UUID id)
  ├── belongs to → Card
  └── belongs to → User (author)
```

---

## 2. Role & Permission Model

### WorkspaceRole (Enum)
- `OWNER` - Full control, can delete workspace
- `ADMIN` - Can manage members and boards
- `MEMBER` - Can create boards and cards
- `VIEWER` - Read-only access

### BoardRole (Enum)
- `OWNER` - Full control of board
- `ADMIN` - Can manage board settings and members
- `MEMBER` - Can edit cards
- `VIEWER` - Read-only access

### CardRole (Enum)
- `ASSIGNEE` - Assigned to work on the card
- `WATCHER` - Receives notifications

---

## 3. Backend DTOs → Frontend Models Mapping

### Authentication

**Backend DTOs:**
- `LoginDto` → `{ usernameOrEmail: string, password: string }`
- `RegisterDto` → `{ username: string, email: string, password: string }`
- `AuthResponseDto` → `{ accessToken: string, refreshToken: string, user: UserSummaryDto }`

**Frontend Models Required:**
```typescript
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

### User

**Backend DTO:**
- `UserSummaryDto` → `{ id: UUID, username: string, email: string }`
- `UserProfileDto` → adds `active`, `lastLogin`
- `UserResponseDto` → adds `roles: RoleDto[]`

**Frontend Model Required:**
```typescript
interface User {
  id: string; // UUID
  username: string;
  email: string;
  active?: boolean;
  lastLogin?: string;
  roles?: Role[];
}

interface Role {
  id: string;
  name: string;
  description?: string;
}
```

### Workspace

**Backend DTO:**
```java
WorkspaceDto {
  UUID id;
  String name;
  String description;
  boolean isPrivate;
}
```

**Frontend Model Required:**
```typescript
interface Workspace {
  id: string; // UUID
  name: string;
  description?: string;
  isPrivate: boolean;
  // Computed from members array if needed
  memberCount?: number;
  boardCount?: number;
}

interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  username?: string;
  email?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}
```

### Board

**Backend DTO:**
```java
BoardDto {
  UUID id;
  String name;
  String description;
  boolean archived;
  boolean isPrivate;
  UUID workspaceId;
  int position;
}
```

**Frontend Model Required:**
```typescript
interface Board {
  id: string; // UUID
  name: string;
  description?: string;
  archived: boolean;
  isPrivate: boolean;
  workspaceId: string; // UUID
  position: number;
  // Extended for UI
  columns?: BoardColumn[];
}

interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  username?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}
```

### BoardColumn

**Backend DTO:**
```java
ColumnDto {
  UUID id;
  String name;
  int position;
  Integer wipLimit;
  boolean archived;
  UUID boardId;
}
```

**Frontend Model Required:**
```typescript
interface BoardColumn {
  id: string; // UUID
  name: string;
  position: number;
  wipLimit?: number;
  archived: boolean;
  boardId: string; // UUID
  // Extended for UI
  cards?: Card[];
}
```

### Card

**Backend DTO:**
```java
CardDto {
  UUID id;
  String title;
  String description;
  int position;
  boolean archived;
  Instant dueDate;
  Instant startDate;
  Integer priority; // 1 = highest
  UUID columnId;
  Set<CardMemberDto> members;
}
```

**Frontend Model Required:**
```typescript
interface Card {
  id: string; // UUID
  title: string;
  description?: string;
  position: number;
  archived: boolean;
  dueDate?: string; // ISO 8601
  startDate?: string; // ISO 8601
  priority?: number; // 1 = highest, 2, 3, etc.
  columnId: string; // UUID
  members?: CardMember[];
  labels?: Label[];
  // Extended for UI
  commentCount?: number;
  attachmentCount?: number;
}

interface CardMember {
  id: string;
  cardId: string;
  userId: string;
  username?: string;
  email?: string;
  role: 'ASSIGNEE' | 'WATCHER';
}
```

### Label

**Backend DTO:**
```java
LabelDto {
  UUID id;
  String name;
  String color;
  UUID boardId;
}
```

**Frontend Model Required:**
```typescript
interface Label {
  id: string; // UUID
  name: string;
  color: string; // Hex color
  boardId: string; // UUID
}
```

### Comment

**Backend DTO:**
```java
CommentDto {
  UUID id;
  String content;
  boolean edited;
  UUID cardId;
  UUID authorId;
  String authorUsername;
  Instant createdAt;
  Instant updatedAt;
}
```

**Frontend Model Required:**
```typescript
interface Comment {
  id: string; // UUID
  content: string;
  edited: boolean;
  cardId: string;
  authorId: string;
  authorUsername: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}
```

### ActivityLog

**Backend DTO:**
```java
ActivityLogDto {
  UUID id;
  UUID entityId;
  String entityType;
  String action; // CREATED, UPDATED, MOVED, DELETED
  String details;
  Instant timestamp;
  UUID performedBy;
}
```

**Frontend Model Required:**
```typescript
interface ActivityLog {
  id: string;
  entityId: string;
  entityType: string;
  action: string;
  details: string;
  timestamp: string;
  performedBy: string;
  // Extended for UI
  performedByUsername?: string;
}
```

---

## 4. API Endpoints Mapping

### Base URL
- Backend: `http://localhost:8080/api`
- Environment variable: `environment.apiUrl`

### Authentication Endpoints

| Method | Endpoint | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|----------|------------------------|
| POST | `/auth/login` | `LoginDto` | `AuthResponseDto` | `authService.login()` |
| POST | `/auth/register` | `RegisterDto` | `AuthResponseDto` | `authService.register()` |
| POST | `/auth/refresh` | `RefreshTokenDto` | `AuthResponseDto` | `authService.refreshToken()` |
| POST | `/auth/logout` | - | 204 | `authService.logout()` |

### Workspace Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/workspaces` | - | - | `List<WorkspaceDto>` | `workspaceService.getAllWorkspaces()` |
| GET | `/workspaces/{id}` | - | - | `WorkspaceDto` | `workspaceService.getById(id)` |
| POST | `/workspaces` | - | `WorkspaceCreateDto` | `WorkspaceDto` | `workspaceService.create()` |
| PUT | `/workspaces/{id}` | - | `WorkspaceUpdateDto` | `WorkspaceDto` | `workspaceService.update(id)` |
| DELETE | `/workspaces/{id}` | - | - | 204 | `workspaceService.delete(id)` |
| POST | `/workspaces/{id}/members/{userId}` | - | - | 204 | `workspaceService.addMember()` |
| DELETE | `/workspaces/{id}/members/{userId}` | - | - | 204 | `workspaceService.removeMember()` |
| PUT | `/workspaces/{id}/members/{userId}` | - | `WorkspaceMemberUpdateDto` | 204 | `workspaceService.updateMemberRole()` |

### Board Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/boards` | `workspaceId` | - | `List<BoardDto>` | `boardService.getBoardsByWorkspace(workspaceId)` |
| GET | `/boards/{id}` | - | - | `BoardDto` | `boardService.getById(id)` |
| POST | `/boards` | - | `BoardCreateDto` | `BoardDto` | `boardService.create()` |
| PUT | `/boards/{id}` | - | `BoardUpdateDto` | `BoardDto` | `boardService.update(id)` |
| DELETE | `/boards/{id}` | - | - | 204 | `boardService.delete(id)` |
| POST | `/boards/{id}/members/{userId}` | - | - | 204 | `boardService.addMember()` |
| DELETE | `/boards/{id}/members/{userId}` | - | - | 204 | `boardService.removeMember()` |
| PUT | `/boards/{id}/members/{userId}` | - | `BoardMemberUpdateDto` | 204 | `boardService.updateMemberRole()` |

### Column Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/columns` | `boardId` | - | `List<ColumnDto>` | `columnService.getColumnsByBoard(boardId)` |
| GET | `/columns/{id}` | - | - | `ColumnDto` | `columnService.getById(id)` |
| POST | `/columns` | - | `ColumnCreateDto` | `ColumnDto` | `columnService.create()` |
| PUT | `/columns/{id}` | - | `ColumnUpdateDto` | `ColumnDto` | `columnService.update(id)` |
| DELETE | `/columns/{id}` | - | - | 204 | `columnService.delete(id)` |

### Card Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/cards` | `columnId` | - | `List<CardDto>` | `cardService.getCardsByColumn(columnId)` |
| GET | `/cards/{id}` | - | - | `CardDto` | `cardService.getById(id)` |
| POST | `/cards` | - | `CardCreateDto` | `CardDto` | `cardService.create()` |
| PUT | `/cards/{id}` | - | `CardUpdateDto` | `CardDto` | `cardService.update(id)` |
| DELETE | `/cards/{id}` | - | - | 204 | `cardService.delete(id)` |
| PUT | `/cards/{id}/move` | - | `CardMoveDto` | 204 | `cardService.move(id, targetColumnId, newPosition)` |
| POST | `/cards/{id}/assignees/{userId}` | - | - | 204 | `cardService.addAssignee()` |
| DELETE | `/cards/{id}/assignees/{userId}` | - | - | 204 | `cardService.removeAssignee()` |

**CardMoveDto:**
```typescript
interface CardMoveDto {
  targetColumnId: string; // UUID
  newPosition: number;
}
```

### Comment Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/comments/cards/{cardId}` | - | - | `List<CommentDto>` | `commentService.getByCard(cardId)` |
| POST | `/comments` | - | `CommentCreateDto` | `CommentDto` | `commentService.create()` |
| PUT | `/comments/{id}` | - | `string` (content) | `CommentDto` | `commentService.update(id, content)` |
| DELETE | `/comments/{id}` | - | - | 204 | `commentService.delete(id)` |

### Activity Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/activities` | `entityId` | - | `List<ActivityLogDto>` | `activityService.getByEntity(entityId)` |

### Label Endpoints

| Method | Endpoint | Query Params | Request Body | Response | Frontend Service Method |
|--------|----------|--------------|--------------|----------|------------------------|
| GET | `/labels` | `boardId` | - | `List<LabelDto>` | `labelService.getByBoard(boardId)` |
| POST | `/labels` | - | `LabelCreateDto` | `LabelDto` | `labelService.create()` |
| PUT | `/labels/{id}` | - | `LabelUpdateDto` | `LabelDto` | `labelService.update(id)` |
| DELETE | `/labels/{id}` | - | - | 204 | `labelService.delete(id)` |

---

## 5. Data Loading Strategy

### Application Startup Flow:
1. User logs in → Store tokens + user in localStorage
2. Navigate to dashboard → Load workspaces
3. Select workspace → Load boards for that workspace
4. Open board → Load columns + cards for that board
5. Open card → Load comments + activities for that card

### Efficient Data Loading:
- **Workspace List**: Load once on dashboard, cache
- **Board List**: Load per workspace, cache by workspaceId
- **Board Details**: Load columns + cards together when opening board
- **Card Details**: Lazy load comments/activities when opening card modal

---

## 6. Key Differences Between Current Frontend & Backend

### Issues to Fix:

1. **ID Types**: 
   - ❌ Frontend uses `number`
   - ✅ Backend uses `UUID` (string)
   - **Fix**: Change all `id` fields to `string`

2. **API URLs**:
   - ❌ Frontend has hardcoded mock data in `board.service.ts`
   - ✅ Backend has actual REST endpoints
   - **Fix**: Replace all mock data with real HTTP calls

3. **Priority Field**:
   - ❌ Frontend uses `'HIGH' | 'MEDIUM' | 'LOW'`
   - ✅ Backend uses `Integer` (1 = highest, 2, 3, etc.)
   - **Fix**: Use `number` type, map to UI labels

4. **Missing Services**:
   - ❌ No `column.service.ts`
   - ❌ No `card.service.ts`
   - ❌ No `comment.service.ts`
   - ❌ No `activity.service.ts`
   - ❌ No `label.service.ts`
   - **Fix**: Create all missing services

5. **Workspace Model**:
   - ❌ Frontend has `ownerId`
   - ✅ Backend has `members` with roles
   - **Fix**: Remove `ownerId`, use members array

6. **Board Columns**:
   - ✅ Frontend already embeds columns in board
   - ⚠️ Backend returns them separately
   - **Fix**: Fetch columns separately or extend DTO

---

## 7. Drag & Drop Implementation

### Backend Integration:
- Use `PUT /cards/{id}/move` endpoint
- Send `CardMoveDto { targetColumnId, newPosition }`
- Backend handles reordering other cards

### Frontend Flow:
1. User drags card
2. Update UI optimistically
3. Call `cardService.move(cardId, targetColumnId, newPosition)`
4. On error, rollback UI
5. On success, keep optimistic UI

### Position Calculation:
- When dropping at index `i` in column:
  - `newPosition = i`
- Backend will adjust other cards' positions

---

## 8. Permission Checks in UI

### Workspace Level:
- **OWNER/ADMIN**: Show "Add Board", "Settings", "Members"
- **MEMBER**: Show "Add Board"
- **VIEWER**: Hide all edit buttons

### Board Level:
- **OWNER/ADMIN**: Show "Edit Board", "Delete Board", "Add Column", "Manage Members"
- **MEMBER**: Show "Add Column", "Edit Cards"
- **VIEWER**: Hide all edit buttons

### Card Level:
- **ASSIGNEE**: Can edit card
- **WATCHER**: Can comment only
- **Others with board MEMBER+**: Can edit

### Implementation:
Create a `permissions.service.ts` that checks current user's role:

```typescript
canEditBoard(board: Board, currentUser: User): boolean {
  // Check if user has OWNER/ADMIN/MEMBER role in board
}

canDeleteCard(card: Card, currentUser: User): boolean {
  // Check if user has appropriate permissions
}
```

---

## 9. UI/UX Requirements

### Professional SaaS Dashboard:
- **Left Sidebar**: Workspace switcher + Board list
- **Top Navbar**: User menu, notifications, search
- **Main Content**: Board view (Trello-style horizontal columns)
- **Card Modal**: Opens on click, shows details + activity timeline

### Component Structure:
```
app/
├── shared/
│   ├── components/
│   │   ├── sidebar/              (Workspace & board navigation)
│   │   ├── navbar/               (Top navigation)
│   │   ├── loading-spinner/
│   │   └── empty-state/
│   └── layouts/
│       └── main-layout/          (Sidebar + Navbar + Content)
├── features/
│   ├── workspace/
│   │   ├── components/
│   │   │   ├── workspace-list/
│   │   │   ├── workspace-card/
│   │   │   └── workspace-settings/
│   │   └── pages/
│   │       └── workspace-dashboard/
│   ├── board/
│   │   ├── components/
│   │   │   ├── board-header/
│   │   │   ├── board-column/
│   │   │   ├── board-card/
│   │   │   ├── card-detail-modal/
│   │   │   ├── add-card-form/
│   │   │   └── add-column-form/
│   │   └── pages/
│   │       ├── board-list/
│   │       └── board-view/
│   └── auth/
│       └── (existing)
```

### Icon Library:
- Use **Lucide Angular** or **Angular Material Icons**
- NO EMOJIS - only professional SVG icons

### Styling:
- Use **Tailwind CSS** (already configured)
- Color scheme: Professional blues/grays
- Consistent spacing using Tailwind utilities

---

## 10. Implementation Priority

### Phase 1: Core Data Integration (This Phase)
1. ✅ Update all frontend models to use UUID (string)
2. ✅ Create missing services (column, card, comment, activity, label)
3. ✅ Replace mock data with real API calls
4. ✅ Fix priority field (use number instead of enum)

### Phase 2: UI Components
1. Update sidebar to show workspaces + boards
2. Create board view with horizontal columns
3. Implement card modal with tabs (details, activity, comments)
4. Add loading/error/empty states

### Phase 3: Interactions
1. Implement drag & drop for cards
2. Add inline editing for card titles
3. Add "Add Card" and "Add Column" forms
4. Implement card detail editing

### Phase 4: Advanced Features
1. Implement permissions-based UI
2. Add activity timeline
3. Add comment system
4. Add label management
5. Add member assignment

---

## 11. Testing Strategy

### Unit Tests:
- Services: Mock HttpClient
- Components: Test with mock services

### Integration Tests:
- Test actual API calls against running backend
- Verify data flow: workspace → board → column → card

### E2E Tests:
- Login → Create workspace → Create board → Add cards → Drag & drop

---

## CONCLUSION

This mapping provides everything needed to properly integrate the frontend with the backend. The key principles:

1. **Use backend DTOs as the contract** - Don't invent fields
2. **UUID everywhere** - Backend uses UUID, frontend must match
3. **Real API calls only** - No more mock data
4. **Permission-aware UI** - Respect backend role enforcement
5. **Professional UI** - Icons, not emojis

All frontend models, services, and components must align with this mapping.
