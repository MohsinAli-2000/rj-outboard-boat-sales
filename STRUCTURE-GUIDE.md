# RJ's Outboard Sales & Service — Build & Structure Guide

The rulebook for building this site. Read it before writing any HTML, CSS or JS.

**Current goal:** build the **Home page** from Figma, pixel-perfect, working on every screen size.

Figma (Home frame, dev mode):
<https://www.figma.com/design/oOgodTh38PiZrw5An3hVph/RJ-s-Outboard-Sales---Service?node-id=1-267&m=dev>

This is a plain static site: HTML + Bootstrap 4 + jQuery. No build step, no framework.

---

## 0. The six golden rules

1. **Pixel-perfect to Figma.** Every size, gap, colour, font, radius, shadow, opacity and image crop is read from the Figma node and matched exactly at the design width (1920). Never eyeball it. If a value can't be read from Figma, ask — don't guess.
2. **Every screen size works.** The design is delivered at 1920, but the page must look intentional from **1920 down to 320**. Nothing overflows, nothing is clipped, nothing is unreadably small. See §7.
3. **Class names a stranger can read.** Full words, no abbreviations, named for *what the thing is*, not how it looks. See §3.
4. **Clean, clear code.** One job per class, no duplicated declarations, no dead code, comments that explain *why*. See §4.
5. **Reuse before you write.** Use an existing class or pattern first. Add new CSS only when nothing fits.
6. **All CSS lives in `style.css`.** Any CSS you add or paste — a shared block, a modal, an error state, a one-off — goes into `assets/css/style.css`, in the right region (§5), with its `@media` rules in `RESPONSIVE` and colours as `:root` tokens. Never a second stylesheet, a `<style>` tag or an inline `style=""`. If it is a reusable block, also record it in §14 so the guide stays the template for the next site.

---

## 1. Project layout

```
RJ outboard Sales/
  home.html            ← one HTML file per page, all at the root
  STRUCTURE-GUIDE.md
  assets/
    css/style.css      ← the single stylesheet
    js/script.js       ← the single script
    images/
      common/          ← logo, icons, shared placeholders (used on every page)
      home/            ← ALL Home images, flat — no sub-folders per section
      <page>/          ← one flat folder per additional page (about/, service/, …)
    fonts/             ← self-hosted @font-face files (if any)
    videos/
```

- Reference files with relative paths: `./assets/css/style.css`, `./assets/js/script.js`, `https://cdn.mdsbrand.com/mean-rj-outboard/assets/images/home/hero-background.webp`.
- **One flat folder per page under `assets/images/`.** Never split a page's images into per-section sub-folders. Prefix the file name with its section instead, so nothing collides and the folder still sorts sensibly: `brand-logo-g3.png`, `brand-photo-g3.png`, `category-pontoons.jpg`, `blog-service-tips-spring-run.jpg`, `social-duck-hunters.jpg`. An image used on more than one page goes in `common/`.
- Image and video file names are lowercase-kebab-case and describe the content: `hero-boat-on-lake.jpg`, not `IMG_0231.jpg` or `Frame 12.png`.
- Export images from Figma at **2x** (and SVG for icons/logos) so they stay sharp on retina screens.

> **Status:** the Home page has been rebuilt to this guide from the Figma frame. The previous project's `pkm-` classes, Cinzel/cobalt/aqua palette and CDN images are gone. Any value in this guide that disagrees with Figma is stale — Figma wins (see §6).

---

## 2. Every page is built from 4 fixed blocks

In this order:

```
<head>      → CDN + meta block (only <title> / <meta description> change)
<header>    → site header / nav          (identical on every page)
<div>       → mega-menu + mobile drawer  (identical on every page)
... PAGE CONTENT ...                     ← the only part that changes
<footer>    → footer                     (identical on every page)
<script>    → CDN script block + script.js
```

To make a new page: copy `home.html`, keep the head / header / menu / footer / script blocks byte-for-byte, change only `<title>`, `<meta description>` and `href`s, and replace the content between:

```html
<!-- ======= Home page starts here ======= -->
<!-- ======= Home page ends here ======= -->
```

### 2.1 `<head>` (copy verbatim)

Order is fixed: Bootstrap → Owl Carousel (2 files) → Fancybox → Font Awesome → `style.css`. `style.css` is **always last** so it overrides the libraries.

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PAGE-SPECIFIC DESCRIPTION">
    <meta name="author" content="RJ's Outboard Sales & Service">
    <title>PAGE NAME | RJ's Outboard Sales & Service</title>

    <!-- ======= Bootstrap CSS ======= -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">

    <!-- ======= Owl Carousel CSS ======= -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
        referrerpolicy="no-referrer">
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
        referrerpolicy="no-referrer">

    <!-- ======= Fancybox CSS ======= -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- ======= Custom Styles ======= -->
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
```

Web fonts (Google Fonts `@import` or `@font-face`) go at the **top of `style.css`**, not in the `<head>`, so the head stays identical on every page.

### 2.2 Script block (copy verbatim, bottom of `<body>`)

jQuery **must** come first.

```html
    <!-- ======= Script Dependencies ======= -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js"></script>
    <script src="./assets/js/script.js"></script>
