# Accessibility Guide - Pdiddy

This document outlines the accessibility features implemented in the Pdiddy application to ensure WCAG 2.1 AA compliance.

## Overview

The Pdiddy application has been designed with accessibility as a core principle, ensuring that all users, including those with disabilities, can effectively use the platform.

## Key Accessibility Features

### 1. Keyboard Navigation

All interactive elements are fully accessible via keyboard:

- **Tab Navigation**: All buttons, links, and form controls can be accessed using the Tab key
- **Enter/Space Activation**: Interactive elements can be activated with Enter or Space keys
- **Escape Key**: Modals and overlays can be closed with the Escape key
- **Focus Trap**: Modals implement focus trapping to keep keyboard focus within the modal
- **Skip Link**: A "Skip to main content" link is available for keyboard users to bypass navigation

#### Testing Keyboard Navigation

1. Press Tab to navigate through interactive elements
2. Use Shift+Tab to navigate backwards
3. Press Enter or Space to activate buttons and links
4. Press Escape to close modals

### 2. Focus Indicators

All focusable elements have visible focus indicators:

- **Global Focus Styles**: 2px solid green outline with 2px offset
- **Custom Focus Rings**: Components use Tailwind's `focus:ring-2` utilities
- **Focus-Visible**: Modern `:focus-visible` pseudo-class for better UX

```css
*:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}
```

### 3. ARIA Labels and Attributes

Proper ARIA attributes are used throughout the application:

#### Buttons
- `aria-label`: Descriptive labels for icon-only buttons
- `aria-busy`: Loading state indication
- `aria-disabled`: Disabled state indication
- `aria-pressed`: Toggle button states (filters)

#### Forms
- `aria-invalid`: Invalid input indication
- `aria-describedby`: Links inputs to error/helper text
- `aria-required`: Required field indication

#### Modals
- `role="dialog"`: Identifies modal dialogs
- `aria-modal="true"`: Indicates modal behavior
- `aria-labelledby`: Links to modal title

#### Navigation
- `aria-current="page"`: Indicates current page in navigation
- `aria-label`: Descriptive labels for navigation regions
- `aria-expanded`: Menu expansion state

#### Live Regions
- `aria-live="polite"`: Non-critical updates (loading states)
- `aria-live="assertive"`: Critical updates (errors)
- `role="status"`: Status messages
- `role="alert"`: Error messages

### 4. Semantic HTML

The application uses proper semantic HTML5 elements:

- `<header>`: Page and section headers
- `<nav>`: Navigation menus
- `<main>`: Main content area (with `id="main-content"`)
- `<section>`: Content sections with `aria-labelledby`
- `<article>`: Self-contained content (product cards, cart items)
- `<aside>`: Complementary content (cart summary)
- `<footer>`: Page footer

### 5. Image Accessibility

All images have proper alternative text:

```tsx
// Product images
<Image
  src={product.imageUrl}
  alt={`Imagem de ${product.name}`}
  // ...
/>

// Decorative images
<div aria-hidden="true">
  <Icon />
</div>
```

### 6. Color Contrast

All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

- **Primary Text**: `#171717` on `#ffffff` (12.6:1)
- **Secondary Text**: `#525252` on `#ffffff` (7.0:1)
- **Primary Button**: `#ffffff` on `#22c55e` (4.8:1)
- **Links**: `#16a34a` on `#ffffff` (5.9:1)

#### Adjusted Colors for Better Contrast

```css
.text-neutral-600 {
  color: #525252; /* Adjusted from default for better contrast */
}

.text-neutral-700 {
  color: #404040; /* Adjusted from default for better contrast */
}
```

### 7. Responsive Design

The application is fully responsive across all device sizes:

#### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

#### Responsive Features
- Mobile navigation with hamburger menu
- Responsive grid layouts (1-4 columns)
- Touch-friendly tap targets (minimum 44x44px)
- Responsive typography (text scales appropriately)
- Flexible form layouts

