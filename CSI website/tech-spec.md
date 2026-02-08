# Orbit English - Technical Specification

## Component Inventory

### shadcn/ui Components (Built-in)
| Component | Usage |
|-----------|-------|
| Button | CTA buttons, nav buttons |
| Card | Feature cards, character cards |
| Badge | Section badges |
| Input | Chat input field |

### Custom Components
| Component | Purpose |
|-----------|---------|
| FloatingStars | Background star animation |
| ChatInterface | Hero chat UI with messages |
| CharacterBubble | Circular character display with glow |
| FeatureCard | About us feature cards |
| StepCard | How it works numbered cards |
| TrustPillar | Trust section icon+label cards |
| CharacterCard | Choose buddy character cards |
| Navbar | Fixed navigation |
| Footer | Site footer |

### Hooks
| Hook | Purpose |
|------|---------|
| useScrollReveal | Intersection observer for scroll animations |
| useReducedMotion | Respect prefers-reduced-motion |

---

## Animation Implementation Table

| Animation | Library | Implementation | Complexity |
|-----------|---------|----------------|------------|
| Floating stars background | CSS + React | Random positioned divs with CSS keyframe animation | Medium |
| Navbar slide down | Framer Motion | initial={{ y: -100 }} animate={{ y: 0 }} | Low |
| Hero content fade in | Framer Motion | initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} | Low |
| Character bubbles pop in | Framer Motion | scale: 0 → 1 with spring, staggered | Medium |
| Character floating | CSS | @keyframes float with translateY | Low |
| Chat message type in | Framer Motion | Staggered fade + slide, sequential | Medium |
| Scroll reveal (sections) | Framer Motion | whileInView with viewport once | Medium |
| Card hover lift | CSS/Framer | translateY(-4px) + shadow transition | Low |
| Button hover glow | CSS | box-shadow transition | Low |
| Character hover scale | Framer Motion | whileHover={{ scale: 1.08 }} | Low |
| Number badge pulse | CSS | @keyframes pulse with scale | Low |
| CTA button pulse glow | CSS | @keyframes pulse-glow | Low |

---

## Animation Library Choices

### Primary: Framer Motion
- React-native animation library
- Excellent for component-based animations
- Built-in scroll detection (whileInView)
- Spring physics for natural feel
- Easy stagger animations

### Secondary: CSS Animations
- Floating stars (performance-critical background)
- Simple hover transitions
- Infinite loop animations (pulse, float)

---

## Project File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── FloatingStars.tsx
│   │   ├── Navbar.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── CharacterBubble.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── StepCard.tsx
│   │   ├── TrustPillar.tsx
│   │   ├── CharacterCard.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── AboutUs.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TrustSection.tsx
│   │   ├── ChooseBuddy.tsx
│   │   └── CTASection.tsx
│   ├── hooks/
│   │   └── useScrollReveal.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── public/
│   └── images/
│       ├── bunny.png
│       ├── robot.png
│       └── alien.png
├── index.html
└── package.json
```

---

## Dependencies

### Core (from template)
- react
- react-dom
- typescript
- vite
- tailwindcss
- @radix-ui/* (via shadcn)

### Animation
- framer-motion

### Icons
- lucide-react

### Fonts
- @fontsource/inter
- @fontsource/fredoka (or Google Fonts CDN)

---

## CSS Custom Properties

```css
:root {
  /* Colors */
  --bg-primary: #0a0f1c;
  --bg-secondary: #111827;
  --bg-card: rgba(17, 24, 39, 0.7);
  --accent-primary: #86efac;
  --accent-secondary: #6ee7b7;
  --accent-glow: rgba(134, 239, 172, 0.3);
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border-primary: rgba(134, 239, 172, 0.3);
  --border-secondary: rgba(255, 255, 255, 0.1);
  
  /* Shadows */
  --glow-ring: 0 0 30px rgba(134, 239, 172, 0.4), 0 0 60px rgba(134, 239, 172, 0.2);
  --button-glow: 0 0 20px rgba(134, 239, 172, 0.5);
  --card-glow: 0 0 30px rgba(134, 239, 172, 0.15);
}
```

---

## Key Implementation Notes

### Floating Stars
- Generate 60 stars with random positions
- Use CSS custom properties for animation duration/delay
- Position: fixed, full viewport
- z-index: 0 (behind content)

### Glassmorphism Cards
- background: rgba(17, 24, 39, 0.7)
- backdrop-filter: blur(12px)
- border: 1px solid rgba(134, 239, 172, 0.2)
- border-radius: 20px

### Character Glow Rings
- Outer ring: box-shadow with mint green
- Inner gradient border using pseudo-element
- Animated on hover

### Responsive Strategy
- Mobile-first with Tailwind breakpoints
- Grid columns: 1 (mobile) → 2 (tablet) → 3 (desktop)
- Character bubbles: Stack on mobile

### Accessibility
- prefers-reduced-motion support
- Large tap targets (min 44px)
- High contrast text
- Semantic HTML structure