</body>
</html>
```

### 2.3 Header, menus, footer

These are identical on every page. Build them once on the Home page from Figma, then copy them unchanged to every other page. Wire links to real files where they exist; use `javascript:void(0)` as the placeholder everywhere else.

- **Header** — fixed to the top: an optional top bar above the logo + main nav bar (the old "phone button" is gone). The header height is the `--topbar-height` + `--navbar-height` tokens, and `<body>` padding and `scroll-padding-top` both read their sum, so they never drift. **Not every Figma frame has the top bar** — Home does, Sell/Trade doesn't. For a page without it, omit the `.rj-topbar` block and add `class="rj-no-topbar"` to `<html>`; that sets `--topbar-height: 0px` and the page offset follows.
- **Desktop dropdown panels** — three of them: Sales = the full-width inventory mega menu (`.rj-mega`, inside a `.rj-nav__item--static` so it spans the header), Service and Resources = 320px lists (`.rj-dropdown`). Each trigger is a `button.rj-nav__link.js-mega-trigger` whose `aria-controls` names its panel; panels start `hidden`. They open on **click only, never hover**, one at a time, and close on an outside click or Escape. Adding a new one needs only the markup — script.js reads `aria-controls`. The nav markup is identical on every page (the Figma *Menu-Company* frame is wired to the **Resources** item).
- **Mobile drawer** — Sales / Service / Resources are accordions (`.js-mobile-sub-toggle` + `.rj-mobile-menu__sub`) carrying the same links as the panels; keep both in sync.
- **Mobile drawer** — the desktop nav hides and the burger + off-canvas drawer appear at ≤991. If Figma has no mobile nav, build it from the same colours and fonts; don't invent a new look. Every link in a desktop panel must also exist in the drawer — keep them in sync.
- **Footer** — check the Figma `Footer` instance for the page you're building. Don't copy another page's footer on autopilot.
  - Known per-page differences so far: the newsletter **Sign up** button is `rj-button--primary` (#ff2b14) on Home and Financing but `rj-button--accent` (Milano Red) on Sell/Trade and Repower. The footer's *Sell/Trade Your Boat* link points to `./sell-trade.html` and *Get Financing* to `./financing.html`, *Our Story* to `./about.html` and *Meet The Team* to `./about.html#rj-team` on every page. The About footer's Sign up button is `rj-button--accent` (Milano Red).

---

## 3. Class naming — make every class easy to understand

### 3.1 The convention (BEM-style, with an `rj-` prefix)

```
rj-<block>                 the component or section
rj-<block>__<element>      a part inside it
rj-<block>--<modifier>     a variation of it
```

Every class this project adds starts with **`rj-`**. Never introduce a second prefix, and don't mix in the old `pkm-` prefix.

```html
<section class="rj-inventory">
    <div class="rj-inventory__header">
        <p class="rj-eyebrow">In Stock Now</p>
        <h2 class="rj-heading-large">Curated, Not Crowded</h2>
    </div>
    <a class="rj-boat-card rj-boat-card--featured" href="...">
        <h3 class="rj-boat-card__name">2025 Bennington 24 MFBSE</h3>
        <p class="rj-boat-card__price">$89,995</p>
    </a>
</section>
```

### 3.2 Rules

1. **Full words, no abbreviations.** `rj-inventory`, not `pkm-inv`. `rj-newsletter`, not `pkm-nl`. `rj-boat-card`, not `pkm-bc`. The one exception is widely understood short forms like `nav`, `cta`, `img`.
2. **Name by purpose, not by looks.** `rj-boat-card__price`, not `rj-big-blue-text`. A class should still make sense if the design changes.
3. **Name by purpose, not by position.** `rj-hero__lead`, not `rj-hero__second-paragraph`.
4. **Never encode a measurement.** Not `rj-img-706x300`. Use the ratio's meaning — `rj-media--wide`, `rj-media--card` — so a resize doesn't force a rename.
5. **No page prefix soup.** Section classes are named for the section (`rj-hero`, `rj-new-arrivals`, `rj-inventory`, `rj-storage-promo`), not `rj-home-section-3`.
6. **State classes use `is-` / `has-`.** `is-open`, `is-active`, `is-visible`.
7. **JavaScript hooks are separate from styling classes.** Prefer `data-` attributes (`data-mega-trigger`, `data-filter="pontoons"`) or a dedicated `js-` class (`js-filter-button`) for JS to find elements. Never style a `js-` class.
8. **Don't style by tag or by Bootstrap internals.** Style your own class. Don't write `.rj-card div p`.
9. **A class name should read like a sentence in the markup.** If you have to open the CSS to know what a class is for, rename it.

### 3.3 Shared (reusable) classes

