# SEO entity enrichment — follow-ups for future review

Deferred items after the domain-deferred SEO entity work (committed on `main`). Review when ready for brand/domain or off-site growth work.

## Domain & canonical cutover

- [ ] Register / choose custom domain(s) for GBTech and/or Marshall Solutions
- [ ] Configure GitHub Pages custom domain + enforce HTTPS
- [ ] Sweep absolute URLs: hub/service/case/tool canonicals, OG/Twitter images, JSON-LD `@id` / `url`
- [ ] Update `BASE_URL` in [`.github/scripts/generate-sitemap.py`](../.github/scripts/generate-sitemap.py)
- [ ] Update sitemap URL and assertions in [`robots.txt`](../robots.txt) and [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)
- [ ] Redirect or keep `.github.io/GBTech` as secondary (avoid duplicate indexing)

## Entity & GBP (own brand)

- [ ] Create or claim Google Business Profile for Golden Bay Technologies / Marshall Solutions if not already live
- [ ] Add real GBP (and other social) URLs to JSON-LD `sameAs` — do not invent links
- [ ] Optional on-site “Also find us” block once profile URLs exist
- [ ] Align GBP categories, services, hours, and NAP with hub + service pages

## Brand demand (off-site)

- [ ] Grow branded search (people searching “GBTech” / “Marshall Solutions”) via short case videos, local community, email to past clients
- [ ] Diversify channels so revenue is not 100% organic search-dependent (YouTube, social, newsletter)
- [ ] Keep entity naming consistent across GBP, signatures, schema (`Golden Bay Technologies`, `GBTech`, `Marshall Solutions`)

## Content & measurement

- [ ] Add further informationally additive assets only when unique (more case studies with numbers, tools) — no generic how-to blog
- [ ] After domain cutover: Search Console + Bing ownership, submit new sitemap, verify GBP website URL
- [ ] Spot-check that `/sim/`, `/demo/`, staff apps remain Disallowed and out of sitemap

## Client deliveries

- [ ] Use [local-seo-entity-checklist.md](local-seo-entity-checklist.md) on each Marshall Solutions build
- [ ] Treat custom domain as a scheduled client step after NAP/schema/service URLs ship

## Explicitly still out of scope unless revisited

- Indexing demo SPAs (`/sim/`, `/demo/`)
- AI-generated generic article library
