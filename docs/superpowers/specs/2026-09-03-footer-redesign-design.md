# Footer redesign — Peru Grand Travel

**Date:** 2026-09-03  
**Status:** Awaiting user review before implementation plan  
**Approach:** A — Operador Premium (balanced SEO + UX)  
**Surfaces:** Desktop + mobile (`https` site footer sitewide)

---

## 1. Problem

The current footer is SEO-capable (NAP, schema, internal links, WhatsApp UTM) but visually dense, flat, and weakly hierarchical. On mobile it becomes a long stack. Legal links dominate the “Company” column. Payment and trust cues feel tacked on. It under-delivers as a **trust + navigation + conversion** closer.

## 2. Goals (priority order)

1. **Accessibility** — keyboard, contrast AA, clear landmarks, ≥44px targets, reduced motion
2. **UX** — scannable hierarchy; mobile accordions; obvious contact paths
3. **Indexation / SEO** — keep key internal links, NAP, TravelAgency JSON-LD, descriptive anchors, crawl depth
4. **Conversion** — WhatsApp (primary) + Contact (secondary); UTM `footer_*`
5. **Visual quality** — professional operator brand; gold accent restraint; not generic “AI footer”

**Non-goals (this pass):** real AI chatbot build, ESP (Mailchimp/Resend), new award logo assets, locale switcher that changes language.

---

## 3. Real job of this section

| Job | How the footer delivers |
|-----|-------------------------|
| Trust / E-E-A-T | Logo, licensed claim, RUC, Cusco address, years, awards chips, payments |
| Local / NAP | Structured `<address>`, tel/mailto, office hours |
| Escape hatches | Packages, destinations, company, blog, legal |
| Conversion | WA 24/7 + Contact; newsletter path without fake backend |
| Compliance | Privacy, terms, anti-exploitation, ESSNA |
| Brand close | Consistent blue/gold; calm legal bar |

---

## 4. Quality checklist (acceptance criteria)

### Semantics & SEO
- [ ] Single `<footer>` landmark per page
- [ ] One `nav` per link group with `aria-labelledby` → unique `h2`
- [ ] NAP in `<address class="not-italic">`
- [ ] `travelAgencySchema()` JSON-LD retained
- [ ] Social links: `rel="noopener noreferrer me"`, descriptive `aria-label`
- [ ] Key package/destination/company hrefs preserved (no silent removals)
- [ ] Anchor text descriptive (no “click here”)
- [ ] Descriptions only on top package links (max ~3) to reduce noise

### Accessibility
- [ ] Text/background contrast ≥ 4.5:1 (prefer white/blue-100 on `#193a8a` / `#122a66`)
- [ ] Visible `:focus-visible` rings on all interactive controls
- [ ] Touch targets ≥ 44×44px (social, accordion headers, CTAs)
- [ ] Mobile sections: accordion with keyboard support (Enter/Space), `aria-expanded` or native `<details>`
- [ ] Desktop: all nav sections expanded (no accordion)
- [ ] `prefers-reduced-motion` respected (no required motion)
- [ ] Form fields have visible labels (newsletter)
- [ ] Decorative icons `aria-hidden="true"`

### UX / content
- [ ] Clear visual bands (trust → contact/nav → engagement → legal)
- [ ] Dual CTA: WhatsApp primary, Contact secondary
- [ ] Office hours vs WhatsApp 24/7 assistance shown separately
- [ ] Languages listed as info (EN / ES / PT) — not a fake switcher
- [ ] Awards as text chips linking to `/awards-and-recognitions/`
- [ ] Payments + “View all methods” retained

### Performance
- [ ] Payment/logo images `loading="lazy"` (below fold)
- [ ] No heavy client JS; prefer native `<details>` or one tiny client island
- [ ] No layout shift from icons/logos (width/height set)

### Responsive
- [ ] Desktop: ~12-column grid; contact + 3 nav cols + engagement row
- [ ] Tablet: 2-col nav where sensible
- [ ] Mobile: stacked; nav/engagement in accordions; CTAs full-width friendly

### Conversion / measurement
- [ ] WA UTM `utm_content` distinct (`footer_contact`, `footer_support_24_7`, etc.)
- [ ] Newsletter does not claim a live list until ESP exists
- [ ] Newsletter submits to honest path: `/contact-us/?intent=newsletter&email=` (validated) or equivalent

---

