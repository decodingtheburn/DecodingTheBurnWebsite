# PLAN: French Translation (i18n) for decodingtheburn.com

> Status: PLANNING (no code written yet). Approve this plan, then run `/create` to implement.
> Created: 2026-10-06

---

## 1. Overview

**What:** Publish a full French version of post #1 (`1-my-bms-18-months-carnivore-experiment.mdx`) under a `/fr/` subfolder. That includes the prose, all 14 embedded interactive components, the blog layout chrome, header, footer, glossary tooltips and an EN/FR language switcher.

**Why this architecture:** You will eventually translate the whole website. So the French post is built on a foundation that scales: one config, one place for every translated string, type-checked so missing translations break the build instead of quietly showing English, and a script that flags French pages that fell behind their English source.

**Project type:** WEB (Astro 5 static site, MDX, Firebase Hosting). Primary agent: `frontend-specialist`.

---

## 2. Decisions Locked In (from Socratic Gate)

| Topic | Decision |
|---|---|
| Post | #1 "My BMS 18-Months Carnivore Experiment" |
| French variant | **Neutral international French** that reads naturally in Quebec and France. Formal "vous". No Quebec-only or France-only idioms. Metric units (already the case). |
| URLs | Translated slugs: `/fr/blog/1-mon-experience-carnivore-18-mois/`. English URLs stay **exactly as they are** (no `/en/` prefix, no broken links, existing redirects untouched). |
| Linking EN/FR | French frontmatter field `translationOf: "1-my-bms-18-months-carnivore-experiment"`. That one field drives hreflang tags, the language switcher and the outdated-translation check. |
| BMS terminology | Primary: **syndrome de la bouche brûlante (SBB)**. Every French post opens with an "also known as" line for searchability (see section 5). |
| Scope v1 | Full post + 14 components + layout + header/footer + glossary + language switcher. |
| YouTube video | Stays in English. A one-line French note sits above it ("Vidéo en anglais, sous-titres disponibles"). |
| Audio reader | Switches to a French voice (prefers `fr-CA`, then `fr-FR`, then any `fr-*`) and gets French UI labels. |
| Backup | Mandatory Task 0 before any file changes (git tag + full folder copy). |

---

## 3. Success Criteria

1. `https://decodingtheburn.com/fr/blog/1-mon-experience-carnivore-18-mois/` renders fully in French, with no English UI text except the YouTube video and proper nouns.
2. Every English URL renders byte-for-byte equivalent content to today (no regressions).
3. Both versions have reciprocal `<link rel="alternate" hreflang="en|fr|x-default">` tags, `<html lang="fr">` and `og:locale="fr_CA"` with `og:locale:alternate`.
4. The language switcher on the English post goes to the French post and back. On pages with no French version it is hidden (no 404 links).
5. `npm run build` passes. The build **fails** if a French dictionary is missing a key that English has (TypeScript `satisfies`).
6. French posts never show up in the English blog index, RSS, prev/next navigation or `for-professionals` listings, and vice versa.
7. Sitemap lists the French URL with hreflang alternates.
8. Anti-widow protocol holds for the French copy: no em-dashes, final 2-3 words bound with `&nbsp;`, subheadlines on 2 balanced lines. French text runs about 15-20% longer, so containers get checked.

---

## 4. Tech Stack and Rationale

| Choice | Rationale |
|---|---|
| **Astro native i18n routing** (`i18n` in `astro.config.mjs`, `prefixDefaultLocale: false`) | Built in, no dependency. Gives `Astro.currentLocale` to every component, so the 14 MDX components detect French **without prop drilling** through MDX. |
| **Single `blog` collection, French in `src/content/blog/fr/` subfolder** | This is the subfolder you asked for. English entry IDs stay unchanged, so all existing redirects, viewer routes and links keep working. Adding Spanish later means adding `src/content/blog/es/`. |
| **Typed TS dictionaries in `src/i18n/`** (no i18n library) | Zero runtime cost on a static site. `fr satisfies typeof en` gives build-time detection of missing translations. A translator (human or AI) works through one folder. |
| **One dictionary file per heavy component** | Each of the 14 post components has 200-900 lines with a lot of text. One giant JSON file would be unmaintainable, so each component gets its own `en`/`fr` file. |
| **Firebase Hosting unchanged** | `cleanUrls` and `trailingSlash: true` already serve `/fr/...` correctly. Only a `/fr/1` short-link redirect gets added. |

---

## 5. French Terminology Standard (applies to every future French page)

Opening line of every French BMS post, directly under the title area:

> Le syndrome de la bouche brûlante (SBB), aussi appelé stomatodynie, glossodynie (lorsque la douleur touche surtout la langue) ou *burning mouth syndrome* (BMS) en anglais.

