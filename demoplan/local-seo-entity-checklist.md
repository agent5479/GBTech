# Local SEO entity checklist (GBTech / Marshall Solutions client builds)

Operational checklist for local business sites built by **Golden Bay Technologies (GBTech)**. Marshall Solutions is the **websites & booking package line**, not a second business entity.

Pair with [booking-platform-replication-guide.md](booking-platform-replication-guide.md) §7 (robots, sitemap, static prerender) and [seo-entity-follow-ups.md](seo-entity-follow-ups.md) for GBTech’s own domain/GBP cutover.

**Custom domain cutover is a later client step** — ship correct NAP, service URLs, and schema first; swap `BASE_URL` / canonicals when DNS is ready.

## Google Business Profile alignment

- [ ] One GBP entity matching the client’s legal/trading name (for GBTech own site: Golden Bay Technologies only)
- [ ] GBP primary category and secondary categories match on-site service language
- [ ] Every GBP service has a dedicated page (or clear section URL) with matching name and outcome copy
- [ ] Hours, phone, email, and address (NAP) identical on GBP, footer, contact page, and JSON-LD
- [ ] Service area / locations on the site mirror GBP service areas (one URL per location when multi-location)
- [ ] Package/product names (e.g. Marshall Solutions Essential) may appear as services, not as a second Maps business

## Information architecture

- [ ] One URL per high-intent service (not a single page listing everything)
- [ ] One URL per physical location when the client serves multiple towns/branches
- [ ] Hub pages link to those URLs; keep old anchors only as redirects or deep links
- [ ] Review-style language on service pages (how customers phrase needs: emergency, same-day, “in [town]”, outcomes)
- [ ] Primary brand chrome = client business name; product lines secondary

## Structured data (static / prerendered HTML)

- [ ] Single `LocalBusiness` (or subtype) with `@id`, `name`, `alternateName`, `telephone`, `email`, `address`, `geo` (`GeoCoordinates`)
- [ ] `areaServed` for towns/regions the client actually covers (include locality e.g. Tākaka when based there)
- [ ] `Service` nodes with `url` pointing at dedicated pages; `provider` references the business `@id`
- [ ] Product/package brands (e.g. Marshall Solutions) only on `Service` / `Brand` / `WebApplication`, not as a peer LocalBusiness
- [ ] `sameAs` only for real profiles (GBP, social) — do not invent URLs
- [ ] Optional: `Offer` / `OfferCatalog` with NZD prices when published on-site

## Crawl & hosting hygiene

- [ ] Public marketing routes prerendered or static HTML (no JS-only shell for indexable pages)
- [ ] `rel=canonical`, Open Graph, and Twitter tags on every indexable page; `og:site_name` = primary business
- [ ] `sitemap.xml` lists only indexable marketing URLs
- [ ] `robots.txt`: allow marketing; `Disallow` staff CRM, demos, and source trees
- [ ] Staff apps: `Disallow: /` and noindex — never in sitemap (see replication guide §7)

## Brand demand (beyond organic)

- [ ] Consistent legal/brand name across site, GBP, email signatures, and schema
- [ ] Client briefed that YouTube, email, and community channels reduce single-landlord risk
- [ ] Domain registration / HTTPS custom domain scheduled with the client (out of scope until they are ready)

## Handover note

After build: confirm Search Console / Bing ownership on the final host, submit sitemap, and verify GBP website URL points at the canonical homepage.
