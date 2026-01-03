# Backend Analysis - Board DTO Field Mismatch Issue

## 🔴 Problem Analysis

### Error Message
```
Unrecognized field "isPrivate" (class com.taskflow.kanban.board.dto.BoardCreateDto), 
not marked as ignorable (4 known properties: "workspaceId", "name", "description", "private"])
```

### Root Cause
**The backend DTO uses `isPrivate` but the error says it only recognizes `private`.**

This is contradictory because:
- **BoardCreateDto.java** (Backend) - Has: `private boolean isPrivate;`
- **Error Message** - Says backend only knows: `"workspaceId", "name", "description", "private"`
- **Frontend** - Sending: `private` (which is correct based on error)

## 🔍 Files Analyzed

### 1. BoardCreateDto.java (Backend)
```java
@Data
public class BoardCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private boolean isPrivate;  // ← Java field name
    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;
}
```

**Issue:** 
- Java field: `isPrivate`
- But error says backend expects: `private`

### 2. BoardUpdateDto.java (Backend)
```java
@Data
public class BoardUpdateDto {
    private String name;
    private String description;
    private Boolean isPrivate;  // ← Java field name
    private Boolean archived;
    private Integer position;
}
```

### 3. Board.java (Entity)
```java
@Entity
public class Board extends AuditableEntity {
    private String name;
    private String description;
    private boolean archived = false;
    private boolean isPrivate = false;  // ← Entity field
    // ...
}
```

### 4. BoardController.java
```java
@PostMapping
public BoardDto createBoard(@RequestBody @Valid BoardCreateDto createDto) {
    return boardService.createBoard(createDto);
}
```

## 🤔 Why The Discrepancy?

The error message mentions `"private"` instead of `"isPrivate"`. This could be due to:

1. **Jackson @JsonProperty Annotation** - If there's a `@JsonProperty("private")` annotation on the field
2. **Application.yml Configuration** - JSON naming strategy configured
3. **Backend Code** - Someone already added a fix (like `@JsonProperty` or `@JsonNaming`)

Let me check for Jackson annotations:

<search_needed>
Need to check if BoardCreateDto has:
- `@JsonProperty` annotations
- `@JsonNaming` class-level annotation
- OR if application.yml has `spring.jackson.property-naming-strategy`
</search_needed>

## ✅ Solution Options

### Option 1: Add Jackson Annotation (RECOMMENDED)
Add `@JsonProperty` to map the JSON field name:

```java
@Data
public class BoardCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    
    @JsonProperty("private")  // ← Maps JSON "private" to Java "isPrivate"
    private boolean isPrivate;
    
    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;
}
```

**Pros:** 
- Explicit and clear
- Works with both JSON naming conventions
- No breaking changes

**Cons:**
- Requires Java 14+ Lombok (ensure @Data doesn't conflict)

### Option 2: Rename Java Field
Rename `isPrivate` to `private` in DTOs:

```java
@Data
public class BoardCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private boolean private;  // ← Can't use "private" keyword in Java!
    // ERROR: "private" is a reserved keyword
}
```

**Pros:**
- Matches backend error message

**Cons:**
- `private` is a Java reserved keyword - IMPOSSIBLE!
- Would break the code

### Option 3: Use Snake Case with JsonNaming
Apply snake_case naming strategy:

```java
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Data
public class BoardCreateDto {
    // ...
}
```

**But this would convert `isPrivate` → `is_private`, not `private`**

### Option 4: Check Application Configuration
Check if `application.yml` has:

```yaml
spring:
  jackson:
    property-naming-strategy: SNAKE_CASE
    # or
    deserialization:
      READ_ENUMS_USING_TO_STRING: true
```

## 🎯 Recommended Fix

**Use Jackson @JsonProperty annotation** in both DTOs:

### BoardCreateDto.java
```java
package com.taskflow.kanban.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BoardCreateDto {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @JsonProperty("private")
    private boolean isPrivate;
    
    @NotNull(message = "Workspace ID is required")
    private UUID workspaceId;
}
```

### BoardUpdateDto.java
```java
package com.taskflow.kanban.board.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BoardUpdateDto {
    private String name;
    
    private String description;
    
    @JsonProperty("private")
    private Boolean isPrivate;
    
    private Boolean archived;
    
    private Integer position;
}
```

## 📊 Impact Analysis

| Aspect | Impact | Notes |
|--------|--------|-------|
| Frontend | ✅ No changes needed | Still sends `private` field |
| Backend | ✅ Small change | Add `@JsonProperty` annotation |
| Compatibility | ✅ Backward compatible | Old DTOs still work |
| API Contract | ✅ Consistent | JSON always uses `private` |
| Database | ✅ No changes | Entity field stays same |

## 🔄 Data Flow

### Before Fix (Current - BROKEN)
```
Frontend sends: { "private": true, ... }
    ↓
Jackson deserializes to Java
    ↓
Looks for field: "private" (from JSON)
    ↓
Finds: isPrivate (Java field)
    ↓
ERROR: Mismatch!
```

### After Fix (With @JsonProperty)
```
Frontend sends: { "private": true, ... }
    ↓
Jackson deserializes to Java
    ↓
Sees @JsonProperty("private") annotation
    ↓
Maps JSON "private" → Java isPrivate
    ↓
SUCCESS: Deserialization works!
```

## ✅ Steps to Fix

1. **Update BoardCreateDto.java**
   - Add: `import com.fasterxml.jackson.annotation.JsonProperty;`
   - Add: `@JsonProperty("private")` above `private boolean isPrivate;`

2. **Update BoardUpdateDto.java**
   - Add: `import com.fasterxml.jackson.annotation.JsonProperty;`
   - Add: `@JsonProperty("private")` above `private Boolean isPrivate;`

3. **Rebuild backend**
   - `mvn clean install` or `./mvnw clean install`

4. **Restart backend server**
   - Server should now accept `"private"` field from frontend

5. **Test board creation**
   - Frontend sends: `{ private: true, ... }`
   - Backend receives and deserializes correctly
   - ✅ Should work!

## 📝 Summary

| Item | Details |
|------|---------|
| **Issue** | JSON/Java field name mismatch (`private` vs `isPrivate`) |
| **Root Cause** | Missing Jackson @JsonProperty annotation |
| **Solution** | Add `@JsonProperty("private")` to both DTOs |
| **Frontend Impact** | None - keep sending `private` field |
| **Backend Impact** | Add 2 annotations to 2 files |
| **Testing** | Create a board and verify no JSON error |
| **Rollback Risk** | Very low - only affects deserialization |

---

**Status:** Ready to implement ✅
**Effort:** 5 minutes
**Risk:** Minimal
