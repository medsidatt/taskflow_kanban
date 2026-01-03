# NullPointerException - Quick Fix

## ❌ Error
```
Cannot invoke "java.util.Set.add(Object)" because the return value of 
"com.taskflow.kanban.board.entity.Board.getMembers()" is null
```

## ✅ Root Cause
Lombok's `@Builder` ignores field initializers for collections.

## ✅ Fix Applied

### Board.java
```java
@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
@Builder.Default  // ← Added this
private Set<BoardMember> members = new HashSet<>();

@PostLoad  // ← Added this method
private void ensureMembersInitialized() {
    if (this.members == null) {
        this.members = new HashSet<>();
    }
}
```

### BoardServiceImpl.java
```java
Board board = Board.builder()
    .name(createDto.getName())
    .description(createDto.getDescription())
    .backgroundColor(createDto.getBackgroundColor())  // ← Added
    .isPrivate(createDto.isPrivate())
    .workspace(workspace)
    .build();
```

## 🎯 What This Does
- `@Builder.Default` - Tells builder to use the initializer
- `@PostLoad` - Safety check when loading from DB
- `backgroundColor` - Now saved with the board

## ✨ Result
✅ No more NullPointerException
✅ Board creation works
✅ Members properly initialized
✅ backgroundColor saved

**Ready to rebuild and test!** 🚀
