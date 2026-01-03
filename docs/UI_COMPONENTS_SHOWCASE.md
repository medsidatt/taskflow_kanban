# TaskFlow Kanban - UI Component Showcase & Usage Guide

**Date**: January 18, 2026  
**Version**: 1.0

---

## 📋 Table of Contents

1. Color System
2. Typography
3. Button Components
4. Form Components
5. Cards & Containers
6. Alerts & Badges
7. Layout Utilities
8. Animation Examples

---

## 🎨 Color System

### Primary Colors
```css
--color-primary: #5e72e4;        /* Indigo - Main brand color */
--color-primary-dark: #3d5cdc;   /* Darker for hover states */
--color-primary-light: #8f9fef;  /* Lighter for backgrounds */
--color-primary-50: #f0f4ff;     /* Lightest for surfaces */
```

**Usage**:
```html
<!-- Background -->
<div style="background: var(--color-primary);">
  Background
</div>

<!-- Text -->
<p style="color: var(--color-primary);">
  Text in primary color
</p>

<!-- With hover -->
<button style="background: var(--color-primary);">
  Primary Button
</button>
```

### Secondary Colors
```css
--color-secondary: #11cdef;      /* Cyan */
--color-secondary-dark: #00a8cc;
--color-secondary-light: #5cdee8;
```

### Status Colors
```css
--color-success: #2dce89;        /* Green - Success state */
--color-warning: #fb6340;        /* Orange - Warning state */
--color-danger: #f5365c;         /* Red - Danger state */
--color-info: #11cdef;           /* Cyan - Info state */
```

### Neutral Colors
```css
--color-white: #ffffff;          /* White */
--color-black: #000000;          /* Black */
--color-gray-50: #f9fafb;        /* Lightest gray */
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;       /* Darkest gray */
```

### Color Palette Visual
```
Primary:   ■■■■■ (Indigo)
Secondary: ■■■■■ (Cyan)
Success:   ■■■■■ (Green)
Warning:   ■■■■■ (Orange)
Danger:    ■■■■■ (Red)
Info:      ■■■■■ (Cyan)
Gray:      ■■■■■ ← Gradient from light to dark
```

---

## 📝 Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### Font Weights
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;       /* Body text */
--font-medium: 500;       /* Labels, etc */
--font-semibold: 600;     /* Headings, emphasis */
--font-bold: 700;         /* Strong emphasis */
--font-black: 900;        /* Extra strong */
```

### Line Heights
```css
--line-height-tight: 1.25;     /* Compact (headings) */
--line-height-normal: 1.5;     /* Body text */
--line-height-relaxed: 1.625;  /* More readable */
--line-height-loose: 2;        /* Very spacious */
```

### Typography Examples
```html
<h1>Heading 1 (36px, Bold)</h1>      <!-- Main title -->
<h2>Heading 2 (30px, Bold)</h2>      <!-- Section title -->
<h3>Heading 3 (24px, Semibold)</h3>  <!-- Subsection -->
<h4>Heading 4 (20px, Semibold)</h4>  <!-- Minor heading -->

<p class="text-base">Body text (16px, normal)</p>
<p class="text-sm">Small text (14px)</p>
<p class="text-xs">Extra small (12px)</p>

<strong>Bold text</strong>
<em>Italic text</em>
<code>Code snippet</code>
```

---

## 🔘 Button Components

### Button Sizes
```html
<!-- Small Button -->
<button class="btn btn-primary btn-sm">
  Small Button
</button>

<!-- Default Button -->
<button class="btn btn-primary">
  Default Button
</button>

<!-- Large Button -->
<button class="btn btn-primary btn-lg">
  Large Button
</button>

<!-- Full Width -->
<button class="btn btn-primary btn-block">
  Full Width Button
</button>
```

### Button Variants

#### Primary Button
```html
<button class="btn btn-primary">
  Primary Action
</button>

<!-- Usage: Main CTAs (Sign in, Submit form, etc) -->
```

**States**:
- Default: Gradient background
- Hover: Darker gradient
- Active: Slightly more contrast
- Disabled: 60% opacity

#### Secondary Button
```html
<button class="btn btn-secondary">
  Secondary Action
</button>

<!-- Usage: Alternative actions -->
```

#### Outline Button
```html
<button class="btn btn-outline">
  Outline Button
</button>

<!-- Usage: Cancel, secondary actions -->
```

#### Ghost Button
```html
<button class="btn btn-ghost">
  Ghost Button
</button>

<!-- Usage: Minimal actions, breadcrumbs -->
```

### Button States
```html
<!-- Loading State -->
<button class="btn btn-primary" disabled>
  <span class="spinner-mini"></span>
  Loading...
