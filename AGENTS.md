# Ranger Rumble Guide

## Project

- This repository is the authoritative website source.
- GitHub: `https://github.com/tvh92/ranger-rumble-guide`
- Live site: `https://tvh92.github.io/ranger-rumble-guide/`
- Raw game exports, descriptions, skin lists, and generated website data are under `data/` and the repository root.

## Workflow

1. Inspect the worktree and preserve unrelated user changes.
2. Make and test edits in a temporary sandbox copy before copying only verified files back here.
3. For visual changes, run the site locally and inspect the main page and relevant hero windows in both dark and light mode.
4. Run `data/validate-data.js` and `git diff --check` before committing.
5. Increment the version in `index.html` and every cache-busting `?v=` reference for each published change.
6. Commit only files related to the request, push, and confirm the deployed GitHub Pages version and affected UI.
7. Use the bundled workspace runtime paths for Node, Python, and Git. Port `8766` is suitable for the local static server.

## Data conventions

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