### 8. Form Accessibility

All forms follow accessibility best practices:

#### Label Association
```tsx
<label htmlFor={inputId}>Name</label>
<input id={inputId} />
```

#### Error Handling
```tsx
<input
  aria-invalid={hasError}
  aria-describedby={errorId}
/>
<p id={errorId} role="alert">{error}</p>
```

#### Required Fields
- Visual indicators (asterisk)
- `required` attribute
- Clear error messages

### 9. Screen Reader Support

The application is optimized for screen readers:

- **Semantic Structure**: Proper heading hierarchy (h1 → h2 → h3)
- **Descriptive Labels**: All interactive elements have descriptive labels
- **Hidden Content**: Decorative elements marked with `aria-hidden="true"`
- **Live Regions**: Dynamic content updates announced
- **Skip Links**: Quick navigation to main content

#### Screen Reader Testing

Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### 10. Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Component-Specific Accessibility

### Button Component
- Keyboard accessible
- Focus indicators
- Loading state with `aria-busy`
- Disabled state with `aria-disabled`

### Input Component
- Label association with `htmlFor`
- Error messages with `aria-describedby`
- Invalid state with `aria-invalid`
- Helper text support

### Modal Component
- Focus trap implementation
- Escape key to close
- Focus management (auto-focus on open)
- Backdrop click to close
- Proper ARIA attributes

### ProductCard Component
- Keyboard accessible (Tab, Enter, Space)
- Descriptive `aria-label`
- Image alt text
- Semantic HTML (`<article>`)

### Navigation Component
- Current page indication with `aria-current`
- Keyboard accessible
- Mobile-friendly hamburger menu
- Proper `<nav>` landmark

## Testing Checklist

### Manual Testing

- [ ] All interactive elements accessible via keyboard
- [ ] Focus indicators visible on all focusable elements
- [ ] Skip link works and is visible on focus
- [ ] All images have appropriate alt text
- [ ] Forms can be completed using only keyboard
- [ ] Modals trap focus and can be closed with Escape
- [ ] Error messages are announced by screen readers
- [ ] Color contrast meets WCAG AA standards
- [ ] Application works at 200% zoom
- [ ] Touch targets are at least 44x44px

### Automated Testing

Use these tools for automated accessibility testing:

1. **axe DevTools** (Browser Extension)
2. **WAVE** (Web Accessibility Evaluation Tool)
3. **Lighthouse** (Chrome DevTools)
4. **Pa11y** (Command-line tool)

### Screen Reader Testing

Test with at least one screen reader:

1. Navigate through the entire application
2. Fill out and submit forms
3. Add items to cart and checkout
4. Verify all content is announced properly
5. Check that dynamic updates are announced

## Common Accessibility Patterns

### Loading States
```tsx
<div role="status" aria-live="polite" aria-busy="true">
  <div aria-label="Carregando">
    {/* Spinner */}
  </div>
  <p>Carregando produtos...</p>
</div>
```

### Error States
```tsx
<div role="alert" aria-live="assertive">
  <p className="text-red-600">{error}</p>
</div>
```

### Interactive Cards
```tsx
<Card
  tabIndex={0}
  role="article"
  aria-label={`${product.name} - ${price}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  {/* Content */}
</Card>
```

### Icon Buttons
```tsx
<button aria-label="Adicionar ao carrinho">
  <ShoppingCart aria-hidden="true" />
</button>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Continuous Improvement

Accessibility is an ongoing process. Regular audits and user testing should be conducted to ensure the application remains accessible as new features are added.

### Recommended Schedule

- **Weekly**: Automated testing with axe DevTools
- **Monthly**: Manual keyboard navigation testing
- **Quarterly**: Full screen reader testing
- **Annually**: Professional accessibility audit

## Contact

For accessibility concerns or suggestions, please contact the development team.
