# Header redesign — Peru Grand Travel

**Date:** 2026-09-03  
**Status:** Approved for implementation  
**Surfaces:** Sitewide header (desktop + mobile)

---

## 1. Problem

Current header is functional but generic: logo + plain text links + hamburger menu. On mobile it's just search + hamburger — indistinguishable from a template. No WhatsApp CTA visible without opening the menu. Desktop nav feels flat and underdelivers for a licensed tour operator brand.

## 2. Goals (priority order)

1. **UX** — intuitive navigation that serves travel intent; mobile users get value without opening a menu
2. **Conversion** — WhatsApp CTA always visible (both viewports); quick access to packages
3. **SEO** — preserve all internal links + destinations crawl depth; descriptive anchors
4. **Accessibility** — keyboard nav, focus management, ARIA, ≥44px targets, reduced motion, contrast AA
5. **Visual quality** — premium operator feel; brand-consistent (blue/gold/white); not "AI template"

## 3. Architecture

### Desktop (≥768px)

```
[Logo]  Destinations▼  Packages  Machu Picchu  Tours  Blog  Contact  [🔍 Search]  [📞 +51...]  [💚 WhatsApp]
```

Changes from current:
- **Destinations mega-dropdown** — wider panel with regions + descriptions + featured (Machu Picchu) + "Peru overview →" link. Current dropdown is functional but narrow (w-72); upgrade to wider card layout with subtle gold accent.
- **Search** — keep current `Ctrl+K` trigger button; style upgrade with subtle border + hover.
- **Phone + WhatsApp** — both visible on `lg+` (current behavior preserved but styled better).
- **Active link indicator** — subtle `border-bottom` or `font-semibold` for current route.
- **Logo** — slightly larger presence; keep `priority` loading.

### Mobile (<768px)

**Always-visible bar:**
```
[Logo]  [🔍]  [💚 WA]  [☰ Menu]
```

Key change: **WhatsApp icon-button always visible** in header bar (green, ≥44px). No need to open menu for primary CTA.

**Full-screen menu (on ☰ tap):**
```
┌─────────────────────────────────────┐
│  [Logo]                    [✕ Close]│
│                                     │
│  🔍 Search trips & guides...        │  ← tappable, opens GlobalSearch
│                                     │
│  ▶ Destinations                     │  ← accordion (reuse NavDestinations)
│  ▶ Packages & Tours                 │  ← accordion with top packages
│    • Peru Travel Packages           │
│    • Machu Picchu Tours             │
│    • Inca Trail                     │
│    • Salkantay Trek                 │
│    • Day Tours in Cusco             │
│    • Special Offers                 │
│  Blog                              │
│  Contact                           │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 💚  Chat on WhatsApp            ││  ← prominent CTA
│  │     Plan your Peru trip now     ││
│  └─────────────────────────────────┘│
│                                     │
│  📞 +51 946 622 318                 │
│  ✉️  info@perugrandtravel.com       │
│                                     │
│  Since 2012 · Licensed · Cusco      │  ← trust chips
└─────────────────────────────────────┘
```

Scroll: menu body scrollable if content overflows viewport. Body scroll locked when open (`overflow: hidden` on `<body>`).

## 4. Quality checklist

### Semantics & SEO
- [ ] `<header>` landmark with `<nav aria-label="Main navigation">`
- [ ] All existing hrefs preserved (destinations, packages, machu-picchu, tours, blog, contact)
- [ ] Destinations dropdown: descriptive anchors with region descriptions
- [ ] Mobile menu: same link set in DOM (not lazy-loaded/removed)

### Accessibility
- [ ] Focus trap in full-screen menu (Tab cycles within; Escape closes)
- [ ] `aria-expanded` on menu toggle + destinations toggle
- [ ] Focus moves to close button (or first focusable) on menu open; returns to toggle on close
- [ ] All interactive targets ≥44×44px
- [ ] Visible `:focus-visible` rings
- [ ] `prefers-reduced-motion` respected (menu transition)
- [ ] Body scroll lock when menu open (no background scroll)
- [ ] Screen reader: menu state announced via `aria-expanded`

### UX / content
- [ ] WhatsApp always visible in header bar (mobile + desktop lg+)
- [ ] Search accessible from header bar (both viewports)
- [ ] Mobile menu: search bar at top, WhatsApp CTA prominent, contact info, trust chips
- [ ] Packages accordion in mobile menu with top 6 package links
- [ ] Desktop: active route indicator
- [ ] Smooth open/close transition (respect reduced-motion)

### Performance
- [ ] Logo `priority` loading preserved
- [ ] No layout shift from menu open/close
- [ ] Menu content in DOM (not dynamic import) — keeps SEO links discoverable

### Responsive
- [ ] Desktop: horizontal nav with dropdown
- [ ] Mobile: compact bar + full-screen overlay menu

## 5. Files to touch

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Full redesign — mobile bar + full-screen menu + desktop improvements |
| `src/components/NavDestinations.tsx` | Wider desktop dropdown; mobile accordion stays compatible |
| `src/lib/header-nav.ts` (new) | Package links for mobile menu accordion |

## 6. Visual direction

- Header bar: white bg, subtle bottom border, `backdrop-blur` on scroll
- Destinations dropdown: white card, subtle shadow, gold accent on featured item
- Mobile full-screen: white bg, smooth slide-in from right or fade-in
- WhatsApp button: `bg-pgt-wa` green pill, white icon
- Trust chips: same style as footer (`border-pgt-gold/40`)
- Active link: `text-pgt-blue font-semibold` + thin bottom accent

## 7. Non-goals

- AI chatbot integration (separate project)
- Newsletter in header
- Language switcher
- Award logos in header

## 8. Mobile menu — Packages accordion content

Links from existing `footer-nav.ts` packages section:
1. Peru Travel Packages → /packages/
2. Machu Picchu Tours → /machu-picchu-packages/
3. Inca Trail to Machu Picchu → /inca-trail-tours/
4. Salkantay Trek to Machu Picchu → /salkantay-treks/
5. Day Tours in Cusco → /day-tours-in-cusco/
6. Special Offers → /offers/