</button>

<!-- Disabled State -->
<button class="btn btn-primary" disabled>
  Disabled
</button>

<!-- With Icon -->
<button class="btn btn-primary">
  <svg><!-- Icon --></svg>
  Button with Icon
</button>
```

### Button Layout
```html
<!-- Icon Only -->
<button class="btn btn-icon">
  <svg><!-- Icon --></svg>
</button>

<!-- Icon + Text -->
<button class="btn btn-primary">
  <svg><!-- Icon --></svg>
  Button Text
</button>

<!-- Group -->
<div class="btn-group">
  <button class="btn btn-outline">Option 1</button>
  <button class="btn btn-outline">Option 2</button>
  <button class="btn btn-outline">Option 3</button>
</div>
```

---

## 📋 Form Components

### Text Input
```html
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <div class="input-wrapper">
    <span class="input-icon-prefix">
      <svg><!-- Email icon --></svg>
    </span>
    <input
      type="email"
      id="email"
      class="form-input"
      placeholder="user@example.com"
    />
  </div>
  <span class="form-error" *ngIf="error">
    {{ error }}
  </span>
</div>
```

### Password Input
```html
<div class="form-group">
  <div class="password-label-wrapper">
    <label for="password" class="form-label">Password</label>
    <a href="#" class="forgot-password-link">Forgot?</a>
  </div>
  <div class="input-wrapper">
    <span class="input-icon-prefix">
      <svg><!-- Lock icon --></svg>
    </span>
    <input
      [type]="showPassword ? 'text' : 'password'"
      id="password"
      class="form-input"
      placeholder="Enter password"
    />
    <button
      type="button"
      class="input-icon-suffix password-toggle"
      (click)="togglePassword()"
    >
      <svg><!-- Eye icon --></svg>
    </button>
  </div>
</div>
```

### Textarea
```html
<div class="form-group">
  <label for="message" class="form-label">Message</label>
  <textarea
    id="message"
    class="form-textarea"
    placeholder="Enter your message..."
    rows="5"
  ></textarea>
</div>
```

### Select Dropdown
```html
<div class="form-group">
  <label for="category" class="form-label">Category</label>
  <select id="category" class="form-select">
    <option value="">Select a category</option>
    <option value="1">Category 1</option>
    <option value="2">Category 2</option>
  </select>
</div>
```

### Checkbox
```html
<div class="form-checkbox">
  <input
    type="checkbox"
    id="terms"
    class="checkbox-input"
  />
  <label for="terms" class="checkbox-label">
    I agree to the terms and conditions
  </label>
</div>
```

### Radio Button
```html
<div class="form-radio">
  <input
    type="radio"
    id="option1"
    name="options"
    class="radio-input"
  />
  <label for="option1" class="radio-label">
    Option 1
  </label>
</div>

<div class="form-radio">
  <input
    type="radio"
    id="option2"
    name="options"
    class="radio-input"
  />
  <label for="option2" class="radio-label">
    Option 2
  </label>
</div>
```

---

## 💳 Cards & Containers

### Basic Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

**CSS**:
```css
.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
}
```

### Card with Header & Footer
```html
<div class="card">
  <div class="card-header">
    <h3>Card Header</h3>
  </div>
  <div class="card-body">
    <p>Card content here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Action</button>
  </div>
</div>
```

### Card Grid
```html
<div class="grid-auto-fit">
  <div class="card">
    <h4>Card 1</h4>
    <p>Content</p>
  </div>
  <div class="card">
    <h4>Card 2</h4>
    <p>Content</p>
  </div>
  <div class="card">
    <h4>Card 3</h4>
    <p>Content</p>
  </div>
</div>
```

---

## 🔔 Alerts & Badges

### Alert Messages
```html
<!-- Success -->
<div class="alert alert-success">
  <svg class="alert-icon"><!-- Icon --></svg>
  <span>Operation completed successfully!</span>
</div>

<!-- Warning -->
<div class="alert alert-warning">
  <svg class="alert-icon"><!-- Icon --></svg>
  <span>Please review this before proceeding.</span>
</div>

<!-- Danger -->
<div class="alert alert-danger">
  <svg class="alert-icon"><!-- Icon --></svg>
  <span>An error occurred. Please try again.</span>
</div>

<!-- Info -->
<div class="alert alert-info">
  <svg class="alert-icon"><!-- Icon --></svg>
  <span>Here's some helpful information.</span>
</div>
```

### Badges
```html
<!-- Primary Badge -->
<span class="badge badge-primary">New</span>

<!-- Success Badge -->
<span class="badge badge-success">Active</span>

<!-- Warning Badge -->
<span class="badge badge-warning">Pending</span>