## 5. Information architecture (bands)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TRUST STRIP                                              │
│  [Logo]  Claim / tagline              RUC · Cusco, Peru     │
│  chips: Since 2012 · Licensed operator · Cusco              │
├─────────────────────────────────────────────────────────────┤
│ 2. BRAND + CONTACT          │ 3. EXPLORE (3 navs)           │
│  Legal name, RUC            │  Packages & Tours             │
│  Address                    │  Destinations (+ blog)        │
│  Phones PE / US, email      │  Our Company                  │
│  Office hours (PET)         │    · brand links              │
│  WA assistance 24/7         │    · Policies & legal group   │
│  Languages                  │                               │
│  [WhatsApp] [Contact]       │                               │
│  Social icons               │                               │
├─────────────────────────────────────────────────────────────┤
│ 4. ENGAGEMENT & TRUST                                       │
│  Newsletter card  │  Secure payment logos  │  Award chips   │
├─────────────────────────────────────────────────────────────┤
│ 5. LEGAL BAR                                                │
│  © year · name · Contact · Payments · Work With Us · …    │
└─────────────────────────────────────────────────────────────┘
```

**Mobile:** bands 3–4 collapse into accessible accordions (Packages, Destinations, Company, Payments & more). Band 2 (contact + CTAs) stays visible — conversion first.

---

## 6. Visual direction

- **Palette:** `--pgt-blue` `#193a8a`, `--pgt-blue-dark` `#122a66`, `--pgt-gold` `#aa9875`, WA `#25d366`, white / soft blue text
- **Signature:** “Operator desk” — logo + claim + gold hairline + small trust chips; disciplined spacing; no glassmorphism / acid gradients
- **Type:** existing Poppins; section labels uppercase tracking; body sm; legal xs
- **Motion:** optional subtle hover on links only; honor reduced motion

---

## 7. Content decisions

### Hours
- **Office (Cusco):** Mon–Fri 08:00–13:00 & 14:00–18:00 PET · Sat 09:00–12:00 · Sun closed
- **WhatsApp assistance:** 24/7 — copy positions future AI assistant honestly (“Travel assistance on WhatsApp — available 24/7”) without claiming a product that is not shipped yet. CTA uses current `whatsAppUrl`.

### Languages
- English · Español · Português (informational)

### Awards chips (from awards page body)
- Price Miradas 2023  
- Travelers’ Choice 2023  
- Gercetur – Cusco  
- Sello Safe Travels 2021  
All link to `/awards-and-recognitions/`.

### Company column regroup
**Brand:** About Us, Social Projects, Sustainable Tourism, Awards & Recognition  
**Policies & legal:** Terms, Privacy, Anti-Exploitation, ESSNA, Legal Documents  

### Newsletter (v1)
- Labeled email + submit
- Client validation (`type="email"` + required)
- Navigate/submit to `/contact-us/?intent=newsletter&email={encoded}`
- Helper text: we will follow up to confirm travel tips — no “you’re subscribed” fake success for a non-existent list
- Accessible live region for validation errors

---

## 8. Technical plan (files)

| File | Change |
|------|--------|
| `src/lib/site.ts` | Add `officeHours`, `supportHours`, `languages` (or parallel constants) |
| `src/lib/footer-nav.ts` | Regroup company links; trim descriptions; optional `legalGroup` |
| `src/components/Footer.tsx` | Full UI redesign per bands; a11y; newsletter form |
| Optional small client component | Only if native `<details>` is insufficient for “one open” behavior — prefer native first |

**Keep:** `JsonLd` + `travelAgencySchema()`, payment logos from `siteConfig`, social icons, utility links in legal bar.

---

## 9. Wireframes

### Desktop
```
[logo] Licensed Cusco tour operator…          RUC · Cusco
Since 2012 · Licensed · Cusco                 ───────────

CONTACT                 PACKAGES     DESTINATIONS   COMPANY
NAP + hours + langs     …links       …links         brand
[WA filled][Contact]                                ──legal──
○ ○ ○ ○ social                                      …links

┌ Newsletter ────────┐  Payments logos   Award chips →
└────────────────────┘

© 2026 Peru Grand Travel · Contact · Payments · Work With Us
```

### Mobile
```
[logo + claim + RUC]
CONTACT block (always open) + dual CTA + social
▶ Packages
▶ Destinations
▶ Company
▶ Payments & awards
▶ Get travel tips (newsletter)
© legal bar
```

---

## 10. Risks & follow-ups

| Risk | Mitigation |
|------|------------|
| Accordion hides links from some crawlers | Prefer content in DOM (native `<details>` keeps links in HTML); do not `display:none` remove from DOM |
| Fake newsletter trust damage | Honest copy + contact intent path |
| Hours wrong after launch | Single source in `siteConfig` |
| AI bot not built yet | Footer copy “24/7 WhatsApp assistance”; bot is a later project |

**Follow-ups (out of scope):** real AI WhatsApp bot; ESP integration; award image badges; i18n router.

---

## 11. Success metrics (qualitative + light analytics)

- Footer feels premium and scannable on mobile & desktop (reviewer judgment + screenshots)
- No a11y regressions (keyboard pass, contrast)
- WA clicks from footer still fire with UTM
- GSC: no sudden drop in internal link discovery for hub URLs (monitor post-deploy)
- Newsletter intent reaches contact flow without console/network errors

---

## 12. Approval record

- Priority: balanced premium (SEO keys + hierarchy)  
- Mobile: accessible accordions  
- Extras: logo, hours (office vs 24/7 WA), awards chips, dual CTA, newsletter v1  
- Approach: A — Operador Premium  
- Design sections 1–3: approved (hours refined by user)
