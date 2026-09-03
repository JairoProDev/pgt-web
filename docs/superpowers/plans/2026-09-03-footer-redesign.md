# Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the sitewide footer into a premium, accessible “Operador Premium” closer that preserves SEO links/NAP/schema while improving hierarchy, mobile UX (accordions), dual CTAs, office vs 24/7 WhatsApp hours, awards chips, and an honest newsletter v1 path.

**Architecture:** Keep `Footer` as a mostly Server Component. Extend `siteConfig` with hours/languages/awards chips. Regroup `footer-nav` (brand vs legal). Use native `<details>` for mobile accordions (CSS: open on `md+`) so links stay in the DOM for crawlers with zero client JS. Newsletter is a GET form to `/contact-us/`.

**Tech Stack:** Next.js App Router, React Server Components, Tailwind CSS v4 tokens (`pgt-blue`, `pgt-gold`, `pgt-wa`), `next/image`, existing `JsonLd` + `travelAgencySchema`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-03-footer-redesign-design.md`
- Do not remove key package/destination/company hrefs
- Retain `travelAgencySchema()` JSON-LD
- No fake ESP / no AI chatbot build this pass
- Office hours: Mon–Fri 08:00–13:00 & 14:00–18:00 PET; Sat 09:00–12:00; Sun closed
- WhatsApp assistance: 24/7 (copy honest; CTA = current `whatsAppUrl`)
- Newsletter v1: GET `/contact-us/?intent=newsletter&email=`
- Prefer native `<details>` over client accordion JS
- Contrast AA; focus-visible; touch targets ≥44px
- Browser-verify desktop + mobile before done

## File structure

| File | Responsibility |
|------|----------------|
| `src/lib/site.ts` | `officeHours`, `supportHours`, `languages`, `awardChips` |
| `src/lib/footer-nav.ts` | Regroup company links; trim package descriptions |
| `src/components/Footer.tsx` | Full UI bands + a11y + newsletter form |
| `src/app/globals.css` (only if needed) | `footer details` open-on-desktop helper |

---

### Task 1: Site config — hours, languages, awards

**Files:**
- Modify: `src/lib/site.ts`
- Test: manual typecheck / import from Footer later

**Interfaces:**
- Produces:
  - `siteConfig.officeHours: { summary: string; detail: string }`
  - `siteConfig.supportHours: { summary: string; detail: string }`
  - `siteConfig.languages: readonly string[]`
  - `siteConfig.awardChips: readonly { label: string; href: string }[]`

- [ ] **Step 1: Add fields to `siteConfig`**

After `address` (or near related brand fields), add:

```ts
  officeHours: {
    summary: "Mon–Fri 8:00–13:00 & 14:00–18:00 · Sat 9:00–12:00 PET",
    detail: "Office visits in Cusco. Sunday closed.",
  },
  supportHours: {
    summary: "WhatsApp assistance 24/7",
    detail: "Travel help on WhatsApp anytime — our team (and upcoming AI assistant) replies around the clock.",
  },
  languages: ["English", "Español", "Português"] as const,
  awardChips: [
    { label: "Price Miradas 2023", href: "/awards-and-recognitions/" },
    { label: "Travelers' Choice 2023", href: "/awards-and-recognitions/" },
    { label: "Gercetur Cusco", href: "/awards-and-recognitions/" },
    { label: "Safe Travels 2021", href: "/awards-and-recognitions/" },
  ] as const,
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/site.ts
git commit -m "$(cat <<'EOF'
feat(footer): add office hours, languages, and award chips to site config

EOF
)"
```

---

### Task 2: Regroup footer navigation data

**Files:**
- Modify: `src/lib/footer-nav.ts`

**Interfaces:**
- Consumes: existing `FooterSection` / `FooterLink`
- Produces: updated `footerSections` with company brand + legal order; package descriptions only on top 3

- [ ] **Step 1: Trim package descriptions**

Keep `description` only on:
- Peru Travel Packages
- Machu Picchu Tours  
- Inca Trail to Machu Picchu  

Remove `description` from other package links and from destination links that already have long blurbs if they clutter (keep short destination descriptions OR drop — prefer drop for Destinations column cleanliness; keep labels only).

- [ ] **Step 2: Regroup Company links**

Order:

1. About Us (keep description)
2. Social Projects (keep description)
3. Sustainable Tourism
4. Awards & Recognition
5. Terms & Conditions
6. Privacy Policy
7. Anti-Exploitation Policy
8. ESSNA Code of Conduct
9. Legal Documents

Optionally add a visual separator in the UI later via `link.group?: "brand" | "legal"`:

```ts
export type FooterLink = {
  href: string;
  label: string;
  description?: string;
  group?: "brand" | "legal";
};
```

Mark first four `group: "brand"`, rest `group: "legal"`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/footer-nav.ts
git commit -m "$(cat <<'EOF'
refactor(footer): regroup company links and trim nav descriptions

EOF
)"
```

---

### Task 3: Desktop-open `<details>` CSS helper

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add footer accordion helper**

```css
/* Footer nav: collapsed on small screens, always open from md up */
@media (min-width: 768px) {
  footer details.footer-acc {
    open: true; /* may be ignored in some engines — pair with JS-free attribute strategy below */
  }
}
```

**Preferred JS-free strategy (use this instead of unreliable CSS `open`):**

In `Footer.tsx`, render:
- **Mobile (`md:hidden`):** `<details className="footer-acc">` wrappers
- **Desktop (`hidden md:contents` or duplicate structure with `hidden md:block`):** always-visible columns without `<details>`

