// CORRIJA O sw.js COM ESTE CÓDIGO:
const CACHE_NAME = 'anamnese-app-v2';
const urlsToCache = [
  '/minha-receita-psiquiatrica.apk/',
  '/minha-receita-psiquiatrica.apk/index.html',
  '/minha-receita-psiquiatrica.apk/manifest.json',
  '/minha-receita-psiquiatrica.apk/sw.js',
  'https://i.ibb.co/CsTtFZ52/FOTO-AAAAA.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache instalado:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Falha no cache:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Não cachear requisições de analytics ou POST
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retorna do cache se disponível
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Faz requisição de rede
        return fetch(event.request)
          .then((response) => {
            // Não cachear respostas inválidas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta para cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback para página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/minha-receita-psiquiatrica.apk/index.html');
            }
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