Typography, buttons, shells, spacing utilities and media wrappers are shared across the whole site and live in the *common* region of `style.css`. Name them for their role, not their pixel size:

| Role | Class | Notes |
|------|-------|-------|
| Eyebrow above a heading | `.rj-eyebrow` | small, wide-tracked, uppercase |
| Page hero heading | `.rj-heading-hero` | biggest |
| Section heading, large | `.rj-heading-large` | |
| Section heading | `.rj-heading` | |
| Card title | `.rj-heading-card` | |
| Lead paragraph | `.rj-text-lead` | |
| Body paragraph | `.rj-text` | default body copy |
| Small caption/label | `.rj-text-small` | |
| Primary button | `.rj-button .rj-button--primary` | |
| Secondary button | `.rj-button .rj-button--secondary` | |
| Outline button | `.rj-button .rj-button--outline` | |
| Content container | `.rj-container` | the main page gutter |

The exact sizes behind each class come from the Figma text styles; the table is the naming, not the values.

---

## 4. Clean, clear code

### 4.1 HTML

- Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<h1>`–`<h6>`, `<ul>/<li>` for lists, `<a>` for links, `<button>` for actions, `<form>/<label>/<input>` for forms.
- **One `<h1>` per page**, headings in order (don't jump `h2` → `h5` for size — use the class for size).
- Every `<img>` has a meaningful `alt` (empty `alt=""` only if purely decorative) **and `width`/`height` attributes** so the layout doesn't jump while loading. Below-the-fold images get `loading="lazy"`.
- Indent with 4 spaces. Close a section with a comment only when it's long: `<!-- ======= Inventory ends here ======= -->`.
- Mark each section with a short comment at its start: `<!-- ---- inventory ---- -->`.
- No inline `style=""` (the one exception: the honeypot input's `display:none`). No inline event handlers (`onclick=""`).
- Don't leave commented-out markup, `Lorem ipsum`, or console logs behind.

### 4.2 CSS

- **One declaration block per selector.** Never write the same selector twice in the file to "patch" it — edit the original.
- **No `!important`** unless overriding a third-party library, and then add a comment saying which one.
- **Group properties in a consistent order:** position/display → box model (width, margin, padding) → typography → colour/background/border → effects → transitions.
- **Comments explain why, not what.** `/* Figma sets the logo 4px inside the gutter */` is good; `/* red text */` is noise.
- **No magic numbers without a source.** When a value looks odd (`margin-top: 23.66px`), say it came from Figma. Where Figma gives an odd value that is clearly a rounding artefact (`23.66` → `24`), round it and keep the design intent — but don't change anything visible.
- **Tokens first.** Declare colours, fonts and the container width once as CSS custom properties on `:root` and use `var(--…)` everywhere:

```css
:root {
    /* names are the Figma color styles — see assets/css/style.css for the full set */
    --color-firefly: #0b1526;
    --color-downriver: #08203f;
    --color-milano-red: #c91800;
    --color-signal-red: #ff2b14;
    --color-venice-blue: #0a4a94;
    --color-white: #ffffff;

    /* neutral charcoal scheme for the shared common blocks (§14) */
    --color-charcoal: #222222;
    --color-ink: #1e1e1e;
    --color-near-black: #1a1a1a;
    --color-input-border: #dedfe0;
    --color-error-red: #ff0000;
    --white-20: rgba(255, 255, 255, 0.2);
    --white-60: rgba(255, 255, 255, 0.6);

    --font-display: 'Sora', sans-serif;
    --font-body: 'Archivo', sans-serif;
    --font-label: 'Inter', sans-serif;

    --topbar-height: 49px;
    --navbar-height: 102.97px;
    --header-height: calc(var(--topbar-height) + var(--navbar-height));
}
```

> Values above come from Figma's color and text styles (Home frame). When a later page's frame differs, Figma wins — change the token, not every usage.

- Delete CSS you don't use. When a page is rebuilt, remove the old classes it replaced.

### 4.3 JavaScript

- One `$(document).ready(...)` in `script.js`, split into labelled regions (§9).
- No inline scripts in the HTML. No `console.log` left behind.
- Name things for what they do: `openMobileMenu()`, not `fn1()`.

---

## 5. `style.css` is organised in strict regions

Read top to bottom. Add rules to the **correct region**, never at the end by habit.

| Order | Region (marked by a `/* ==== */` banner) | What lives here |
|-------|------------------------------------------|-----------------|
| 0 | font `@import` / `@font-face` | top of the file |
| 1 | `:root` tokens | colours, fonts, header height |
| 2 | Common | reset, typography, buttons, container, media wrappers, shared helpers |
| 3 | Header / nav | `.rj-header*`, `.rj-nav*` |
| 4 | Mega menu + mobile menu | `.rj-mega-menu*`, `.rj-mobile-menu*` |
| 5 | Footer | `.rj-footer*` |
| 6 | Home page | every Home-only section |
| 7…N | one banner per additional page | that page's **base** classes only — **no `@media`** |
| N+1 | `404 + shared common blocks` | the §14 template blocks (common section, share modal, special banner, error states) |
| LAST | `RESPONSIVE` | **every** `@media` rule in the site (§7) |

A page's base CSS goes in **one contiguous, labelled block**, with a `/* ---- section name ---- */` sub-comment per section, in the same order the sections appear on the page.

---

## 6. Design system

Take every value from Figma. These are the building blocks:

- **Colours** — Figma's color styles (Firefly, Downriver, Big Stone, Milano Red, Signal Red, Venice Blue, Catskill White, Blue Bayoux …) as tokens. Recurring alphas (card borders, hairlines) are named tokens too, not repeated literals.
- **Neutral scheme for the shared common blocks** — Charcoal `#222222` (headings, dark buttons, banner fill), Ink `#1e1e1e` (body paragraph), Near Black `#1a1a1a` (modal text, share icons, copy button), Input Border `#dedfe0`, Error Red `#ff0000` (invalid fields), plus white at 20% (hairline) and 60% (muted link). Tokens: `--color-charcoal`, `--color-ink`, `--color-near-black`, `--color-input-border`, `--color-error-red`, `--white-20`, `--white-60`. This is the starting scheme for a new site — swap the token values, not the rules.
- **Fonts** — Sora (`--font-display`) for headings, nav, buttons and prices; Archivo (`--font-body`) for body copy and eyebrows; Inter (`--font-label`) only for the "boat photo" placeholder label and small tag labels. Verify against Figma.
- **Type scale** — one shared class per Figma text style (§3.3). A section never sets its own font-size/line-height for a style that already has a class. A genuine one-off is written once, scoped to its block, with a comment saying why it's an exception.
- **Buttons** — `.rj-button` is the base (height, font, tracking, uppercase, square corners) plus one fill modifier. Set widths per instance only when Figma fixes them; otherwise let the label and padding decide.
- **Container** — `.rj-container` holds the page gutter. At 1920 it reproduces Figma's side gutters; below that it shrinks fluidly (§7.3). The header and hero use a narrower variant (`.rj-container--narrow`) only if Figma's gutters differ.