Avoid duplicating link lists twice in the DOM if possible — better approach:

**Single DOM strategy:** always render lists; on mobile wrap each column in `<details open>` controlled only by CSS is hard. Use:

```tsx
<details className="group md:open:block" open> 
```

Actually: set `open` attribute always for SSR, then use a tiny pattern:

**Chosen approach for this plan:** Use two presentations from one data map without doubling crawler issues:
1. Desktop grid: `hidden md:grid` with all columns visible
2. Mobile: `md:hidden` with `<details>` — **links appear twice in HTML**. For SEO this is acceptable for footer (same URLs) but slightly redundant.

**Cleaner single-list approach:** always use `<details>` with the `open` attribute present, and on mobile use a small client script — **rejected by spec**.

**Final:** Dual render (mobile details / desktop grid) from shared `footerSections` map. Same hrefs twice is fine for footer IA.

- [ ] **Step 2: Commit only if CSS file changed; otherwise skip**

If no CSS needed (pure Tailwind `hidden md:block` / `md:hidden`), skip this task’s commit.

---

### Task 4: Rebuild `Footer.tsx` UI

**Files:**
- Modify: `src/components/Footer.tsx` (full rewrite of layout; keep `SocialIcon`, schema, WA helper)

**Interfaces:**
- Consumes: `siteConfig.*` new fields, `footerSections`, `footerUtilityLinks`, `whatsAppUrl`, `travelAgencySchema`
- Produces: redesigned `<footer>` matching spec bands

- [ ] **Step 1: Implement band 1 — Trust strip**

- Logo (`siteConfig.logo`) via `next/image` width/height, alt=`siteConfig.name`
- Tagline
- RUC · Cusco
- Trust chips: `Since 2012` · `Licensed operator` · `Cusco`
- Gold hairline (`border-pgt-gold/40`)

- [ ] **Step 2: Implement band 2 — Contact**

- `<address>` with legalName, RUC, formatted address, tel links, email
- Office hours from `siteConfig.officeHours`
- Support hours from `siteConfig.supportHours`
- Languages line
- Dual CTA:
  - Primary: WhatsApp (`bg-pgt-wa`) `utmContent: "footer_whatsapp"`
  - Secondary: Link to `/contact-us/` outline white
- Social list unchanged pattern (`rel` + aria-label)

- [ ] **Step 3: Implement band 3 — Explore nav**

- Desktop: 3 columns from `footerSections`
- Mobile: each section in `<details>` with `<summary>` min-h-11, focus ring
- Company: if `group === "legal"`, render a small “Policies & legal” label before first legal link
- Link styles: `text-blue-100 hover:text-white focus-visible:outline...`

- [ ] **Step 4: Implement band 4 — Engagement**

- Newsletter card:
  ```tsx
  <form action="/contact-us/" method="get" className="...">
    <input type="hidden" name="intent" value="newsletter" />
    <label htmlFor="footer-newsletter-email">Email for travel tips</label>
    <input id="footer-newsletter-email" name="email" type="email" required autoComplete="email" />
    <button type="submit">Get travel tips</button>
    <p className="text-xs">We’ll open the contact form so our team can follow up. No spam list yet.</p>
  </form>
  ```
- Payments block (existing logos)
- Award chips as links styled with gold border/pill

- [ ] **Step 5: Implement band 5 — Legal bar**

- © year · name
- Utility links + Privacy shortcut if not already in utilities

- [ ] **Step 6: Lint / typecheck locally**

```bash
npx tsc --noEmit
npm run lint -- --file src/components/Footer.tsx --file src/lib/site.ts --file src/lib/footer-nav.ts
```

Expected: no errors in touched files.

- [ ] **Step 7: Commit**

```bash
git add src/components/Footer.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(footer): premium operator layout with a11y, trust, and newsletter path

EOF
)"
```

---

### Task 5: Browser verification (desktop + mobile)

**Files:** none (manual / MCP browser)

- [ ] **Step 1: Ensure dev server**

```bash
npm run dev
```

- [ ] **Step 2: Desktop checks (`/` at ≥1280px)**

- Footer bands visible and aligned
- Logo + dual CTAs work
- All package/destination/company links clickable
- Keyboard tab through footer; focus rings visible
- Newsletter submit lands on `/contact-us/?intent=newsletter&email=...`

- [ ] **Step 3: Mobile checks (375px)**

- Contact + CTAs visible without opening accordion
- Accordions expand/collapse with click and keyboard
- No horizontal overflow
- Social/payment targets tappable

- [ ] **Step 4: Fix any issues found; re-verify; commit if needed**

```bash
git add -A src/components/Footer.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
fix(footer): address QA findings from desktop/mobile verification

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Trust strip + logo | Task 4.1 |
| NAP / address | Task 4.2 |
| Office vs 24/7 hours | Task 1 + 4.2 |
| Languages | Task 1 + 4.2 |
| Dual CTA | Task 4.2 |
| Accordion mobile | Task 4.3 |
| Regroup legal | Task 2 |
| Newsletter v1 | Task 4.4 |
| Payments + awards | Task 4.4 |
| Schema retained | Task 4 (keep JsonLd) |
| SEO links preserved | Task 2 + 4.3 |
| Browser verify | Task 5 |

No placeholders remaining. Types consistent (`officeHours`, `supportHours`, `awardChips`, `group`).
