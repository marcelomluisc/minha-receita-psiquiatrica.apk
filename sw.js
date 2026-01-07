// Nome da cache
const CACHE_NAME = 'anamnese-app-v3';

// Arquivos para cache - URLs CORRETAS para GitHub Pages
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

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🟡 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache aberto:', CACHE_NAME);
        
        // Tenta adicionar apenas os arquivos principais
        return cache.addAll([
          '/minha-receita-psiquiatrica.apk/index.html',
          '/minha-receita-psiquiatrica.apk/manifest.json'
        ]).catch(error => {
          console.log('⚠️ Alguns arquivos não puderam ser cacheados:', error);
        });
      })
  );
  self.skipWaiting();
});

// Intercepta requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições para APIs externas específicas
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && 
      !url.href.includes('cdn.jsdelivr.net') &&
      !url.href.includes('cdnjs.cloudflare.com') &&
      !url.href.includes('fonts.googleapis.com') &&
      !url.href.includes('i.ibb.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // 1. Retorna do cache se encontrou
        if (cachedResponse) {
          console.log('📦 Cache hit:', event.request.url);
          return cachedResponse;
        }
        
        // 2. Se não tem no cache, faz requisição de rede
        console.log('🌐 Network request:', event.request.url);
        
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            
            // Clona a resposta
            const responseToCache = response.clone();
            
            // Adiciona ao cache (async - não espera)
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
                  .then(() => {
                    console.log('✅ Cacheado:', event.request.url);
                  })
                  .catch(cacheError => {
                    console.log('❌ Erro ao cachear:', cacheError);
                  });
              });
            
            return response;
          })
          .catch((fetchError) => {
            console.log('❌ Erro na rede:', fetchError);
            
            // Fallback para páginas HTML
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/minha-receita-psiquiatrica.apk/index.html');
            }
            
            return new Response('Offline - Sem conexão', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('🟡 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker ativo e pronto!');
      return self.clients.claim();
    })
  );
});
