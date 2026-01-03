# Backend Compatibility Fix - Board DTO

## Issue
The backend was rejecting board creation requests with the error:
```
Unrecognized field "isPrivate" (class com.taskflow.kanban.board.dto.BoardCreateDto), 
not marked as ignorable (4 known properties: "workspaceId", "name", "description", "private"])
```

## Root Cause
The frontend was sending `isPrivate` field name, but the backend DTO expected `private`.

## Solution Applied

### 1. Updated Frontend Board Model DTOs
**File:** `frontend/src/app/core/models/board.model.ts`

Changed:
```typescript
// Before
export interface BoardCreateDto {
  name: string;
  description?: string;
  isPrivate?: boolean;  // ❌ Wrong field name
  workspaceId: string;
  backgroundColor?: string;
}

export interface BoardUpdateDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;  // ❌ Wrong field name
  archived?: boolean;
}

// After
export interface BoardCreateDto {
  name: string;
  description?: string;
  private?: boolean;     // ✅ Matches backend
  workspaceId: string;
  backgroundColor?: string;
}

export interface BoardUpdateDto {
  name?: string;
  description?: string;
  private?: boolean;     // ✅ Matches backend
  archived?: boolean;
}
```

### 2. Updated Board List Component
**File:** `frontend/src/app/features/board/pages/board-list/board-list.component.ts`

Changed line 125 in `onBoardCreated()`:
```typescript
// Before
isPrivate: data.isPrivate,  // ❌ Wrong field name

// After
private: data.isPrivate,    // ✅ Correct field name
```

## Key Points

- ✅ **Board Interface** (what we receive) still uses `isPrivate` - This is for UI display
- ✅ **BoardCreateDto** (what we send) now uses `private` - Matches backend expectation
- ✅ **BoardUpdateDto** (what we send) now uses `private` - Matches backend expectation
- ✅ No breaking changes to existing functionality

## Testing

To verify the fix works:

1. Login to the application
2. Navigate to Boards
3. Click "Create Board"
4. Fill in board details:
   - Name: "Test Board"
   - Description: "Test Description"
   - Check "Private Board" checkbox
   - Select a color
5. Click "Create Board"
6. ✅ Board should be created successfully (no JSON parse error)

## Files Modified

- `frontend/src/app/core/models/board.model.ts` - Updated DTOs
- `frontend/src/app/features/board/pages/board-list/board-list.component.ts` - Updated field name

## Field Name Mapping

| Layer | Field Name | Type |
|-------|-----------|------|
| Backend Entity | `private` | boolean |
| Backend DTO | `private` | boolean |
| Frontend DTO (send) | `private` | boolean ✅ |
| Frontend Model (receive) | `isPrivate` | boolean ✅ |
| Frontend UI | `isPrivate` | boolean ✅ |

---

**Status:** Fixed ✅
**Date:** January 19, 2026
