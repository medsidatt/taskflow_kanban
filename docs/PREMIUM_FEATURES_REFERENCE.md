# TaskFlow Premium - Developer Reference

## 🎯 Quick Start

### What Changed?
This upgrade transforms TaskFlow into a Trello Premium-like experience with:
1. **Premium Navbar** with enhanced workspace switcher
2. **Personal Cards & Activity** sections
3. **Workspace Management** (Members, Boards, Settings)
4. **Modern UI/UX** with gradients and smooth animations

### Key Files Modified

```
frontend/src/app/
├── shared/components/
│   ├── navbar/
│   │   ├── navbar.component.ts       (Enhanced)
│   │   ├── navbar.component.html     (Enhanced)
│   │   └── navbar.component.css      (Completely redesigned)
│   │
│   └── sidebar/
│       ├── sidebar.component.ts      (Minor updates)
│       ├── sidebar.component.html    (Minor updates)
│       └── sidebar.component.css     (Redesigned)
│
└── features/
    └── personal/
        ├── pages/personal-cards/
        │   └── personal-cards.component.ts
        │
        └── pages/personal-activity/
            └── personal-activity.component.ts
```

## 📱 Component Structure

### NavbarComponent

**New Methods:**
```typescript
openWorkspaceMembers(workspaceId: string, event: Event)    // Navigate to members
openWorkspaceSettings(workspaceId: string, event: Event)   // Navigate to settings
openWorkspaceBoardsList(workspaceId: string, event: Event) // Navigate to boards
```

**New Signals:**
```typescript
hoveredWorkspaceId = signal<string | null>(null)  // Track hovered workspace
```

**Template Structure:**
```html
<!-- Left: Logo + Workspace Selector -->
<div class="navbar-left">
  <a class="navbar-logo">...</a>
  <div class="navbar-dropdown-wrapper">
    <button class="workspace-selector-btn">...</button>
    <div class="workspace-dropdown premium-dropdown">
      <!-- Workspace info header -->
      <!-- Quick action buttons (Boards, Members, Settings) -->
      <!-- Other workspaces list -->
      <!-- Create workspace button -->
    </div>
  </div>
</div>

<!-- Center: Search -->
<div class="navbar-center">
  <!-- Search form -->
</div>

<!-- Right: Quick Create, Notifications, Profile -->
<div class="navbar-right">
  <!-- Create dropdown -->
  <!-- Notifications dropdown -->
  <!-- Profile dropdown -->
</div>
```

### SidebarComponent

**No method changes**, but CSS significantly enhanced.

**Personal Section Now Shows:**
- Home icon + "Your Boards" title
- Cards link
- Activity link

**Workspace Section:**
- Expanded dropdown menu per workspace
- Members, Settings, Boards quick links
- Board color dots

## 🎨 CSS Architecture

### Design Tokens

**Colors:**
```css
--primary: #2196f3
--primary-dark: #1976d2
--primary-light: #f0f4ff
--text: #1f2937
--text-secondary: #6b7280
--text-light: #9ca3af
--border: #e5e7eb
--bg-hover: #f3f4f6
```

**Spacing:**
```css
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-6: 1.5rem (24px)
```

**Border Radius:**
```css
--radius-sm: 0.25rem (4px)
--radius-md: 0.375rem (6px)
--radius-lg: 0.625rem - 0.75rem (10-12px)
--radius-full: 9999px (circles)
```

### Layout Classes

**Navbar Layout:**
```css
.navbar {}                    /* Sticky top nav */
.navbar-container {}          /* flex, space-between */
.navbar-left {}              /* flex, items-center */
.navbar-center {}            /* flex-1, center */
.navbar-right {}             /* flex, items-center */
```

**Workspace Selector:**
```css
.workspace-selector-btn {}   /* Premium styled button */
.workspace-avatar-mini {}    /* 28px gradient avatar */
.workspace-dropdown {}       /* 380px dropdown with premium styling */
.workspace-avatar-lg {}      /* 44px large avatar */
.dropdown-actions {}         /* Quick action buttons */
.action-button {}            /* Individual action */
```

**Sidebar Layout:**
```css
.sidebar {}                  /* Vertical flex container */
.sidebar-content {}          /* flex-column, padding */
.personal-section {}         /* Gradient blue background */
.workspaces-section {}       /* flex-1, overflow-hidden */
.workspace-item-wrapper {}   /* Position: relative for expanded menu */
.workspace-dropdown-menu {}  /* Expanded workspace menu */
```

## 🔄 Navigation Routes

