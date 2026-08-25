# Ranger Rumble Guide

An unofficial, fan-made game guide for **Ratchet & Clank: Ranger Rumble**.

**[Open the live guide](https://tvh92.github.io/ranger-rumble-guide/)**

## Features

- Active hero roster with rarity, class, and movement speed
- Detailed hero profiles with weapon, gadget, melee, and Ultimate loadouts
- Level 1–10 hero, weapon, and gadget statistics in a combined table
- Short and expanded descriptions for heroes and loadout items
- Talent and mod details, including rarity and level statistics
- Hero artwork and selectable skin galleries
- Previous/next hero navigation and section shortcuts
- Responsive layouts for desktop and mobile
- Dark and light themes, with the selected theme saved in the browser

## Run locally

No installation or build step is required. Clone or download the repository, then open `index.html` in a modern browser.

The site is intentionally built as a static guide and can run directly from the filesystem. GitHub Pages publishes the same files from the `main` branch.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell, app version, and versioned asset references |
| `script.js` | Hero cards, detail windows, navigation, themes, and interactions |
| `styles.css` / `details.css` | Main-page and hero-detail styling |
| `data.json` / `data.js` | Structured game statistics in JSON and browser-ready formats |
| `guide-data.js` | Active hero order, profiles, and loadouts |
| `mods-data.js` | Talent and mod data displayed in hero profiles |
| `descriptions.js` | Hero and loadout descriptions |
| `skin-manifest.js` / `data/skin-status.js` | Available and enabled hero skins |
| `images/` | Hero, item, skin, logo, and interface artwork |
| `data/` | Source exports, reference lists, generated data, and validation tools |

## Updating the guide

1. Edit and review the relevant source or data files locally.
2. Increment the `app-version` in `index.html` and update every local `?v=` cache-busting reference to match.
3. Validate the data:

   ```powershell
   node data/validate-data.js
   ```

4. Check the diff, commit the scoped changes, and push `main` to GitHub.
5. Confirm the updated version on the live GitHub Pages site.

`data.json` is the standard JSON representation for external tools. The browser loads `data.js` so the guide also works when `index.html` is opened directly.

## Legal

This is an unofficial fan-made guide. Ranger Rumble is developed by Oh BiBi and published by Sony Interactive Entertainment. Ratchet & Clank was created by Insomniac Games and is owned by Sony Interactive Entertainment. All names, trademarks, and game assets belong to their respective owners.
