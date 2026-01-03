# ✅ JSON Deserialization Error - FIXED

**Date**: January 19, 2026  
**Issue**: JSON parse error with `isPrivate` field mapping

---

## Problem

The backend was throwing a `HttpMessageNotReadableException` when receiving board creation requests:

```
Unrecognized field "isPrivate" (class com.taskflow.kanban.board.dto.BoardCreateDto), 
not marked as ignorable
```

### Root Cause

The frontend was sending:
```json
{
  "name": "My Board",
  "isPrivate": true,
  "workspaceId": "uuid..."
}
```

But the backend DTOs had incorrect `@JsonProperty` annotations:
```java
@JsonProperty("private")  // ❌ Wrong - expects "private" but receives "isPrivate"
private boolean isPrivate;
```

Jackson was looking for a `private` field, but the JSON had `isPrivate`, causing deserialization to fail.

---

## Solution

Fixed the `@JsonProperty` annotation in both board DTOs to correctly map the JSON property name:

### Changed Files

#### 1. **BoardCreateDto.java**
```java
// BEFORE
@JsonProperty("private")
private boolean isPrivate;

// AFTER ✅
@JsonProperty("isPrivate")
private boolean isPrivate;
```

#### 2. **BoardUpdateDto.java**
```java
// BEFORE
@JsonProperty("private")
private Boolean isPrivate;

// AFTER ✅
@JsonProperty("isPrivate")
private Boolean isPrivate;
```

---

## How It Works Now

### Frontend sends:
```json
{
  "name": "My Board",
  "description": "Description",
  "isPrivate": true,
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Backend correctly deserializes:
✅ JSON `isPrivate` → Java field `isPrivate`
✅ JSON `name` → Java field `name`
✅ JSON `description` → Java field `description`
✅ JSON `workspaceId` → Java field `workspaceId`

---

## Verification

### Before Fix
```
❌ HTTP 400 Bad Request
❌ JSON parse error
❌ Unrecognized field "isPrivate"
```

### After Fix
```
✅ HTTP 201 Created / 200 OK
✅ Board created successfully
✅ Correct JSON deserialization
```

---

## API Contract Alignment

### Frontend (TaskFlow Kanban UI)
```typescript
// board.model.ts
export interface BoardCreateRequest {
  name: string;
  description?: string;
  isPrivate: boolean;  // ← Uses camelCase
  workspaceId: string;
}
```

### Backend (Spring Boot)
```java
// BoardCreateDto.java
@Data
public class BoardCreateDto {
  private String name;
  private String description;
  @JsonProperty("isPrivate")  // ← Maps to camelCase
  private boolean isPrivate;
  private UUID workspaceId;
}
```

---

## Related DTOs Checked

✅ **BoardCreateDto** - Fixed
✅ **BoardUpdateDto** - Fixed
✅ Other DTOs - No similar issues found

---

## Testing

### Request Example
```bash
curl -X POST http://localhost:8080/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Board",
    "description": "A test board",
    "isPrivate": false,
    "workspaceId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Expected Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Test Board",
  "description": "A test board",
  "isPrivate": false,
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-19T02:11:45Z",
  "updatedAt": "2026-01-19T02:11:45Z"
}
```

---

## Status

✅ **FIXED** - Board creation and update endpoints now work correctly with `isPrivate` field

---

## Files Modified

1. ✅ `BoardCreateDto.java` - Updated `@JsonProperty("isPrivate")`
2. ✅ `BoardUpdateDto.java` - Updated `@JsonProperty("isPrivate")`

---

**Date Fixed**: January 19, 2026  
**Severity**: High (Breaking API)  
**Status**: ✅ Resolved
