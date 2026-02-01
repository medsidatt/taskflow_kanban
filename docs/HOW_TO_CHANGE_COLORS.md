# How to Change Colors for Columns and Cards

## Overview

Columns and cards support custom colors. If no custom color is set, they use default auto-assigned colors.

## Current Default Colors

### Column Default Palette
Located in `frontend/src/app/features/board/components/board-column/board-column.component.ts`:
```typescript
const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#764ba2'];
```

These colors are assigned automatically based on column position (0-5, then repeats).

### Card Colors
- **Custom color**: If `card.color` is set, it uses that color
- **Priority-based**: If no custom color, uses priority colors:
  - High priority: `#ef4444` (red)
  - Medium priority: `#f59e0b` (orange)
  - Low priority: `#06b6d4` (cyan)

## Methods to Change Colors

### Method 1: Change Default Palette

Edit the color array in `board-column.component.ts`:

```typescript
getColumnColor(): string {
  if (this.column.color) {
    return this.column.color;
  }
  // Change these colors to your preferred palette
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899'  // Pink
  ];
  return colors[this.column.position % colors.length];
}
```

### Method 2: Set Custom Colors via API

#### For Columns

**Update a column's color:**
```typescript
import { ColumnService } from '@app/core/services/column.service';

// In your component
constructor(private columnService: ColumnService) {}

updateColumnColor(columnId: string, color: string): void {
  this.columnService.updateColumn(columnId, { color })
    .subscribe({
      next: (updatedColumn) => {
        console.log('Column color updated:', updatedColumn);
        // The UI will automatically reflect the new color
      },
      error: (error) => {
        console.error('Failed to update column color:', error);
      }
    });
}

// Example usage:
updateColumnColor('column-uuid-here', '#ff6b6b');
```

#### For Cards

**Update a card's color:**
```typescript
import { CardService } from '@app/core/services/card.service';

// In your component
constructor(private cardService: CardService) {}

updateCardColor(cardId: string, color: string): void {
  this.cardService.updateCard(cardId, { color })
    .subscribe({
      next: (updatedCard) => {
        console.log('Card color updated:', updatedCard);
        // The UI will automatically reflect the new color
      },
      error: (error) => {
        console.error('Failed to update card color:', error);
      }
    });
}

// Example usage:
updateCardColor('card-uuid-here', '#4ecdc4');
```

**Create a card with a color:**
```typescript
const newCard: CardCreateDto = {
  title: 'My New Card',
  columnId: 'column-uuid',
  color: '#ff6b6b' // Set color when creating
};

this.cardService.createCard(newCard).subscribe(...);
```

### Method 3: Set Colors in Backend

If you're setting colors directly in the database or backend:

**Column Entity:**
```java
// In your backend Column entity
column.setColor("#ff6b6b");
columnRepository.save(column);
```

**Card Entity:**
```java
// In your backend Card entity
card.setColor("#4ecdc4");
cardRepository.save(card);
```

## Color Format

- **Format**: Hex color codes (e.g., `#ff6b6b`, `#4ecdc4`)
- **Examples**:
  - Red: `#ef4444` or `#ff6b6b`
  - Blue: `#3b82f6` or `#4facfe`
  - Green: `#10b981` or `#43e97b`
  - Purple: `#8b5cf6` or `#764ba2`
  - Orange: `#f59e0b` or `#fa709a`
  - Pink: `#ec4899` or `#f093fb`

## Visual Effects

### Columns
- **Border**: Left border uses the full color (4px solid)
- **Background**: Header uses 8% opacity of the color
- **Badge**: Card count badge uses the full color with white text

### Cards
- **Border**: Left border uses the full color (4px solid, expands to 5px on hover)
- **Background**: Card uses 5% opacity of the color (subtle tint)

## Testing Colors

You can test colors quickly using browser console:

```javascript
// For columns (if you have access to the component)
// In browser console after opening a board:
angular.getComponent(document.querySelector('app-board-column')).column.color = '#ff6b6b';

// For cards
angular.getComponent(document.querySelector('app-board-card')).card.color = '#4ecdc4';
```

## Next Steps

To add a UI for changing colors:
1. Add a color picker to the column menu (⋮ button)
2. Add a color picker to the card detail modal
3. Create a color selection component similar to the board background color picker

Would you like me to create a UI component for changing colors interactively?
