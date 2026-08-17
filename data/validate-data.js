const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data.json'), 'utf8'));
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(projectRoot, 'guide-data.js'), 'utf8'), context);
const guide = context.window.RANGER_GUIDE;
const errors = [];
const warnings = [];
const normalize = value => String(value).replace(/[^a-z0-9]/gi, '').toLowerCase();
const find = (items, name) => items.find(item => normalize(item.name) === normalize(name));

for (const heroName of guide.heroOrder) {
  const config = guide.heroes[heroName];
  const hero = find(data.characters, heroName);
  const weapon = find(data.weapons, config.loadout[0]);
  const gadget = find(data.gadgets, config.loadout[4]) || find(data.weapons, config.loadout[4]);
  if (!hero) errors.push(`${heroName}: hero statistics are missing`);
  if (!weapon) errors.push(`${heroName}: weapon statistics are missing for ${config.loadout[0]}`);
  if (!gadget) warnings.push(`${heroName}: gadget statistics are not available for ${config.loadout[2]}`);
  for (const [label, item] of [['hero', hero], ['weapon', weapon], ['gadget', gadget]]) {
    if (!item?.levels?.length) continue;
    const levels = item.levels.filter(row => row.Level <= 10).map(row => row.Level);
    const expected = Array.from({length: 10}, (_, index) => index + 1);
    if (levels.length !== expected.length || levels.some((level, index) => level !== expected[index])) {
      errors.push(`${heroName}: ${label} levels must be ordered 1–10 (found ${levels.join(', ')})`);
    }
  }
}

if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${guide.heroOrder.length} heroes and their active loadouts.`);
}
