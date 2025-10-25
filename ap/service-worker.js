const CACHE_NAME = 'yape peru_v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/perfil.html',
  '/imagen/app_icon_xxxhdpi.png',
  '/imagen/splash_icon_xxxhdpi.png'
  '/inicio.html'
  '/home.html'
  '/registro.html'
  '/envio.html'
  '/comprobante.html'
  '/guarda.html'
  '/mis-datos.html'
  '/login.html'
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
