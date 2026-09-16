(() => {
  const params = new URLSearchParams(location.search);
  const hero = params.get('hero');
  if (hero && typeof window.showHero === 'function') window.showHero(hero);
})();
