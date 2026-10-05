// 養貓生存挑戰：讓遊戲可以加到手機桌面，沒網路時也能打開上次的版本
const 名 = 'cat-game-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(名).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
