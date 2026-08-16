# Ranger Rumble game guide

Open `index.html` in any modern browser to use the site. No installation or server is required.

## What is included

- Searchable active-hero catalogue
- Clickable hero profiles with all level 1–10 statistics visible at once
- Weapon, gadget, melee and ultimate icons for every active hero
- Clickable skin gallery for each hero
- An archive for currently unused heroes, weapons and gadgets
- An **Edit guide** button for renaming heroes, weapons and gadgets directly in the site
- All provided artwork, copied into the `images` folder
- `data.json`: the original TXT stat exports converted into structured JSON

## Updating the game data later

The live website reads `data.js` so that it can also run by double-clicking `index.html`. `data.json` contains exactly the same information in standard JSON format and is the file to use for future tools or a hosted version.

Name edits made with **Edit guide** are saved locally in the browser you use. They do not alter the source data files, so they are safe to try and can be reset from the same editor. Power and Ultimate Fire Rate fields are intentionally hidden in the guide.
