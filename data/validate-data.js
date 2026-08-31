const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data.json'), 'utf8'));
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'guide-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'descriptions.js'), 'utf8'), context);
const guide = context.window.RANGER_GUIDE;
const descriptions = context.window.RUMBLE_DESCRIPTIONS;
const errors = [];
const warnings = [];
const normalize = value => String(value).replace(/[^a-z0-9]/gi, '').toLowerCase();
const find = (items, name) => items.find(item => normalize(item.name) === normalize(name));
const descriptionEntry = (category, name, hero = '') => {
  const source = descriptions?.[category] || {};
  const lookup = category === 'melee' ? hero : (guide.descriptionAliases?.[category]?.[name] || name);
  const key = Object.keys(source).find(entry => normalize(entry) === normalize(lookup));
  return key ? source[key] : null;
};

for (const heroName of guide.heroOrder) {
  const config = guide.heroes[heroName];
  const hero = find(data.characters, heroName);
  const weapon = find(data.weapons, config.weaponStats || config.loadout[0]);
  const gadget = find(data.gadgets, config.loadout[4]);
  if (!hero) errors.push(`${heroName}: hero statistics are missing`);
  if (!weapon) errors.push(`${heroName}: weapon statistics are missing for ${config.loadout[0]}`);
  if (!gadget) errors.push(`${heroName}: gadget statistics are missing for ${config.loadout[2]}`);
  for (const [category, name] of [['heroes', heroName], ['weapons', config.loadout[0]], ['gadgets', config.loadout[2]], ['melee', config.loadout[5]], ['ultimates', config.loadout[7]]]) {
    if (!descriptionEntry(category, name, heroName)?.short) errors.push(`${heroName}: ${category} description is missing for ${name}`);
  }
  for (const [label, item] of [['hero', hero], ['weapon', weapon], ['gadget', gadget]]) {
    if (!item?.levels?.length) continue;
    const levels = item.levels.filter(row => row.Level <= 10).map(row => row.Level);
    const expected = Array.from({length: 10}, (_, index) => index + 1);
    if (levels.length !== expected.length || levels.some((level, index) => level !== expected[index])) {
      errors.push(`${heroName}: ${label} levels must be ordered 1–10 (found ${levels.join(', ')})`);
    }
  }
}

for (const [category, entries] of Object.entries(descriptions || {})) {
  for (const [name, entry] of Object.entries(entries)) {
    for (const field of ['short', 'full']) {
      if (/<[^>]+>/.test(entry?.[field] || '')) errors.push(`descriptions.js: ${category}/${name} ${field} contains raw HTML`);
    }
  }
}

const indexSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const scriptSource = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');
const appVersion = indexSource.match(/<meta name="app-version" content="([^"]+)">/)?.[1];
if (!appVersion) {
  errors.push('index.html: app-version meta tag is missing');
} else {
  const localAssets = [...indexSource.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map(match => match[1])
    .filter(url => !/^(?:#|https?:|data:)/i.test(url));
  for (const url of localAssets) {
    const [assetPath, query = ''] = url.split('?');
    const version = new URLSearchParams(query).get('v');
    if (version !== appVersion) errors.push(`index.html: ${url} must use ?v=${appVersion}`);
    const diskPath = path.join(projectRoot, ...decodeURIComponent(assetPath).split('/'));
    if (!fs.existsSync(diskPath)) errors.push(`index.html: referenced asset is missing: ${assetPath}`);
  }
}

const rawRuntimeAssets = scriptSource.split(/\r?\n/)
  .map((line, index) => ({line, number: index + 1}))
  .filter(entry => /["'`]images\//.test(entry.line));
for (const entry of rawRuntimeAssets) {
  errors.push(`script.js:${entry.number}: route runtime image paths through assetUrl()`);
}
if (!/const assetUrl = path =>/.test(scriptSource)) errors.push('script.js: centralized assetUrl() helper is missing');

if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${guide.heroOrder.length} heroes, active loadouts, and versioned local assets.`);
}
