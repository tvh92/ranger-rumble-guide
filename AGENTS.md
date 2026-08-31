# Ranger Rumble Guide

## Project

- This repository is the authoritative website source.
- GitHub: `https://github.com/tvh92/ranger-rumble-guide`
- Live site: `https://tvh92.github.io/ranger-rumble-guide/`
- Raw game exports, descriptions, skin lists, and generated website data are under `data/` and the repository root.

## Workflow

1. Inspect the worktree and preserve unrelated user changes.
2. Make and test edits in a temporary sandbox copy. Exclude `.git`, then copy only verified, scoped files back here.
3. For major visual changes, or when the user requests it, run the site locally and inspect the main page and relevant hero windows in both dark and light mode.
4. Run `data/validate-data.js` and `git diff --check` before committing.
5. Increment the version in `index.html` and every cache-busting `?v=` reference for each published change.
6. Commit only files related to the request, push, and confirm the deployed GitHub Pages version and affected UI.
7. Use the bundled workspace runtime paths for Node, Python, and Git. Use an available localhost port for the temporary static server; do not assume a fixed port is free.

When the user requests website work, that request authorizes implementing, validating, committing, and pushing the scoped change to this repository's configured GitHub remote. Do not ask for separate commit or push approval. If the user explicitly asks only to commit, do not push until requested.

## Working tree conventions

- Modified files under `data/` may be intentional generated or exported data. Inspect and summarize them before treating them as unrelated changes.
- Never discard pre-existing changes. If the user confirms they are intentional, commit them separately from UI or website changes unless asked otherwise.
- Preserve spacing in fixed-width text exports; trailing whitespace may be intentional for aligned columns.

## Data conventions

- `data/update_site_data.py` previews or regenerates the text-exported site data (`data.json`, `data.js`, `descriptions.js`, `mods-data.js`, `guide-data.js`, `season-data.js`, `data/skin-status.js`, and `index.html`). It is preview-only unless `--write` is supplied. Keep its curated stat and talent-presentation overrides aligned with intentional corrections in the generated website data.
- Pass the visible game version with `--game-version`. Use `--bump-site-version` or `--site-version` separately for the `app-version` and every local cache-busting `?v=` reference.
- The generator reads the season number from the `Season N` heading in `data/SeasonPassContent.txt` and calculates the season dates automatically.
- Active loadouts and internal names are documented in `data/active-hero-loadouts.txt`.
- Only skins listed under `Used:` in `data/hero-skins-status.txt` should appear; retain `Unused:` entries as reference.
- Descriptions come from `data/descriptions/` and are displayed in the hero/item description panel.
- Do not display missing or placeholder values.
- Zed's Tank statistics belong to Tank Formation. Tank Formation is the only Ultimate that keeps Fire rate per level.
- Whirling Blades belongs to Lil' Ann.
- Sparky's Big Boom uses its special remote/icon handling.

## UI conventions

- Dark mode is the default; light mode must remain visibly lighter and readable.
- Hero cards and windows use the game's teal, green, and orange visual language.
- Rarity colors: Common `#3C6FFA`, Rare `#ED00EE`, Epic `#F38A0E`.
- Use `Lil' Ann` consistently.
- Hero windows close by X or outside click and support previous/next navigation.
- Narrow hero windows must remain vertically scrollable.
- The description panel stays at short-description height unless expanded. Hover previews must not flicker.
- Selected skins use a green border without a checkmark. Skin previews use a normalized frame, and wrapped rows should distribute evenly.
- Combat statistics use one combined table. Constant values belong in separate stat panels, and table headers should remain free of icons.
- Reuse existing PNG artwork and UI assets. Keep skin files inside their hero subfolders.

## Legal text

Keep the version and generic fan-site disclaimer. Ranger Rumble is developed by Oh BiBi and published by Sony Interactive Entertainment. Ratchet & Clank was created by Insomniac Games and is owned by Sony Interactive Entertainment. Names, trademarks, and game assets belong to their respective owners.