### 6.1 Cursor on icons, images and headings

Every heading (`<h1>`–`<h6>`), `<img>`, icon (`<i class="fa-...">`, inline `<svg>`) and media wrapper gets `cursor: pointer`, even when not wrapped in a link. It is written **once**, in the common region. When you add a new media wrapper, add its class to that selector list rather than writing another `cursor: pointer` elsewhere.

### 6.1.1 One CTA per block

If a card or section holds an image, a heading and a button/link, and any one of them is the CTA, **all of them fire the same CTA**:

- The button/link keeps its `href`.
- The heading text is wrapped: `<h2 class="rj-heading"><a href="SAME-HREF">Title</a></h2>`.
- The photo is wrapped: `<a class="rj-cta-media" href="SAME-HREF" tabindex="-1" aria-hidden="true"><img …></a>` (inside the photo wrapper when there is one). `.rj-cta-media` is `display: contents`, so it adds no box and changes no layout. The image link is hidden from keyboard and screen readers because the heading link already covers them.
- A card that is already one big `<a>` (boat, blog, category, brand cards) needs nothing extra.
- Decorative background images (hero, full-width bands) stay unlinked; they still get the pointer cursor from the shared rule.
- A block with two or more different CTAs (e.g. a hero with "Shop" and "Book service") has no single action, so its heading and image stay unlinked.

### 6.2 Buttons in a flex column

A flex-column parent defaults its children to `align-items: stretch`, so an `<a class="rj-button">` fills the whole column. Any flex-column content block that ends in a button needs an explicit `align-items: flex-start` (or `center`, to match the design).

---

## 7. Responsive — works on every screen size

### 7.1 Required viewport checks

Before a section is "done", check it at each of these widths in browser dev tools. No horizontal scrollbar at any of them:

```
1920 · 1600 · 1440 · 1366 · 1200 · 1024 · 991 · 768 · 576 · 425 · 375 · 320
```

- **1920** — must match Figma pixel-for-pixel (overlay the Figma frame to compare).
- **Everything else** — must look deliberate: sensible spacing, no clipped text, no overlapping elements, images cropped well, tap targets ≥ 44px on touch sizes.
- Also check **landscape phone** (e.g. 667×375) and a **very wide** screen (2560) — content stays centred and doesn't stretch.

### 7.2 One `@media` per breakpoint, all at the bottom

All responsive CSS lives in a single block at the end of `style.css`. **No `@media` rule appears anywhere else.**

Desktop-first `max-width`, ordered largest → smallest. The only allowed breakpoints:

```
1600 · 1500 · 1440 · 1350 · 1200 · 991 · 768 · 576 · 400
```

`1200 / 991 / 768 / 576` are the workhorses. Use the others only when a layout genuinely breaks there.

