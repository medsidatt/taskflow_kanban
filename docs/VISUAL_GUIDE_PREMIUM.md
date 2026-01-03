# TaskFlow Premium - Visual Guide

## 📐 UI Layout Architecture

### Main Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    NAVBAR (Premium Design)                  │
│  [Logo] [Workspace▼] [Search...] [+] [🔔] [👤▼]              │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬────────────────────────────────────────────────┐
│              │                                                │
│   SIDEBAR    │                 MAIN CONTENT                  │
│              │                                                │
│ [Personal]   │  Board View / Personal Cards / Activity       │
│ Your Boards  │                                                │
│ ├─ Cards     │                                                │
│ └─ Activity  │                                                │
│              │                                                │
│ [Workspace▼] │                                                │
│ Workspaces   │                                                │
│ ├─ [W1] ➜    │                                                │
│ │ ├─ Members │                                                │
│ │ ├─ Settings│                                                │
│ │ └─ Boards  │                                                │
│ └─ [W2]      │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: `#2196f3` - Main brand color
- **Primary Dark**: `#1976d2` - Darker variant
- **Primary Light**: `#f0f4ff` - Light backgrounds

### Neutral Colors
- **Dark Gray**: `#1f2937` - Text
- **Gray**: `#6b7280` - Secondary text
- **Light Gray**: `#f3f4f6` - Hover states
- **Border**: `#e5e7eb` - Element borders

### Gradients
- **Workspace Avatar**: `linear-gradient(135deg, #2196f3, #1976d2)`
- **Section Background**: `linear-gradient(135deg, #f0f4ff, #f8faff)`
- **Navbar Background**: `linear-gradient(135deg, #f8f9fa, #ffffff)`

## 🔘 Component States

### Workspace Selector Button
```
DEFAULT:
┌────────────────────────┐
│ [W] Workspace Name  ▼  │
└────────────────────────┘

HOVER:
┌────────────────────────┐
│ [W] Workspace Name  ▼  │  (blue border, light blue bg)
└────────────────────────┘

ACTIVE:
┌────────────────────────┐
│ [W] Workspace Name  ▲  │  (blue bg, dark blue text)
└────────────────────────┘
```

### Workspace Dropdown (Premium)
```
┌─────────────────────────────────────┐
│ [W] Workspace Name                  │  (Header with gradient)
│ Workspace description here          │
├─────────────────────────────────────┤
│ [🎯] Boards    [👥] Members [⚙️] Settings │  (Quick Actions)
├─────────────────────────────────────┤
│ Other Workspaces                    │
│ [W2] Workspace 2                    │
│ [W3] Workspace 3                    │
├─────────────────────────────────────┤
│ [+] Create Workspace                │
└─────────────────────────────────────┘
```

### Sidebar Workspace Item
```
COLLAPSED:
┌────┐
│ [W]│
└────┘

NORMAL:
┌──────────────────────────┐
│ [W] Workspace Name    [▼]│
└──────────────────────────┘

EXPANDED:
┌──────────────────────────┐
│ [W] Workspace Name    [▲]│  (Active: blue bg)
├──────────────────────────┤
│ [👥] Members             │
│ [⚙️] Settings             │
│ ──────────────────────── │
│ [Board 1]                │  (with color dot)
│ [Board 2]                │
│ [Board 3]                │
│ View all boards (5)      │
└──────────────────────────┘
```

## 🧭 Navigation Flows

### Personal Section
```
Sidebar: "Your Boards"
    ├─→ Click "Cards"
    │   └─→ Personal Cards Page
    │       ├─ Search cards
    │       ├─ Filter: Assigned to me / Created by me
    │       └─ View card details
    │
    └─→ Click "Activity"
        └─→ Personal Activity Page
            ├─ View activity timeline
            ├─ Filter: All / Created / Commented
            └─ Track personal contributions
```

