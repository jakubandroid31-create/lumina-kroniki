// Service worker Lumina: gra działa offline po pierwszym uruchomieniu.
// index.html – najpierw sieć (aktualizacje docierają od razu), reszta – najpierw cache (w tym czcionki Google Fonts).
const CACHE = 'lumina-v1';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheable(req, res) {
  if (!res) return false;
  const u = new URL(req.url);
  if (u.origin === location.origin) return res.ok;
  // Google Fonts: arkusz CSS (cors) i pliki czcionek (często odpowiedź opaque)
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') return res.ok || res.type === 'opaque';
  return false;
}

function put(req, res) {
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (!u.protocol.startsWith('http')) return;

  const isPage = req.mode === 'navigate' ||
    (u.origin === location.origin && (u.pathname.endsWith('/') || u.pathname.endsWith('/index.html')));

  if (isPage) {
    // network-first
    e.respondWith(
      fetch(req).then(res => {
        if (cacheable(req, res)) put(req, res);
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // muzyka z music/ – zawsze najpierw sieć dla tracks.json, żeby własne utwory były widoczne od razu
  if (u.origin === location.origin && u.pathname.endsWith('/music/tracks.json')) {
    e.respondWith(fetch(req).then(res => { if (res.ok) put(req, res); return res; }).catch(() => caches.match(req)));
    return;
  }

  // cache-first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (cacheable(req, res)) put(req, res);
      return res;
    }))
  );
});
