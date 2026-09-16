(() => {
  const version = document.querySelector('meta[name="app-version"]')?.content || 'dev';
  const assetUrl = path => `${path}?v=${encodeURIComponent(version)}`;
  const themeToggle = document.querySelector('#theme-toggle');
  const table = document.querySelector('#modes-map-table');
  if (!table) return;

  const setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('rangerRumbleTheme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☾' : '☀';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };
  setTheme(localStorage.getItem('rangerRumbleTheme') || 'dark');
  themeToggle?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const modes = {
    boltRace: {name: 'Bolt Race', icon: 'images/mode and biome/ico_boltrush.png'},
    lastStand: {name: 'Last Stand', icon: 'images/mode and biome/ico_battleroyal.png'},
    totalRumble: {name: 'Total Rumble', icon: 'images/mode and biome/ico_elimination.png'},
    teamTotalRumble: {name: 'Team Total Rumble', icon: 'images/mode and biome/ico_teamdeathmatch.png'},
    mobRush: {name: 'Mob Rush', icon: 'images/mode and biome/ico_squadsiege.png'},
    blastBall: {name: 'Blast Ball', icon: 'images/mode and biome/ico_blastball.png'},
    zoneControl: {name: 'Zone Control', icon: 'images/mode and biome/ico_KOTH.png'}
  };

  const locations = [
    {
      name: 'Corson V', icon: 'images/mode and biome/ico_planet_CorsonV.png',
      maps: {
        standard: ['Qwark Tower', 'Transit Hub'],
        rumble: ['Shopping District', 'Train Station'],
        mob: ['Rangers Promenade'],
        blast: ['Grand Stadium'],
        zone: ['Qwark Tower', 'Train Station', 'Transit Hub']
      }
    },
    {
      name: 'Torren IV', icon: 'images/mode and biome/ico_planet_TorrenIV.png',
      maps: {
        standard: ['Dismantling Centre', 'Little Junktown'],
        rumble: ['The Foundry', 'Molonoth Gulch'],
        mob: ['Raritanium Excavation'],
        blast: ['Clash of the Titans'],
        zone: []
      }
    },
    {
      name: 'Sargasso', icon: 'images/mode and biome/ico_planet_Sargasso.png',
      maps: {
        standard: ['Biting Swamp'],
        rumble: ['Gelatonium Factory'],
        mob: ['Grunthor Den'],
        blast: ['Sunken Field'],
        zone: ['Biting Swamp']
      }
    },
    {
      name: 'Ardolis', icon: 'images/mode and biome/ico_planet_Ardolis.png',
      maps: {
        standard: ['Black Market'],
        rumble: ['Pirate Hideout'],
        mob: [],
        blast: [],
        zone: []
      }
    }
  ];

  const image = (mode, className = '') => `<img class="${className}" src="${assetUrl(mode.icon)}" alt="" loading="lazy">`;
  const modeEntry = mode => `<div class="mode-entry">${image(mode)}<span>${mode.name}</span></div>`;
  const pairedHeading = (...modeKeys) => `<div class="mode-heading"><div class="mode-heading-labels">${modeKeys.map(key => modeEntry(modes[key])).join('')}</div></div>`;
  const singleHeading = modeKey => `<div class="mode-heading single-mode-heading">${image(modes[modeKey])}<span class="mode-entry-label">${modes[modeKey].name}</span></div>`;
  const mapList = maps => maps.length
    ? `<ul class="map-list">${maps.map(map => `<li>${map}</li>`).join('')}</ul>`
    : '<span class="empty-map">—</span>';
  const locationCell = location => `<th scope="row" class="location-cell"><span class="location-heading">${image({icon: location.icon})}<span>${location.name}</span></span></th>`;

  table.innerHTML = `
    <caption>Maps per location and mode</caption>
    <thead>
      <tr>
        <th scope="col">Location</th>
        <th scope="col">${pairedHeading('boltRace', 'lastStand')}</th>
        <th scope="col">${pairedHeading('totalRumble', 'teamTotalRumble')}</th>
        <th scope="col" class="zone-control-head">${singleHeading('zoneControl')}</th>
        <th scope="col">${singleHeading('mobRush')}</th>
        <th scope="col">${singleHeading('blastBall')}</th>
      </tr>
    </thead>
    <tbody>
      ${locations.map(location => `<tr>${locationCell(location)}<td>${mapList(location.maps.standard)}</td><td>${mapList(location.maps.rumble)}</td><td class="zone-control-cell">${mapList(location.maps.zone)}</td><td>${mapList(location.maps.mob)}</td><td>${mapList(location.maps.blast)}</td></tr>`).join('')}
    </tbody>`;
})();