### Personal Section Routes
```
/personal/cards      → Personal Cards page
                       • Filter: Assigned to me / Created by me
                       • Search functionality
                       • Empty state

/personal/activity   → Personal Activity page
                       • Timeline view
                       • Filter by type: All / Created / Commented
                       • Empty state
```

### Workspace Management Routes
```
/workspaces/:id/members     → Workspace members management
/workspaces/:id/settings    → Workspace settings
/workspaces/:id/boards      → View all workspace boards
/workspaces/:id             → Workspace detail
```

## 🎬 Animation Reference

### Dropdown Animation
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Loading Skeleton
```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Transition Timing
- Fast: 150ms (hover states)
- Normal: 200ms (dropdown open/close)
- Slow: Custom for specific effects

## 📊 Responsive Breakpoints

```css
Desktop:   1024px+  /* Sidebar visible, full navbar */
Tablet:    768-1023 /* Compact navbar, toggle sidebar */
Mobile:    <768px   /* Full-width dropdown, slide sidebar */
```

### Mobile Adjustments
```css
@media (max-width: 768px) {
  .workspace-dropdown {
    width: 100vw;
    right: auto;
    left: 0;
    border-radius: 0;
  }
  
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
}
```

## 🔧 Customization Guide

### Change Primary Color

1. **Update CSS:**
   ```css
   Search for: #2196f3
   Replace with: your-color
   ```

2. **Files to update:**
   - `navbar.component.css`
   - `sidebar.component.css`
   - `personal-cards.component.ts` (styles)
   - `personal-activity.component.ts` (styles)

### Add New Workspace Actions

1. **In navbar.component.ts:**
   ```typescript
   // Add method
   customWorkspaceAction(workspaceId: string, event: Event): void {
     event.stopPropagation();
     this.router.navigate(['/custom-route', workspaceId]);
   }
   ```

2. **In navbar.component.html:**
   ```html
   <button class="action-button" 
     (click)="customWorkspaceAction(currentWorkspace()?.id, $event)">
     <lucide-icon [name]="icons.CustomIcon" [size]="16" />
     <div class="action-text">
       <span class="action-label">Custom Action</span>
     </div>
   </button>
   ```

### Customize Workspace Dropdown

Edit `workspace-dropdown` div in navbar.component.html:
- Add/remove quick actions
- Modify section labels
- Change workspace list appearance

## 🚀 Performance Tips

1. **Lazy Load Icons:** Already using Lucide Angular (tree-shakeable)
2. **CSS Optimization:** Use CSS Grid/Flexbox instead of floats
3. **Animation Performance:** Use `transform` and `opacity` instead of `left/top`
4. **Signal-based State:** Angular signals are optimized for change detection

## 🐛 Common Issues & Solutions

### Issue: Dropdown not closing
**Solution:** Ensure backdrop click handler calls `closeAllDropdowns()`

### Issue: Workspace switch not updating
**Solution:** Verify `WorkspaceStateService.setCurrentWorkspace()` is called

### Issue: Personal cards not loading
**Solution:** Check if `CardService.getPersonalCards()` API exists

### Issue: Styling not applying
**Solution:** Clear browser cache, check CSS file paths

## 📝 Testing Checklist

- [ ] Workspace selector opens/closes correctly
- [ ] Can switch between workspaces
- [ ] Workspace dropdown buttons navigate correctly
- [ ] Personal Cards page loads
- [ ] Personal Activity page loads
- [ ] Sidebar collapses/expands
- [ ] Mobile responsive layout works
- [ ] Animations smooth on all devices
- [ ] No console errors
- [ ] Accessibility (keyboard navigation, labels)

## 🔗 Related Documentation

- `TRELLO_PREMIUM_UPGRADE.md` - Full feature overview
- `VISUAL_GUIDE_PREMIUM.md` - UI/UX visual guide
- Component template files (*.html)
- Component style files (*.css)

## 💡 Tips & Tricks

**Quick navigation using icons:**
- Sidebar icon buttons work when collapsed
- Navbar has keyboard shortcuts (future)
- All buttons have tooltips (title attribute)

**Customizing personal section:**
- Edit `personal-section` class in sidebar.component.css
- Change gradient background in `.personal-section`
- Modify title/subtitle text in sidebar.component.html

**Adding new workspace features:**
1. Create new component
2. Add route in app.routes.ts
3. Add navigation method in navbar/sidebar
4. Style to match premium design system

---

**Last Updated:** January 2026
**Version:** 2.0.0 Premium
**Maintained by:** TaskFlow Team