> **A breakpoint is opened ONCE for the whole stylesheet.** If `@media (max-width: 576px)` already exists, add your selectors **inside** it — never open a second `576px` block. This is the most important CSS rule in the project.

```css
/* =================================================================
   RESPONSIVE — one block per breakpoint, largest → smallest.
   Never open a second @media for a breakpoint that already exists;
   append a "---- Section name ----" group inside the existing one.
   ================================================================= */

@media (max-width: 1200px) {
    /* ---- Global ---- */
    /* ---- Header / nav ---- */
    /* ---- Footer ---- */
    /* ---- Home page ---- */
}

@media (max-width: 991px)  { /* same group order */ }
@media (max-width: 768px)  { /* same group order */ }
@media (max-width: 576px)  { /* same group order */ }
```

Inside each breakpoint keep the groups in the same order as the base regions in §5.

### 7.3 Make things fluid first, breakpoints second

Breakpoints are for *layout changes*, not for every size tweak. Prefer:

- **Fluid widths** — `width: 100%; max-width: 760px`, never a bare `width: 760px`.
- **Fluid gutters and spacing** — `padding-inline: clamp(16px, 5vw, 240px)`-style rules, so the gutter shrinks smoothly instead of jumping.
- **Fluid type for big headings** — `font-size: clamp(36px, 5.4vw, 104px)`, with the 1920 value as the `clamp` maximum so Figma still matches exactly at 1920.
- **Aspect-ratio for media** — `aspect-ratio: 706 / 300` plus `object-fit: cover`, instead of fixed heights that break on narrow screens.
- **`min-height`, not `height`**, for text-bearing blocks, so longer text or bigger fonts can't overflow.

### 7.4 Conventions across breakpoints

- Section vertical padding steps down in the same ladder everywhere — pick the steps from the first section built and reuse them.
- Headings step down at `1200 / 991 / 576`; define each heading class's ladder **once** in the *Global* group.
- Grids collapse `4 → 3 (≤1200) → 2 (≤991) → 1 (≤576)`. With Bootstrap columns (§8.1) most of this is free via `col-6 col-md-4 col-lg-3`.
- Desktop nav hides and the burger + drawer appear at ≤991.
- Overlapping / negative-margin elements reset to a normal flow at ≤991.
- Side-by-side text + image blocks stack at ≤991, **text first or image first as Figma's mobile order dictates** — if Figma has no mobile frame, image on top, text below.
- Fixed pixel heights on heroes become `min-height` and shrink at ≤768.
- Buttons go full width at ≤576 when they sit alone in a row.

### 7.5 Flex-column width gotchas (both bit us before)

- A `width: Npx; max-width: 100%` element only clamps correctly if **every ancestor up to a definite-width block has a resolvable width**. A `display:flex; flex-direction:column` wrapper sizes to its content by default, so a width/max-width element nested two or more flex-column levels deep silently overflows on mobile. Fix: give the intermediate wrapper(s) `width: 100%`. Check this proactively on any nested flex-column that holds a fixed-width text element, especially one that becomes a column only at a breakpoint.
- **Never add `width: 100%` to an element that already carries a gutter-row utility** (`.rj-row-gap-24`, etc.). Those rely on Bootstrap's `.row` behaviour — `width:auto` plus negative side margins — to expand past the container by the gutter. An explicit `width: 100%` cancels that and every column comes out one gutter too narrow.

---

## 8. Layout patterns

### 8.1 Repeating items → Bootstrap grid

Any section laying out 2, 3, 4 or more repeating items (cards, logos, stats, steps, tiles) uses `.row` + `.col-*` — **not** a hand-written `display: grid`. Bootstrap already carries the responsive collapse, so the breakpoint blocks stay small.

```html
<div class="row">
    <div class="col-12 col-md-6 col-lg-4">... card ...</div>
    <div class="col-12 col-md-6 col-lg-4">... card ...</div>
    <div class="col-12 col-md-6 col-lg-4">... card ...</div>
</div>
```

| Items per row (desktop) | Classes | Collapse |
|---|---|---|
| 2 | `col-12 col-lg-6` | 2 → 1 at <992 |
| 3 | `col-12 col-md-6 col-lg-4` | 3 → 2 → 1 |
| 4 | `col-6 col-md-4 col-lg-3` | 4 → 3 → 2 |
| 5+ / logo strips | `col-6 col-md-4 col-lg-3 col-xl-2` | wraps naturally |
| Text + media split | `col-12 col-lg-6` | stacks at <992 |

- **Gutters** come from the grid; vertical rhythm from spacing utilities or a named gutter class. Figma gutters that aren't Bootstrap's 30px get a named override (`.rj-row-gap-24`, `.rj-row-gap-32`).
- **Edge-to-edge walls** use `.row.no-gutters`.
- **Alternating image/text rows** use `flex-lg-row-reverse` on the `.row` and `order-*` on the columns — not a custom `order: -1` rule.
- **Narrower centred column:** `col-lg-10 col-xl-9 mx-auto`.
- Use `display: grid` **only** for bespoke, non-repeating layouts (e.g. an asymmetric `1fr 520px` split).
- Because Bootstrap handles the collapse, don't add a matching `grid-template-columns` override in the responsive block.

