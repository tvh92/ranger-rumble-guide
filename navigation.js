(() => {
  const version = document.querySelector('meta[name="app-version"]')?.content || 'dev';
  const currentPath = normalisePath(new URL(location.href).pathname);
  const warmed = new Set();
  const lowBandwidth = navigator.connection?.saveData || /^(slow-2g|2g)$/.test(navigator.connection?.effectiveType || '');
  const bundles = {
    'index.html': ['styles.css', 'details.css', 'data.js', 'guide-data.js', 'mods-data.js', 'descriptions.js', 'skin-manifest.js', 'data/skin-status.js', 'script.js'],
    'season-pass.html': ['styles.css', 'season-data.js', 'season-pass.js'],
    'bot-names.html': ['styles.css', 'bot-names.css', 'bot-names.js']
  };

  function normalisePath(path) {
    return path.replace(/\/index\.html$/, '/');
  }

  function addPrefetch(url) {
    const key = url.href;
    if (warmed.has(key)) return;
    warmed.add(key);
    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = key;
    document.head.append(hint);
  }

  function warm(link) {
    const page = new URL(link.href, location.href);
    if (page.origin !== location.origin || normalisePath(page.pathname) === currentPath) return;
    addPrefetch(page);
    const pageName = page.pathname.split('/').pop();
    (bundles[pageName] || []).forEach(file => {
      const asset = new URL(file, page);
      asset.search = `?v=${encodeURIComponent(version)}`;
      addPrefetch(asset);
    });
  }

  const links = [...document.querySelectorAll('a.topbar-link')];
  links.forEach(link => {
    const warmLink = () => warm(link);
    link.addEventListener('pointerenter', warmLink, {once: true});
    link.addEventListener('focus', warmLink, {once: true});
    link.addEventListener('touchstart', warmLink, {once: true, passive: true});
  });

  if (!lowBandwidth) {
    const warmAll = () => links.forEach(warm);
    const schedule = () => {
      if ('requestIdleCallback' in window) requestIdleCallback(warmAll, {timeout: 2200});
      else setTimeout(warmAll, 1200);
    };
    if (document.readyState === 'complete') schedule();
    else addEventListener('load', schedule, {once: true});
  }
})();
