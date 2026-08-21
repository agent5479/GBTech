# SEO entity enrichment — follow-ups for future review

Deferred items after domain-deferred SEO entity work and **GBTech brand unity** (Marshall Solutions = websites/booking service line under Golden Bay Technologies).

Primary public entity: **Golden Bay Technologies (GBTech)**. Do not treat Marshall Solutions as a second LocalBusiness or separate GBP.

## Domain cutover (when hostname is secured)

Leave absolute URLs on `https://agent5479.github.io/GBTech` until the new origin is live.

- [ ] Register primary domain for GBTech (e.g. `gbtech.nz`) — one site origin, not a separate Marshall domain
- [ ] GitHub Pages: custom domain + enforce HTTPS; add `CNAME` if required
- [ ] Set `BASE_URL` in [`.github/scripts/generate-sitemap.py`](../.github/scripts/generate-sitemap.py)
- [ ] Update Sitemap line + header in [`robots.txt`](../robots.txt)
- [ ] Sweep absolute URLs: canonical, OG/Twitter `url`/`image`, JSON-LD `@id` / `url` / `image` on hubs, `services/`, `case-studies/`, `tools/`
- [ ] Update sitemap URL assertions in [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)
- [ ] Update demo `VITE_SITE_URL` in pages workflow if showcase URLs should follow the new origin
- [ ] Prefer apex (or www) as sole canonical; keep `.github.io/GBTech` redirect-only or noindex secondary
- [ ] Search Console + Bing ownership; submit new sitemap
- [ ] Point GBP website URL at the new origin

## Entity & GBP (own brand)

- [ ] Create or claim **one** Google Business Profile: **Golden Bay Technologies** (not a separate Marshall GBP)
- [ ] Categories/services: IT support primary; websites/booking as GBP services matching Marshall Solutions packages
- [ ] Add GBP (and other real social) URLs to JSON-LD `sameAs` — do not invent links
- [ ] Optional on-site “Also find us” block once profile URLs exist
- [ ] Align GBP hours, phone, email, Tākaka/Tasman NAP with site footers and schema

## Brand demand (off-site)

- [ ] Grow branded search for **GBTech** / **Golden Bay Technologies** (Marshall Solutions only as package name in ads/copy)
- [ ] Diversify channels: YouTube, local community, email to past clients
- [ ] Keep naming consistent: legal/Maps/schema = Golden Bay Technologies; package line = Marshall Solutions

## Content & measurement

- [ ] Further informationally additive assets only when unique — no generic how-to blog
- [ ] After domain cutover: verify indexing of service/case/tool URLs; demos stay Disallowed
- [ ] Spot-check competitor-free differentiation (diagnostics, recovery, owned sites/booking, direct contact)

## Client deliveries

- [ ] Use [local-seo-entity-checklist.md](local-seo-entity-checklist.md) on each client build
- [ ] Custom domain remains a scheduled client step after NAP/schema/service URLs ship

## Explicitly still out of scope unless revisited

- Indexing demo SPAs (`/sim/`, `/demo/`)
- AI-generated generic article library
- Naming local competitors on marketing pages