### 8.2 Section skeleton

```html
<section class="rj-inventory">
    <div class="rj-container">
        <div class="row">
            <div class="col-lg-10 col-xl-9 mx-auto">   <!-- optional narrower column -->
                ... content ...
            </div>
        </div>
    </div>
</section>
```

Vertical rhythm lives on the section class (`padding-block`); the horizontal gutter lives on `.rj-container`. **Never put side padding on the section itself.**

### 8.3 Fixed-aspect media

Use a wrapper with `aspect-ratio` and a filling `<img>` with `object-fit: cover`. Name the wrapper by what it's for, and reuse it:

```css
.rj-media {
    position: relative;
    overflow: hidden;
}

.rj-media > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.rj-media--card { aspect-ratio: 459 / 240; }
.rj-media--wide { aspect-ratio: 706 / 300; }
```

Where Figma crops an image with a specific zoom/pan, reproduce it with `object-position` (or an explicit `.rj-crop-<subject>` class) so the crop matches exactly.

---

## 9. JavaScript — how `script.js` is organised

One `$(document).ready(...)` split into labelled regions:

```js
$(document).ready(function () {

    /* ===== mobile menu code starts here ===== */
    if ($('.rj-mobile-menu').length) {
        ...
    }
    /* ===== mobile menu code ends here ===== */

});
```

1. Every behaviour gets its own `/* ===== xxx code starts/ends here ===== */` region.
2. **Guard DOM-specific code with a `.length` check**, so the one shared script is safe on every page.
3. Header / nav / menu logic goes first and runs site-wide; carousels go last.
4. Find elements by `data-` attributes or `js-` classes (§3.2 rule 7).

### 9.1 Forms

Every form that has no backend yet uses the one shared handler: give the `<form>` `class="js-form"` and `data-success-message="…"`, and add a `<p class="rj-form-message js-form-message" role="status" hidden></p>` inside it. It validates with the browser, shows the message and resets. Field styling is the shared `.rj-field__label` / `.rj-field__input` family in the common region (`--compact`, `--select`, `--date`, `--textarea`). A date field is `type="text"` + `js-date-input` so its placeholder shows. The two-column form pages (Schedule Demo, Contact) share `.rj-form-column` > `.rj-form-intro` + `.rj-form-card` (`--tinted` for the grey card; pair it with `.rj-field__input--on-tint`).

Sell/Trade and Service Center share the `.rj-request` block too (a contact card + an 8-field form in `.row.rj-row-gap-24`); anchor CTAs to `#rj-request`.

### 9.3 Shared building blocks (reuse before writing new)

