# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for the Maislabyrinth Freiamt (a corn maze attraction in Villmergen, Switzerland). Content is in German (Swiss German tone, no ß — use ss).

## Architecture

**Angular** (standalone components, signals) styled exclusively with **Tailwind CSS v4** utility classes in the HTML templates — no component CSS files. The only stylesheet is `src/styles.css`, which contains just the Tailwind import; do not add CSS files or `styleUrl`s.

- Pages live in `src/app/pages/` (one `.ts` + one `.html` per route); routes are defined in `src/app/app.routes.ts`.
- Header/nav/footer live in the root component (`src/app/app.html`).
- Static assets (images, `CNAME`) live in `public/`; `public/CNAME` must ship with the build output — it controls the custom domain (`maislabyrinth-freiamt.ch`).
- The Verlosung page (`/verlosung`, linked via QR code on-site) checks the solution word against a salted SHA-256 hash (see `verlosung.ts` for how to regenerate it) — the word itself must never appear in code, comments, or docs. Entries are submitted to a Google Apps Script web app (`apps-script/verlosung-backend.gs`, deployed manually, writes to a Google Sheet) which server-side verifies a reCAPTCHA v2 token and the solution word. The web-app URL and reCAPTCHA site key are constants in `verlosung.ts`. The flow unlocks automatically on the opening date (`VERLOSUNG_START`); appending `?test=1` to the URL overrides the date check for testing.
- Dashed-border placeholder blocks marked with `TODO` comments stand in for graphics (signs/sponsor boards) that haven't been delivered yet.

## Workflow

- `npm start` — dev server on :4200; `npm run build` — production build to `dist/maislabyrinth-freiamt/browser`.
- Deployment: pushes to `main` run `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages (Pages source must be set to "GitHub Actions"). The workflow copies `index.html` to `404.html` so SPA deep links like `/verlosung` work.
- Do not remove or rename `CNAME` / `public/CNAME` — they control the custom domain binding.
