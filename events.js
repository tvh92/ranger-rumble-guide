(() => {
  const version = document.querySelector('meta[name="app-version"]')?.content || 'dev';
  const assetUrl = path => `${path}?v=${encodeURIComponent(version)}`;
  const themeToggle = document.querySelector('#theme-toggle');
  const grid = document.querySelector('#events-grid');
  if (!grid) return;

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

  const qredits = amount => `${amount.toLocaleString('en-US')} Qredits`;
  const lootbox = rarity => `<span class="rarity rarity-${rarity.toLowerCase()}">${rarity}</span> Reebo lootbox`;

  // Sourced from EventsEconomy.asset and the English localisation file (game version 1.10.3).
  // Rewards that the extracted data does not identify are left out.
  const events = [
    {
      name: 'Rescue Mopz',
      kind: 'Mission event',
      duration: '14 days',
      art: 'images/events/RescueMopz_Illustration.png',
      icon: 'images/events/ico_SaveMopz.png',
      summary: 'Mopz needs your help to load into the simulation. Complete missions across four days to fix the glitch.',
      lede: 'Complete event missions to fix the simulation glitch and save the legendary Mopz from deletion!',
      rules: [
        'Each day unlocks its own set of missions, so come back every day to continue.',
        'Reward track milestones unlock at 2, 7, 13 and 20 points.',
        'The event runs for 14 days.'
      ],
      days: [
        {title: 'Day 1', missions: [
          {text: 'Play 1 game'},
          {text: 'Play 7 games', reward: qredits(200)},
          {text: 'Upgrade a Hero 3 times', reward: qredits(200)},
          {text: 'Reach 100 medals', reward: lootbox('Common')},
          {text: 'Play 400 games in one game mode', reward: lootbox('Common')}
        ]},
        {title: 'Day 2', missions: [
          {text: 'Play 2 games in one game mode'},
          {text: 'Win 3 battles'},
          {text: 'Upgrade a Hero 5 times', reward: qredits(300)},
          {text: 'Deal 500 damage', reward: lootbox('Common')},
          {text: 'Deal 500 damage', reward: lootbox('Common')}
        ]},
        {title: 'Day 3', missions: [
          {text: 'Play 2 games in one game mode', reward: lootbox('Common')},
          {text: 'Play 2 games in another game mode', reward: lootbox('Common')},
          {text: 'Upgrade a Hero 7 times', reward: qredits(400)},
          {text: 'Reach 400 medals'},
          {text: 'Deal 500 damage'}
        ]},
        {title: 'Day 4', missions: [
          {text: 'Play 2 games in one game mode', reward: qredits(500)},
          {text: 'Have 200 medals or more for a Hero', reward: lootbox('Rare')},
          {text: 'Knock out 3 rivals'},
          {text: 'Knock out 3 rivals'},
          {text: 'Knock out 3 rivals'}
        ]}
      ],
      track: [
        {points: 2, reward: lootbox('Rare')},
        {points: 7, reward: qredits(1000)},
        {points: 13, reward: lootbox('Rare')},
        {points: 20, reward: 'Skin'}
      ]
    },
    {
      name: 'Ratchet & Clank Visit the Simulation',
      kind: 'Limited visit',
      duration: 'About 14 days (342 hours)',
      art: 'images/events/RatchetJoinsTheSimulation_Illustration.png',
      icon: 'images/events/ico_RatchetJoinsTheSimulation.png',
      summary: 'Qwark has licensed Ratchet & Clank for a short stay in the simulation, with a full refund on anything you spend on them.',
      lede: 'Qwark scored a temporary license for Ratchet & Clank! They are auto-equipped and ready to rumble right now.',
      rules: [
        '100% refund guarantee: all upgrade resources and Hard Currency spent on Ratchet & Clank are refunded.',
        'All medals earned with Ratchet & Clank are transferred to Widget.',
        'The visit lasts about 14 days.'
      ]
    },
    {
      name: "Rivet's Challenge",
      kind: 'Leaderboard',
      duration: '24 hours',
      art: 'images/events/RivetsChallenge_Illustration.png',
      icon: 'images/events/ico_RivetsChallenge.png',
      summary: 'Drop in, win matches in a row and climb the Best Win Streak leaderboard. One defeat resets your active streak.',
      lede: 'Rivet wants to see who is truly the best! Pit yourself against other Rangers and build the ultimate win streak.',
      rules: [
        'Each win extends your active streak. A single defeat resets it to zero.',
        'Your highest streak is saved as your Best Win Streak.',
        'Squad play and Play Again are disabled, and you return to the menu after each battle.',
        'The challenge runs for 24 hours.'
      ],
      ranks: [
        {rank: 1, rewards: [qredits(3000), 'Cores ×1']},
        {rank: 2, rewards: [qredits(2500), lootbox('Epic')]},
        {rank: 3, rewards: [qredits(2000), lootbox('Rare')]},
        {rank: 4, rewards: [qredits(1500), lootbox('Common')]},
        {rank: 5, rewards: [qredits(1000), lootbox('Common')]},
        {rank: 6, rewards: [qredits(500), lootbox('Common')]}
      ]
    }
  ];

  const cardHtml = event => `
    <button class="event-card" type="button">
      <span class="event-art"><img src="${assetUrl(event.art)}" alt="" loading="lazy"><span class="event-badge"><img src="${assetUrl(event.icon)}" alt=""></span></span>
      <span class="event-body">
        <span class="event-kind">${event.kind}</span>
        <span class="event-title">${event.name}</span>
        <span class="event-summary">${event.summary}</span>
        <span class="event-meta">Duration: ${event.duration}</span>
        <span class="event-open">View details</span>
      </span>
    </button>`;

  const missionDays = days => `
    <div class="mission-days">
      ${days.map(day => `
        <div class="mission-day">
          <h4>${day.title}</h4>
          <ul>
            ${day.missions.map(mission => `<li><span class="mission-text">${mission.text}</span>${mission.reward ? `<span class="mission-reward">Reward: ${mission.reward}</span>` : ''}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>`;

  const trackTable = track => `
    <table class="reward-table">
      <thead><tr><th scope="col">Points</th><th scope="col">Reward</th></tr></thead>
      <tbody>${track.map(step => `<tr><td>${step.points}</td><td>${step.reward}</td></tr>`).join('')}</tbody>
    </table>`;

  const rankTable = ranks => `
    <table class="reward-table">
      <thead><tr><th scope="col">Rank</th><th scope="col">Rewards</th></tr></thead>
      <tbody>${ranks.map(row => `<tr><td>${row.rank}</td><td><ul>${row.rewards.map(reward => `<li>${reward}</li>`).join('')}</ul></td></tr>`).join('')}</tbody>
    </table>`;

  const detailHtml = event => `
    <div class="event-dialog-inner">
      <div class="event-dialog-art"><img src="${assetUrl(event.art)}" alt=""></div>
      <div class="event-dialog-body">
        <p class="event-kind">${event.kind}</p>
        <h2>${event.name}</h2>
        <div class="event-dialog-meta"><span>Duration: ${event.duration}</span></div>
        <p class="lede">${event.lede}</p>
        ${event.days ? `<section class="event-section"><h3>Mission days</h3>${missionDays(event.days)}</section>` : ''}
        ${event.track ? `<section class="event-section"><h3>Reward track</h3>${trackTable(event.track)}</section>` : ''}
        ${event.ranks ? `<section class="event-section"><h3>Rank rewards</h3>${rankTable(event.ranks)}</section>` : ''}
        <section class="event-section"><h3>Rules</h3><ul class="event-rules">${event.rules.map(rule => `<li>${rule}</li>`).join('')}</ul></section>
        <div class="event-dialog-nav">
          <button type="button" data-step="-1">&larr; Previous</button>
          <button type="button" data-step="1">Next &rarr;</button>
        </div>
      </div>
    </div>`;

  grid.innerHTML = events.map(cardHtml).join('');

  const dialog = document.createElement('dialog');
  dialog.className = 'event-dialog';
  dialog.setAttribute('aria-label', 'Event details');
  dialog.innerHTML = '<button class="close" type="button" aria-label="Close">Close</button><div class="event-dialog-content"></div>';
  document.body.append(dialog);
  const content = dialog.querySelector('.event-dialog-content');
  let current = 0;

  const show = index => {
    current = (index + events.length) % events.length;
    content.innerHTML = detailHtml(events[current]);
    dialog.querySelector('.event-dialog-inner')?.scrollTo(0, 0);
  };

  const open = index => {
    show(index);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('.close').focus();
  };

  const close = () => dialog.close();

  grid.querySelectorAll('.event-card').forEach((card, index) => card.addEventListener('click', () => open(index)));
  dialog.querySelector('.close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) close();
    const step = event.target.closest?.('[data-step]');
    if (step) show(current + Number(step.dataset.step));
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
  });
})();