| English | French (primary) | Notes |
|---|---|---|
| Burning Mouth Syndrome (BMS) | syndrome de la bouche brûlante (SBB) | Term used by health authorities in both Quebec and France. |
| (synonyms) | stomatodynie, glossodynie, stomatopyrosis | Go in the intro line, `description`, and the `tags` / meta keywords. |
| carnivore diet | régime carnivore | |
| flare | poussée (de douleur) | |
| dentinal tubules | tubules dentinaires | |
| gum recession | récession gingivale | |
| ASIC receptors | récepteurs ASIC (canaux ioniques sensibles à l'acide) | |

This table becomes `src/i18n/GLOSSARY-FR.md`, the translation style guide reused for every future page.

**French typography rules (international-safe):**
- `&nbsp;` before `:` and inside « guillemets ». Before `; ! ?` a thin non-breaking space (`&#8239;`), which France expects and Quebec tolerates.
- Anti-widow protocol still applies: bind the last 2-3 words with `&nbsp;`, **no em-dashes** (French dialogue dashes count too).

---

## 6. File Structure

```
apps/decodingtheburn.com/
├── astro.config.mjs                    [MODIFY] add i18n block + sitemap i18n option
├── firebase.json                       [MODIFY] add /fr/1 redirect
├── docs/PLAN-french-i18n.md            (this file)
├── scripts/
│   └── i18n-check.mjs                  [NEW] reports missing / outdated translations
└── src/
    ├── content.config.ts               [MODIFY] add translationOf, translatedAt fields
    ├── content/blog/
    │   ├── *.md(x)                     (English, unchanged)
    │   └── fr/
    │       └── 1-mon-experience-carnivore-18-mois.mdx   [NEW]
    ├── i18n/                           [NEW] single home for ALL translations
    │   ├── config.ts                   locales, default, labels, og locales
    │   ├── utils.ts                    getLang(), t(), localizePath(), getAlternates()
    │   ├── GLOSSARY-FR.md              terminology + style guide
    │   ├── ui/
    │   │   ├── en.ts                   header, footer, layout, TOC, audio reader, CTA, disclaimer, author box
    │   │   └── fr.ts                   satisfies typeof en
    │   ├── glossary/
    │   │   └── fr.ts                   French version of the 21 GLOSSARY_TERMS entries
    │   └── components/                 one file per heavy component: { en, fr }
    │       ├── Carnivore18MonthTimeline.ts
    │       ├── InteractiveProgressionChart.ts
    │       ├── DietFoodCards.ts
    │       ├── OralAcidFermentationDiagram.ts
    │       ├── TubuleRecessionDiagram.ts
    │       ├── AsicIonChannelDiagram.ts
    │       ├── TrigeminalRadiatingPainDiagram.ts
    │       ├── AcidFoodScale.ts
    │       ├── VegetableSugarScale.ts
    │       ├── CarnivoreDoctorsSection.ts
    │       ├── SupplementsAccordion.ts
    │       ├── KeyDiscoveriesCards.ts
    │       ├── QuestionsSection.ts
    │       ├── ShareStoryCTA.ts
    │       └── CardinalNetworkDiagram.ts
    ├── components/
    │   ├── LanguageSwitcher.astro      [NEW]
    │   ├── BaseHead.astro              [MODIFY] hreflang, og:locale, lang-aware title/desc
    │   ├── Header.astro / Footer.astro [MODIFY] strings via t(), links via localizePath()
    │   ├── AudioReader.astro           [MODIFY] French voice + labels
    │   ├── GlossaryTooltip.astro       [MODIFY] load glossary by locale
    │   └── (14 post components)        [MODIFY] read strings from i18n/components/*
    ├── layouts/BlogPost.astro          [MODIFY] <html lang>, strings, locale-filtered prev/next
    ├── utils/postUtils.ts              [MODIFY] add getPosts(lang), getTranslation(post)
    └── pages/
        ├── blog/[...slug].astro        [MODIFY] English only (exclude fr/)
        ├── rss.xml.js, sitemap.xml.js, drafts.astro, for-professionals.astro  [MODIFY] use getPosts('en')
        └── fr/
            └── blog/[...slug].astro    [NEW] French post route
```

---

## 7. Core Patterns (how translation works, for future maintenance)

**A. Components detect language automatically.** They need no props:
```
const lang = getLang(Astro.currentLocale);      // 'en' | 'fr'
const t = dict[lang];                           // from src/i18n/components/X.ts
```
English output stays identical because the `en` dictionary holds the exact current strings.

**B. Client-side scripts** (charts and interactive diagrams that build labels in JS) receive their strings through a `data-i18n='{json}'` attribute or `define:vars`. No hardcoded English inside `<script>`.

**C. One collection query helper.** Every page calls `getPosts(lang)` from `postUtils.ts` instead of raw `getCollection('blog')`, so French never leaks into English listings. There are 5 call sites today.

**D. Linking translations.** French frontmatter:
```yaml
translationOf: "1-my-bms-18-months-carnivore-experiment"
translatedAt: 2026-10-06
```
`getTranslation(post)` resolves both directions for hreflang and the switcher.

**E. Translating a future page (the repeatable recipe):**
1. Blog post: copy the English `.mdx` to `src/content/blog/fr/<french-slug>.mdx`, add `translationOf` + `translatedAt`, translate it, and add any new component dictionaries.
2. Static page (e.g. `/about`): move the page body into `src/views/About.astro` using `t()`, then create thin route files `src/pages/about.astro` and `src/pages/fr/a-propos.astro`.
3. Run `node scripts/i18n-check.mjs` and `npm run build`.

---

## 8. Task Breakdown

| ID | Task | Agent / Skill | Depends | INPUT → OUTPUT → VERIFY |
|---|---|---|---|---|
| **T0** | **Backup** | `devops-engineer` / deployment-procedures | none | Clean repo → `git tag pre-i18n-fr` + folder copy to `apps/backup_decodingtheburn_2026-10-06_pre-i18n/` (without node_modules, dist) → tag exists, copy builds. Rollback: `git reset --hard pre-i18n-fr`. |
| T1 | Astro i18n config + Firebase redirect | `frontend-specialist` / i18n-localization | T0 | config → `i18n` block, sitemap `i18n` option, `/fr/1` redirect → `npm run build` passes, English `dist/` file list unchanged. |
| T2 | `src/i18n/` scaffold: config, utils, `ui/en.ts` (extract current strings verbatim) | `frontend-specialist` / i18n-localization, clean-code | T1 | hardcoded strings → typed dictionaries → `tsc` passes. |
| T3 | Content schema + `postUtils` (`getPosts`, `getTranslation`) + update 5 `getCollection` call sites | `frontend-specialist` / clean-code | T1 | → English index, RSS, prev/next unchanged → diff of built English HTML shows no content changes. |
| T4 | Wire Header, Footer, BaseHead, BlogPost, TOC, AudioReader, AuthorBox, MedicalDisclaimer, GlossaryTooltip to `t()` | `frontend-specialist` / frontend-design | T2, T3 | → English renders identically → visual check of the English post. |
| T5 | Extract strings from the 14 post components + CardinalNetworkDiagram into `i18n/components/*.ts` (`en` only) | `frontend-specialist` / i18n-localization | T2 | → English renders identically → screenshot comparison of the English post before and after. |
| T6 | `LanguageSwitcher.astro` + hreflang/og:locale in BaseHead | `frontend-specialist` / frontend-design, seo-fundamentals | T3, T4 | → switcher sits in the header (a plain text link "Français" / "English", **not a pill badge**) → hidden when no translation exists. |
| T7 | Write `GLOSSARY-FR.md` style guide + `glossary/fr.ts` (21 terms) | `frontend-specialist` / bms-copywriting-framework, health-content-compliance | T2 | → terminology locked → reviewed against section 5. |
| T8 | Translate `ui/fr.ts` + 15 component `fr` dictionaries | `frontend-specialist` / i18n-localization | T5, T7 | → `fr satisfies typeof en` → build fails on any missing key. |
| T9 | Translate post #1 prose → `src/content/blog/fr/1-mon-experience-carnivore-18-mois.mdx` (French title, description with synonyms, "aussi appelé" intro, video note) | `frontend-specialist` / bms-copywriting-framework, health-content-compliance | T7 | → full French MDX → anti-widow + no-em-dash grep passes. |
| T10 | French route `src/pages/fr/blog/[...slug].astro` | `frontend-specialist` | T3, T9 | → `/fr/blog/1-mon-experience-carnivore-18-mois/` builds. |
| T11 | `scripts/i18n-check.mjs`: lists English posts without French, and French posts whose English source was modified (git date) after `translatedAt` | `frontend-specialist` / clean-code | T3 | → script prints a report → run it and confirm post #1 reports "up to date". |
| T12 | French layout QA: longer text, widows, 2-line subheadlines, mobile | `frontend-specialist` / web-design-guidelines | T8-T10 | → screenshots at 375 / 768 / 1440 px → no overflow, no widows. |

Parallel-safe once dependencies are met: T7 with T3-T5, and T11 with T6-T10.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Extracting strings changes English output | T5 builds an English-only `dist/` before and after and diffs the HTML text content. |
| JS-generated labels left in English | Grep `<script>` blocks for English words after T8, then click through the French page manually. |
| Medical translation errors | Terminology locked in `GLOSSARY-FR.md`. You review the French text before it goes live (it can stay `draft: true` until you approve). |
| Duplicate-content SEO | Reciprocal hreflang + `x-default` → English. |
| Custom `sitemap.xml.js` and `@astrojs/sitemap` both present | T3 updates both. Verify the French URL appears exactly once. |

---

## 10. Phase X: Verification Checklist

- [ ] T0 backup tag and folder copy exist
- [ ] `npm run build` passes with no warnings
- [ ] English pages: before/after HTML diff shows no content regressions
- [ ] French post: zero English UI strings (except video and proper nouns)
- [ ] hreflang reciprocal on EN + FR, `<html lang="fr">`, `og:locale`
- [ ] Switcher works both ways and is hidden on untranslated pages
- [ ] French excluded from English index, RSS, prev/next; included in sitemap
- [ ] Audio reader picks a French voice
- [ ] `node scripts/i18n-check.mjs` runs clean
- [ ] Grep: no `—` and no `--` in new copy; final words bound with `&nbsp;`
- [ ] `python .agent/scripts/checklist.py .` passes
- [ ] Playwright screenshots at 375 / 768 / 1440 px reviewed
- [ ] You approve the French copy, then `draft: false` → deploy
