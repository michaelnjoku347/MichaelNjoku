/**
 * Serves OrbitScope’s API from frozen snapshot JSON under /orbitscope/data/
 * so the Cesium globe can run on the static portfolio without the Java server.
 */
(() => {
  const DATA = '/orbitscope/data';
  let catalogPromise;
  let compactPromise;
  let passesPromise;

  const load = (path) => fetch(path).then((r) => {
    if (!r.ok) throw new Error(`Missing ${path}`);
    return r.json();
  });

  const catalog = () => (catalogPromise ??= load(`${DATA}/catalog.json`));
  const compact = () => (compactPromise ??= load(`${DATA}/compact.json`));
  const issPasses = () => (passesPromise ??= load(`${DATA}/passes-25544.json`));

  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url, window.location.origin);
    if (url.origin !== window.location.origin) return originalFetch(input, init);

    const path = url.pathname.replace(/\/$/, '') || '/';
    const method = (init?.method || 'GET').toUpperCase();
    if (method !== 'GET') return originalFetch(input, init);

    if (path === '/satellites' || path === '/orbitscope/satellites') {
      return json(await catalog());
    }
    if (path === '/satellites/positions/compact' || path === '/orbitscope/satellites/positions/compact') {
      return json(await compact());
    }
    if (path === '/satellites/positions' || path === '/orbitscope/satellites/positions') {
      return json(await compact());
    }

    const passes = path.match(/^\/(?:orbitscope\/)?satellites\/(\d+)\/passes$/);
    if (passes) {
      const id = passes[1];
      if (id === '25544') return json(await issPasses());
      return json({
        observer: { name: 'New York' },
        passes: [],
        note: 'Portfolio snapshot: pass times for this satellite were not precomputed. The ISS has sample passes.',
      });
    }

    const position = path.match(/^\/(?:orbitscope\/)?satellites\/(\d+)\/position$/);
    if (position) {
      const id = Number(position[1]);
      const frame = await compact();
      const i = frame.ids.indexOf(id);
      if (i < 0) return json({ error: 'unknown satellite' }, 404);
      return json({
        id,
        time: frame.time,
        latitude: frame.latitude[i],
        longitude: frame.longitude[i],
        altitudeKm: frame.altitudeKm[i],
        group: frame.group[i],
      });
    }

    return originalFetch(input, init);
  };
})();
