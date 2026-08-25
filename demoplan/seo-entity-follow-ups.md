# SEO entity enrichment — follow-ups for future review

Primary public entity: **Golden Bay Technologies (GBTech)** at **https://gbtech.co.nz**. Marshall Solutions = websites/booking service line (not a second LocalBusiness).

## Domain cutover

- [x] Primary domain: `gbtech.co.nz` (CNAME + SEO sweep to apex)
- [x] `BASE_URL` / sitemap / robots / CI / absolute canonicals & JSON-LD / demo `VITE_SITE_URL`
- [ ] Confirm GitHub Pages “Enforce HTTPS” stays on after DNS settles
- [ ] Prefer apex as sole canonical; ensure `.github.io/GBTech` redirects to `gbtech.co.nz` (GitHub Pages usually does this when custom domain is set)
- [ ] Search Console + Bing ownership on `gbtech.co.nz`; submit `https://gbtech.co.nz/sitemap.xml`
- [ ] Re-verify Bing with auth file at `https://gbtech.co.nz/BingSiteAuth.xml` if needed after domain change
- [ ] Point GBP website URL at `https://gbtech.co.nz/`

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

## AI search / GEO

Cursor checklist: [`.cursor/rules/seo-geo.mdc`](../.cursor/rules/seo-geo.mdc). Priority: crawler access → render/index → schema → llms.txt → content → off-site/measure.

- [x] Hand-written `/llms.txt` (brand + key indexable URLs; demos called out as non-citation sources)
- [x] Explicit AI bot allows in `robots.txt` (GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, ClaudeBot, PerplexityBot, Perplexity-User, Applebot-Extended)
- [ ] Confirm GitHub Pages **Enforce HTTPS** (repo Settings → Pages) — `http://gbtech.co.nz/` has been observed serving 200 without redirect
- [ ] Periodic AI citation spot-checks (ChatGPT, Perplexity, Gemini, Claude) for real target prompts; log which pages/competitors get cited
- Note: GitHub Pages has no server access logs for AI-bot crawl verification; rely on robots allows + citation sampling

## Content & measurement

- [ ] Further informationally additive assets only when unique — no generic how-to blog
- [ ] Verify indexing of service/case/tool URLs on `gbtech.co.nz`; demos stay Disallowed
- [ ] Spot-check competitor-free differentiation (diagnostics, recovery, owned sites/booking, direct contact)

## Client deliveries

- [ ] Use [local-seo-entity-checklist.md](local-seo-entity-checklist.md) on each client build

## Explicitly still out of scope unless revisited

- Indexing demo SPAs (`/sim/`, `/demo/`)
- AI-generated generic article library
- Naming local competitors on marketing pages
