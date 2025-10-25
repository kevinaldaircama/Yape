// 🆕 Cambia la versión cada vez que actualices tu PWA
const CACHE_NAME = 'yape_v3';

// 🗂️ Archivos a guardar en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/perfil.html',
  '/inicio.html',
  '/login.html',
  '/imagen/app_icon_xxxhdpi.png',
  '/imagen/splash_icon_xxxhdpi.png'
  '/recargas.html'
];

// 📦 Instalar y guardar archivos en caché
self.addEventListener('install', event => {
  console.log('🆕 Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📁 Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // 🔁 Forzar actualización inmediata
  );
});

// 🧹 Activar y eliminar versiones viejas
self.addEventListener('activate', event => {
  console.log('✅ Activando nueva versión del Service Worker...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 🌐 Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      // Si está en caché → úsalo; si no → ve a la red
      return resp || fetch(event.request);
    })
  );
});