### Workspace Management
```
Navbar: Workspace Selector
    ├─→ Click Workspace
    │   └─→ View workspace info
    │       ├─→ "Boards" → Workspace detail
    │       ├─→ "Members" → Manage members
    │       └─→ "Settings" → Configure workspace
    │
    └─→ Select Different Workspace
        └─→ Switch workspace context

Sidebar: Workspace Item
    ├─→ Click workspace
    │   └─→ Expand menu
    │       ├─→ Members (dropdown)
    │       ├─→ Settings (dropdown)
    │       └─→ Board links
    │
    └─→ Click board
        └─→ Open board view
```

## 📐 Responsive Breakpoints

### Desktop (1024px+)
- Sidebar always visible
- Full navbar with text labels
- Dropdown menus with full content
- Multi-column layouts

### Tablet (768px - 1023px)
- Sidebar can be hidden
- Compact navbar
- Adjusted dropdown sizing
- 2-column layouts

### Mobile (< 768px)
- Sidebar as slide-out drawer
- Icon-only navbar
- Full-width dropdowns
- Single column layouts
- Touch-friendly sizing (44px+ buttons)

## 🎬 Animations

### Transitions (200ms ease)
- Button hover states
- Dropdown expansions
- Color changes
- Background fades

### Keyframes
```css
Slide Down: ▼
  from: opacity 0, translateY -8px
  to:   opacity 1, translateY 0

Shimmer (Loading): ───→
  Background position animation for skeleton loaders

Rotate: ↻
  Icon rotation for chevrons (chevron down → up)
```

## ✨ Interactive Elements

### Buttons
- **Primary**: Blue gradient background
- **Secondary**: White with blue border
- **Tertiary**: No background, text only
- **Icon**: Square, minimal styling
- **Danger**: Red text on hover

### Hover Effects
- Color change to primary blue
- Background color change to light gray/blue
- Subtle shadow increase (0 2px 8px)
- Border color change to primary blue

### Focus States
- Outline: 0 (removed default)
- Box shadow: 0 0 0 3px rgba(33, 150, 243, 0.1)
- Border color: Primary blue

## 📊 Component Sizing

### Navbar
- Height: 64px (4rem)
- Workspace Selector: 160px - 200px width
- Icon buttons: 40px × 40px

### Sidebar
- Width: 260px (full) / 60px (collapsed)
- Item height: 44px - 48px
- Avatar size: 28px - 44px
- Transition: 200ms ease

### Dropdowns
- Min-width: 240px - 380px
- Max-height: 400px - 600px
- Border radius: 0.625rem - 0.875rem
- Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15)

## 🎯 Key Interaction Patterns

### Workspace Switching
1. User clicks workspace selector
2. Premium dropdown appears with workspace info
3. User can:
   - Switch to another workspace
   - View boards, members, settings
   - Create new workspace
4. Dropdown closes on selection

### Personal Cards
1. User clicks "Cards" in Personal section
2. Page shows all personal cards
3. User can:
   - Search by title/description
   - Filter by assigned/created
   - Click card to view details
4. Empty state if no cards

### Activity Tracking
1. User clicks "Activity" in Personal section
2. Timeline view of all activities
3. User can:
   - Filter by activity type
   - See recent changes
   - Navigate to source item
4. Empty state if no activity

---

## 🚀 Implementation Status

| Feature | Status | Location |
|---------|--------|----------|
| Premium Navbar | ✅ Complete | `navbar.component.*` |
| Workspace Dropdown | ✅ Complete | `navbar.component.*` |
| Personal Cards | ✅ Complete | `personal-cards.component.*` |
| Personal Activity | ✅ Complete | `personal-activity.component.*` |
| Sidebar Enhancement | ✅ Complete | `sidebar.component.*` |
| Responsive Design | ✅ Complete | All components |
| Animations | ✅ Complete | CSS files |
| Premium Colors | ✅ Complete | All stylesheets |

---

**Last Updated:** January 2026
**Design System:** TaskFlow Premium v2.0
