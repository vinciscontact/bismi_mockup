# BISMI MANDI — Restaurant Website

A standalone, single-page showcase website for **BISMI MANDI** (Asli Yemeni Mandi),
Chromepet, Chennai. Pure HTML + CSS + a little vanilla JavaScript — no build step,
no dependencies, no backend.

## View it

Just open the file in any browser:

```
BISMI_Website/index.html
```

Or serve the folder (nicer for the embedded map & fonts):

```bash
# from inside BISMI_Website/
npx serve .          # then open the printed URL
# or
python -m http.server 8080   # then open http://localhost:8080
```

## What's inside

```
BISMI_Website/
├── index.html              # the whole site (semantic sections)
├── assets/
│   ├── css/styles.css      # premium ivory & charcoal theme
│   ├── js/main.js          # sticky nav, mobile menu, scroll-reveal
│   └── img/logo.png        # the restaurant logo
└── README.md
```

## Sections

- **Hero** — crest, welcome, tagline, calls to action
- **About** — the story of authentic Yemeni mandi
- **Signature plates** — guest-favourite menu with prices
- **Experience** — the in-house QR dine-in ordering, explained
- **Gallery** — a visual spread
- **Visit** — full address, hours, contact, socials + an embedded Google Map
- **Footer** — brand, quick links, contact

## Restaurant details

- **Name:** BISMI MANDI — Asli Yemeni Mandi
- **Cuisine:** Yemeni Mandi · Biryani · Arabian / Middle Eastern
- **Address:** 1, Tiruneermalai Main Road, Subbaraya Nagar, Chromepet, Chennai, Tamil Nadu 600044
- **Hours:** Open daily, 11:00 AM – 11:30 PM

## Before going live — replace the placeholders

These are sample values; swap them for the real ones in `index.html`:

- Phone: `+91 98765 43210` (search for `tel:+919876543210`)
- Email: `hello@bismimandi.in`
- Social links: the `#` hrefs in the "Visit" section and footer
- Gallery / about images currently use Unsplash URLs — replace with real photos of the
  restaurant in `assets/img/` for an authentic look.

## Notes

- Fonts (Cormorant Garamond + Inter) load from Google Fonts; a serif/sans fallback is used
  if offline.
- The map uses Google Maps' keyless embed for the exact Chromepet address.
- Design language matches the BISMI MANDI ordering system: ivory & charcoal, brass hairlines,
  elegant serif headings, no emoji.
