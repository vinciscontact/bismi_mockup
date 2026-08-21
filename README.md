# BISMI MANDI — Restaurant Website

_Designed by **TheVincis**._

A standalone, single-page showcase website for **BISMI MANDI** (Asli Yemeni Mandi),
Chromepet, Chennai. Pure HTML + CSS + vanilla JavaScript — no build step,
no dependencies, no backend.

## View it

Just open the file in any browser:

```
BISMI_Website/index.html
```

Or serve the folder (nicer for the embedded map & fonts):

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## What's inside

```
BISMI_Website/
├── index.html              # the whole site (semantic sections)
├── assets/
│   ├── css/styles.css      # crimson & cream theme, wave dividers, motion
│   ├── js/main.js          # all interactions (see below)
│   └── img/logo.png        # the restaurant logo
└── README.md
```

## Sections

- **Hero** — crest, welcome, tagline, live open/closed status, calls to action
- **About** — the story, plus a three-up photo row and an animated stat band
- **Menu** — filterable by course, by veg/non-veg, and by dish name
- **Experience** — the in-house QR dine-in ordering, explained
- **Gallery** — a visual spread with a full-screen lightbox
- **Reviews** — auto-rotating guest testimonials
- **Reserve** — a booking form that hands off to WhatsApp
- **Visit** — address, hours, contact, socials + an embedded Google Map
- **FAQ** — accordion of common questions
- **Footer** — brand, quick links, contact

## Interactions

All in `assets/js/main.js`, no libraries:

- Sticky nav that solidifies on scroll, mobile drawer, scroll-spy active link
- Reading-progress bar and a back-to-top button
- Reveal-on-scroll system (`data-reveal` with per-parent `data-stagger`)
- Hero background parallax and drifting spice specks
- Count-up stat numbers
- Menu filtering (course chips + diet toggle + search), with empty state
- Gallery lightbox: click, arrow keys, Escape, backdrop click
- Testimonial carousel: autoplay, dots, arrows, touch swipe, pause on hover
- Reservation form: client-side validation, then opens a pre-filled WhatsApp message
- FAQ accordion with correct `aria-expanded` / `aria-controls`
- QR card pointer tilt

Everything degrades gracefully under `prefers-reduced-motion: reduce`.

## Restaurant details

- **Name:** BISMI MANDI — Asli Yemeni Mandi
- **Cuisine:** Yemeni Mandi · Biryani · Arabian / Middle Eastern
- **Address:** 1, Tiruneermalai Main Road, Subbaraya Nagar, Chromepet, Chennai, Tamil Nadu 600044
- **Hours:** Open daily, 11:00 AM – 11:30 PM

## Before going live — replace the placeholders

**Contact details.** Phone, WhatsApp and email live in two places and must match:

1. `assets/js/main.js` — the `CONFIG` object at the top of the file. `whatsapp`
   is digits only with the country code and no `+` or spaces; it drives the
   reservation hand-off link.
2. `index.html` — the `tel:` and `mailto:` links (search for `+919876543210`
   and `hello@bismimandi.in`).

**Also placeholder:**

- Social links — the `#` hrefs in the "Visit" section and footer
- Guest reviews in the "Reviews" section are written examples, not real
  quotes. Replace them with genuine, attributable reviews before publishing.
- Menu items and prices — confirm against the real in-house menu
- The stat band figures (12+ hours, 30+ dishes, 100% halal, 7/7 days)
- Gallery and About images use Unsplash URLs — replace with real photos of the
  restaurant in `assets/img/`
- `og:image` is a relative path; make it an absolute URL once the domain is
  known, so link previews resolve

## Notes

- Fonts (Cormorant Garamond + Inter) load from Google Fonts; a serif/sans fallback
  is used if offline.
- The map uses Google Maps' keyless embed for the exact Chromepet address.
- `styles.css` and `main.js` are linked with a `?v=` query. Bump it whenever you
  edit them, otherwise browsers will serve the cached copy.
- Design language: crimson and cream with amber accents, organic wave dividers
  between bands, elegant serif headings, no emoji.

---

Designed by **TheVincis**.