<!-- Danger Badge -->
<span class="badge badge-danger">Failed</span>

<!-- With Icon -->
<span class="badge badge-success">
  <svg><!-- Icon --></svg>
  Verified
</span>
```

---

## 🎯 Layout Utilities

### Flexbox Centering
```html
<div class="flex-center">
  Content centered in all directions
</div>

<!-- CSS -->
<style>
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Grid Auto-fit
```html
<div class="grid-auto-fit">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Automatically responsive grid with 250px min columns -->
```

### Spacing Classes
```html
<!-- Margin -->
<div style="margin: var(--spacing-4);">
  Margin all sides
</div>

<!-- Padding -->
<div style="padding: var(--spacing-6);">
  Padding all sides
</div>

<!-- Gap (flexbox/grid) -->
<div class="flex" style="gap: var(--spacing-3);">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Text Utilities
```html
<!-- Truncate -->
<p class="truncate">Long text that overflows...</p>

<!-- Line Clamp -->
<p class="line-clamp-2">Multi-line text...</p>
<p class="line-clamp-3">Three lines max...</p>

<!-- Alignment -->
<p style="text-align: center;">Centered text</p>
<p style="text-align: right;">Right aligned</p>
```

---

## ✨ Animations

### Fade In
```html
<div class="animate-fade-in">
  Fades in smoothly
</div>

<!-- CSS -->
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn var(--transition-base);
}
```

### Slide In
```html
<div class="animate-slide-in">
  Slides up and fades in
</div>

<!-- CSS -->
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn var(--transition-base);
}
```

### Spin
```html
<svg class="animate-spin">
  <!-- Spinning loader -->
</svg>

<!-- CSS -->
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Transition Speeds
```css
--transition-fast: 150ms;     /* Quick interactions */
--transition-base: 200ms;     /* Standard transitions */
--transition-slow: 300ms;     /* Slow animations */
--transition-slower: 500ms;   /* Very slow animations */
```

---

## 🎨 Theme Colors Usage

### Light Theme (Default)
```css
--color-text: #111827;                 /* Dark text */
--color-background: #ffffff;           /* White background */
--color-border: #e5e7eb;              /* Light border */
```

### Dark Theme
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f9fafb;            /* Light text */
    --color-background: #111827;      /* Dark background */
    --color-border: #374151;          /* Dark border */
  }
}
```

---

## 📱 Responsive Breakpoints

### Screen Sizes
```css
Small:   480px  (phones)
Medium:  640px  (tablets)
Large:   1024px (laptops)
XL:      1280px (desktops)
```

### Responsive Example
```html
<div style="
  display: grid;
  grid-template-columns: 1fr;           /* Mobile: 1 column */
  gap: var(--spacing-4);
">
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;     /* Tablet: 2 columns */
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr; /* Desktop: 3 columns */
  }
</div>
```

---

## 🔗 Real-World Examples

### Login Form
See `login.component.html` and `login.component.css` for a complete implementation.

### Card Grid Dashboard
```html
<div class="grid-auto-fit">
  <div class="card">
    <h4>📊 Statistic 1</h4>
    <p class="text-3xl">42</p>
  </div>
  <div class="card">
    <h4>📊 Statistic 2</h4>
    <p class="text-3xl">128</p>
  </div>
  <div class="card">
    <h4>📊 Statistic 3</h4>
    <p class="text-3xl">87%</p>
  </div>
</div>
```

### Form with Validation
```html
<div class="form-group">
  <label class="form-label">Email</label>
  <div class="input-wrapper">
    <input
      type="email"
      class="form-input"
      [class.input-error]="emailError"
    />
  </div>
  <span class="form-error" *ngIf="emailError">
    {{ emailError }}
  </span>
</div>
```

---

## 🎓 Best Practices

### Color Contrast
- Always ensure 4.5:1 contrast for text
- Use primary-dark on light backgrounds
- Use white on primary backgrounds

### Spacing
- Use spacing scale (multiples of 4px)
- Consistent gaps between elements
- More spacing on mobile friendly

### Typography
- Use semantic HTML (h1-h6)
- Limit font sizes (8-10 different sizes max)
- Consistent line heights

### Accessibility
- Always include labels with form inputs
- Use semantic HTML
- Provide focus indicators
- Test with keyboard navigation

---

## 📚 Resources

- Design System CSS: `frontend/src/styles/design-system.css`
- Login Component: `frontend/src/app/features/auth/pages/login/`
- MDN Web Docs: https://developer.mozilla.org/
- W3C WCAG: https://www.w3.org/WAI/

---

**Status**: ✅ Complete - Ready for Implementation  
**Last Updated**: January 18, 2026  
**Version**: 1.0
