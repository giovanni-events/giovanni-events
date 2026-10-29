# Giovanni Events website (GIO001)

Client website for Giovanni Events, a small Chicago event company. I'm Lucas (Lukasz Milos), the designer. I lead design and aesthetic direction; you handle code and syntax. I know HTML and CSS at a foundational level, so explain anything beyond that briefly.

## How we work
- Build section by section, top of the homepage down. Stop after each section so I can review it in the browser before moving on.
- Match the design comp closely (`design/GIO001-Home_Page-D01.jpg`). Ask me about anything the comp doesn't settle (hover states, mobile layout, spacing) instead of guessing.
- Keep the code simple and readable: plain HTML templates and CSS, minimal JavaScript, no CSS framework.

## Stack
- **Site generator:** Eleventy (11ty) with Nunjucks templates. Content lives in Markdown/YAML files in the repo.
- **CMS:** Decap CMS at `/admin`, logging in with Netlify Identity + Git Gateway so the client doesn't need a GitHub account.
- **Hosting:** Netlify. **Domain:** Porkbun.
- **Handoff:** control of the accounts and hosting will be transferred to the client later. Keep everything (repo, Netlify site, Identity users) easy to hand over, and don't tie anything to my personal accounts beyond what's necessary.

## Homepage sections (from the comp)
1. **Nav** — fixed, not editable: Home, Events, Services, About, FAQ. Black bar, wide letter-spaced caps.
2. **Hero** — "Giovanni Events" + tagline over a background the client can switch between a photo and a video.
3. **Upcoming events** — carousel of event cards with side arrows.
4. **About** — intro text, services table, closing paragraph.
5. **Gallery** — mosaic grid of photos; clicking one opens an enlarged view with its caption.
6. **Newsletter** — heading, short copy, email field + Subscribe.
7. **Footer** — Privacy Notice and other links, copyright line.

## Content model (what the client edits in Decap)

### Events (folder collection, one file per event; each event also gets its own page)
- `start` — date and time (one datetime field)
- `end_time` — time
- Display text is **generated** from these: day of week ("SUNDAY"), month/day ("NOV 22"), time range ("11AM–3PM"). The client never types these.
- `venue_name`, `venue_address` (multi-line)
- `header_line_1` ("It's a"), `header_line_2` ("VIBE" — max 8 characters, it's set huge), `subhead` ("Drag Brunch")
- `short_description` (max 160 characters, shown on the homepage card)
- `body` — full description, rich text, shown on the event page
- `performers` — list of `{ name, role }`, where role is `Performer` or `Host`. Render performers first, then a small "HOSTED BY" label, then hosts. No hosts means no label.
- `poster` image + `poster_alt`
- `ticket_url`, `button_text` (default "Buy tickets")
- `published` toggle

Behavior:
- Carousel shows published events with `start` in the future, soonest first.
- Hide the arrows when there's only one event. If there are none, show a short "No upcoming events" message.
- Past events must drop off without anyone editing: filter at build time, and set up a Netlify build hook triggered daily (scheduled function) so the site rebuilds.

### Homepage (single file entry)
- **Hero:** `media_type` (Photo / Video), `hero_image`, `hero_video` (MP4, muted, autoplay, loop, `playsinline`; keep under ~10 MB — remind the client in the field hint), `poster_image` shown while video loads, `tagline`.
- **About:** `intro` (rich text), `services` — list of `{ title, description }`, 2–4 items, table columns adjust to the count — and `closing` (rich text).
- **Newsletter:** heading and copy.

### Gallery (single file entry with a list)
- Each photo: `image`, `caption` (shown in the enlarged view), `alt` (required), `size`, `focus` (center / top / bottom → `object-position`).
- Size presets on a 12-column CSS grid with `grid-auto-flow: dense`:
  - Small = 3 cols × 1 row
  - Wide = 6 × 1
  - Tall = 3 × 2
  - Large = 6 × 2
  - Feature = 9 × 2
- Order = the list order (drag to reorder in Decap).
- On phones, collapse to a 2-column grid.
- Lightbox: accessible (focus trap, Esc to close, arrow keys between photos), shows the caption.

## Design notes
- Colors (approximate, sampled from the comp — confirm with me):
  - Hero cyan `#00A3E8`
  - Event card dark teal `#0E4F6E`
  - Section mint `#D3E9E6`
  - Teal headings `#2E8F83`
  - Nav/footer black
  - Newsletter gray `#4A4F55`
- Fonts: I'll give you the exact families. The hero title is a thin geometric sans; section headings are a heavy, wide display face; body is a clean sans.
- Accessibility: real buttons and links, alt text everywhere, 4.5:1 text contrast, visible focus states.

## Reference
- Design comp: `design/GIO001-Home_Page-D01.jpg`
- CMS screen mockups (how the client's editing screens should feel): https://claude.ai/artifact/NjadKWjV596CBvwRso9dmc

## Open questions (ask me when we reach them)
- Exact fonts
- Newsletter provider (Mailchimp, Buttondown, or Netlify Forms)
- Ticketing platform for `ticket_url`
- Whether past events need a public archive page
- Content for Events, Services, About and FAQ pages beyond the homepage

## First task
Set up the Eleventy project, Decap config with the collections above, and sample content for one event. Then build the nav and hero, and stop for my review.