- `.rj-spec-card` (label + bold line + short text; `--dark` for navy/photo sections) — five placements on Repower.
- `.rj-bleed` full-width photo bands: set `--bleed-aspect` / `--bleed-height` (`--banner`, `--wide`), photo is `.rj-bleed__photo`; a Figma zoom is `.rj-bleed__photo--zoomed` + a crop class that sets `--zoom-width` / `--zoom-left` / `--zoom-shift`.
- `.rj-split` text + photo rows (photo first when stacked), `.rj-page-hero__headline`, `.rj-eyebrow--spaced`, `.rj-heading-medium` (52px), `.rj-text-body` (16/27.2).
- About page: `.rj-split-section` + `--dark` (navy) / `--compact` (80px padding), `.rj-split__photo--short` (440px), `.rj-split__text--light`, `.rj-bleed--feature` (1920×640 band; `--photo-position` picks the visible part, e.g. `.rj-crop-about-service`), `.rj-heading-feature` (56px), `.rj-heading-card--dark`, `.rj-badges`, `.rj-timeline-card`.
- Company/brand heroes: `.rj-company-hero` (About, Meet Team, Parts) with `--tall` (Bennington, 820px) and `.rj-company-hero__lead--bright`; `.rj-eyebrow--signal` (brighter red) and `--white` label colours.
- Parts / Bennington: the Sell/Trade `.rj-request` block has a navy variant (`.rj-request--dark` + `--wide` / `--light` / `--flush` modifiers); Home's `.rj-inventory` + `.rj-boat-card` take a real `<img>` inside `.rj-boat-card__photo` (Bennington); `.rj-square-list` (red square bullets), `.rj-series-card`, `.rj-part-card`, `.rj-brand-strip`, `.rj-team-card`.
- Bennington is the only page besides Home with the top bar, and its footer has shorter link labels, `Terms` instead of `Accessibility` and the Milano Red Sign up (check the Figma footer on each new page).
- Filterable lists use `hidden` toggled by script.js (Bootstrap's reboot makes `[hidden]` win over any `display`): FAQs (`.js-faq-filter` / `.js-faq-group`, accordion `.js-faq-toggle` with `aria-expanded`) and Blog (`.js-post-filter` / `.js-post[data-category]`). Hero variants on `.rj-company-hero`: `--short` (Testimonials, FAQs), `--blog`, `--tall`.
- Footers: pages with the top bar (Bennington, Testimonials, FAQs) use the shorter-label footer; Blog and the other no-top-bar pages use the standard one. Footer screenshots of Figma footers often time out; `get_design_context` on the footer instance returns its labels and colours reliably.
- `.rj-fin-columns` (520px copy column + flexible stats column, stacks at ≤991) and `.rj-fin-point` (red label + sentence) — Financing hero, estimator and highlights.
- Images used on more than one page live in `assets/images/common/` (e.g. `logo-yamaha-white.png`, `photo-bennington-pontoon.jpg`, `photo-skeeter-bass-boat.png`).

### 9.4 Loan estimator (Financing)

`.rj-estimator.js-estimator` carries `data-rate` (APR %), `data-min` and `data-max`. The amount field is `.js-estimator-amount` (a text input showing `$55,000`: digits only, selects on focus, ↑/↓ nudge by $1,000 / $10,000 with Shift, clamped on blur), the term buttons are `.js-estimator-term[data-months]` (`aria-pressed`), and the result goes into `.js-estimator-payment`. Payment = `P·r / (1 − (1 + r)^−n)` with `r = APR / 12`. Figma only draws a static `$55,000` box for the slider and a placeholder `$389`; the live version starts on the Figma state (120 months) and so shows the correctly computed `$624`.

### 9.2 Interior page heroes

Sell/Trade and Schedule Demo share `.rj-page-hero` (photo, scrim, left column). A page sets only its own `min-height`, vertical alignment, padding and `--hero-scrim` gradient.

Financing is the exception: its Figma hero is a plain 1920×680 photo with the copy on a solid navy panel beneath it, so it reuses only `.rj-page-hero__headline` / `__inner` for the copy stack. When a photo uses `aspect-ratio` + `max-height`, never add a `min-height` at narrow widths (it is carried through the ratio into a `min-width` and overflows) — switch to `aspect-ratio: auto; height: …` instead.

---

## 10. Owl Carousel — use it for every slider

Never hand-roll a slider.

```html
<div class="rj-reviews__slider owl-carousel owl-theme">
    <div class="item"> ...slide... </div>
    <div class="item"> ...slide... </div>
</div>
```

```js
if ($('.rj-reviews__slider').length) {
    $('.rj-reviews__slider').owlCarousel({
        loop: false,
        margin: 20,
        nav: true,
        dots: true,
        smartSpeed: 600,
        slideBy: 1,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } }
    });
}
```

- If a slider class can appear more than once on a page, init with `.each()` and `if (!$(this).hasClass('owl-loaded'))`.
- Custom arrow/dot styling lives in CSS next to that carousel's other rules, in that page's region.

---

## 11. Assets & placeholders

- Use `./assets/images/...` relative paths (every page sits at the project root).
- Keep a single grey placeholder in `assets/images/common/` for any CMS-driven or not-yet-supplied image, and reuse it everywhere.
- Repeating cards with dummy content are **templates** to be filled from a CMS later — keep their markup uniform.
- Don't hot-link images from another project's CDN. Everything the page needs ships in `assets/images/`.

---

## 12. Workflow for building the Home page

Work **section by section** in Figma order. For each section:

1. **Read the Figma node** for that section: sizes, spacing, colours, text styles, image crops. Note the values; don't estimate.
2. **Name it** (§3): decide the block name (`rj-hero`, `rj-new-arrivals`, …) and its elements before writing CSS.
3. **Write the HTML** with semantic tags, existing shared classes first (§3.3), Bootstrap grid for repeating items (§8.1).
4. **Write the base CSS** in the Home page region — tokens only, no hard-coded colours.
5. **Match 1920** against Figma until it's pixel-perfect.
6. **Add responsive CSS** in the shared `RESPONSIVE` block (§7.2), checking every width in §7.1.
7. **Add JS** only if the section needs behaviour (§9).
8. **Tidy** (§13) before moving to the next section.

Build order for the page: **shared head → header + mega menus + mobile drawer → each Home section in Figma order → footer → script block**.

---

## 13. Checklist — before calling a section or page done

**Design**
- [ ] Matches Figma at 1920 (spacing, type, colour, crops, shadows).
- [ ] Looks intentional at every width in §7.1; no horizontal scroll at any of them.
- [ ] Hover, focus and active states exist for every link and button.

**Code**
- [ ] Every class starts with `rj-`, uses full words, follows BEM (§3), and describes purpose.
- [ ] No duplicate selectors, no `!important` (unless commented), no unused CSS.
- [ ] Colours and fonts come from `:root` tokens, not literals.
- [ ] Repeating items use the Bootstrap grid.
- [ ] Every `@media` is inside the single `RESPONSIVE` block, and no breakpoint is opened twice.
- [ ] Headings, icons, images and media wrappers get `cursor: pointer` via the shared selector list.
- [ ] In every card/section with a single CTA, the image and heading link to the same `href` as the button (§6.1.1).
- [ ] Sliders use Owl Carousel; JS is in its own labelled, `.length`-guarded region.

**Content & quality**
- [ ] One `<h1>`; headings in order; every `<img>` has `alt`, `width`, `height`.
- [ ] Nav/footer links point to real files where they exist, `javascript:void(0)` otherwise.
- [ ] `<title>` and `<meta description>` are set for the page.
- [ ] No console errors, no 404s for CSS/JS/images (check the Network tab).
- [ ] No leftover placeholder text, commented-out code or `console.log`.

---

## 14. Shared common blocks (template for the next site)

These blocks recur on almost every page of the sites built from this guide. They already live in `style.css` (region `21. 404 + shared common blocks`, with their `@media` rules in `RESPONSIVE`). **Reuse them, copy them to the next site, change only the token values.**

> **Naming exception.** These keep their original camelCase names (no `rj-` prefix) because the same HTML/JS is reused across sites and pages. They are the **only** non-`rj-` classes allowed. Everything new follows §3.

### 14.1 Common section — text + image split (404, thank-you, simple content pages)

```html
<section class="commonSection">
    <div class="commonSectionInnerWrap">
        <div class="commonSectionTextWrapper">
            <h1 class="commonSectionHeading">Page Not Found</h1>
            <p class="commonPara">Short explanation.</p>
            <div class="commonSectionLinkWrap">
                <a class="featured-btn" href="./home.html">Back Home</a>
            </div>
        </div>
        <div class="commonSectionImageWrapper"><img src="…" alt="…" width="…" height="…"></div>
    </div>
</section>
```

| Class | Role | Notes |
|---|---|---|
| `.commonSection` | section shell | 80px bottom margin |
| `.commonSectionInnerWrap` | flex row, 120px gap | `max-width: calc(100% - 15%)`; ≤1200 full width with 40px gutters; ≤991 stacks **image first** (`column-reverse`) |
| `.commonSectionTextWrapper` / `.commonSectionImageWrapper` | the two 50% halves | image fills with `object-fit: cover` |
| `.commonSectionHeading` | 32px Sora, uppercase, 6.4px tracking, `--color-charcoal` | 29px / 3px tracking at ≤1440 |
| `.commonPara` | 16/24 Archivo 300, centred, `--color-ink` | 40px top/bottom margin (30px at ≤1440) |
| `.commonSectionLinkWrap` | centred button row, 20px gap | buttons stack (`column-reverse`) at ≤576 |
| `.featured-btn` | dark uppercase button | `--color-charcoal` fill, white text |
| `.thank-you-content-box` / `.thank-you-inner-box` | thank-you page text column (50%, max 480px, vertically centred) | |

### 14.2 Share modal (`#contactModal_email`)

`.shareModalHeading`; `.popup_input` + `.copyShareLinkBtn` inside `.copyLinkWrapper` (the copy-link row); `.shareIconsWrapper` > `.shareIconsContainer` > `.shareIcons` (50px round outline icons, Font Awesome `fa-brands` inside). The `#contactModal_email` rules strip the header border and cap the dialog at 450px. `.desktopShareBtn` shows above 991px and `.mobileShareBtn` (native share sheet) at ≤991 — exactly one is visible at any width.

### 14.3 "Special" banner (featured boat strip)

`.specialBanner` (charcoal band) > `.specialTag` (positioned wrapper) holding `.specialWhiteLine` (hairline) and `.specialTagText` (Inter, uppercase label centred over the line on a charcoal chip) · `.specialBoatTitle` (Sora 20/28 bold) · `.specailMoreDetailBtn` (muted "more details" link — **the spelling is intentional**, it matches the live HTML) with `.specialBtnArrow` (arrow that flips via `.rotate180Deg`) · `.specialShortDescpWrap` (hidden until toggled) > `.specialShortDescpText`.

### 14.4 Form error states

`.error_field` and `.req_check` give an invalid input or checkbox a 1px `--color-error-red` border; `input.error_field::placeholder` and `textarea.error_field::placeholder` turn the placeholder red. These carry `!important` on purpose — they must beat Bootstrap's `.form-control` border and focus styles. Script adds/removes the class; never style it by tag.

### 14.5 The rule for adding more

Whenever you add CSS for a block that will repeat across sites:

1. Put the base rules in `style.css` — in its page region, or in the `21. 404 + shared common blocks` region if it is not page-specific — as **one** block per selector (§4.2).
2. Colours come from `:root` tokens (§4.2). If a colour is new, add a token; don't paste a hex value.
3. Every `@media` goes in the matching breakpoint in `RESPONSIVE` (§7.2) — never open a second block for a breakpoint that exists.
4. Add the block to this section (markup + class table) so the next site starts from it.
