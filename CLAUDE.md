# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for the Maislabyrinth Villmergen (a corn maze attraction in Villmergen, Switzerland). Content is in German.

## Architecture

Static site hosted on **GitHub Pages** with a custom domain (`maislabyrinth-freiamt.ch`, configured via `CNAME`). The current `index.html` is a single-file placeholder ("Hier entsteht die Webseite…") with inline CSS — no build step, no dependencies, no JS framework.

## Workflow

- No build, lint, or test tooling. Edit `index.html` directly and preview by opening it in a browser (e.g. `open index.html`).
- Pushes to `main` deploy automatically via GitHub Pages.
- Do not remove or rename `CNAME` — it controls the custom domain binding.
