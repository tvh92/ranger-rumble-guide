(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const originalShowHero = window.showHero;

  function addHeroChrome() {
    const detailBody = document.querySelector('.hero-detail .detail-body');
    if (!detailBody || detailBody.querySelector('.console-hero-chrome')) return;
    detailBody.insertAdjacentHTML('afterbegin', '<div class="console-hero-chrome"><span class="console-hero-status">HERO DATABASE // ONLINE</span><span class="console-hero-currency">◈ 10,702 &nbsp; ◆ 580,910</span></div>');
    detailBody.insertAdjacentHTML('beforeend', '<div class="console-hero-actions"><button type="button">SELECT</button><button type="button">TRY</button><span>Hero console preview</span></div>');
  }

  if (typeof originalShowHero === 'function') {
    window.showHero = key => { originalShowHero(key); addHeroChrome(); };
  }

  document.querySelectorAll('[data-console-mode]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.consoleMode;
    root.dataset.consoleMode = mode;
    document.querySelectorAll('[data-console-mode]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    if (mode === 'hero' && typeof window.showHero === 'function') window.showHero('Chip');
    if (mode === 'hud') document.querySelector('.console-bottom-actions')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));

  document.querySelectorAll('[data-preview-action]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.previewAction === 'select' && typeof window.showHero === 'function') window.showHero('Chip');
  }));

  const hero = params.get('hero');
  if (hero && typeof window.showHero === 'function') window.showHero(hero);
})();
