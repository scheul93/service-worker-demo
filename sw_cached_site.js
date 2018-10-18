// Caching defined pages

const cacheName = 'v2';

// Call Install Event
self.addEventListener('install', function(e) {
    console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', function(e) {
    console.log('Service Worker: Activated');

    // Remove unwanted caches
    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log(`Service Worker: Clearing Old Cache ${cache}`);
                            return caches.delete(cache);
                        }
                    })
                )
            })
    );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    // if the fetch fails (offline), then pull from cache
    if (e.request.method === 'GET') {
        e.respondWith(
            fetch(e.request)
                .then(resp => {
                    // Clone resp from server into cache
                    const resClone = resp.clone();
                    caches.open(cacheName)
                        .then(cache => {
                            cache.put(e.request, resClone)
                        });
                    return resp;
                })
                .catch(err => caches.match(e.request).then(res => res))
        )
    }
   
});

self.addEventListener('sync', function (event) {
    if (event.tag == 'form-submit') {
      event.waitUntil(submitFormData());
    }
  });

function submitFormData() {
    // make this a loop through items
    return idbKeyval.get('uuid')
        .then(val => {
            const {apiEndpoint, headers} = val;
            return fetch(apiEndpoint, headers).then(() => idbKeyval.del('uuid'));
        })
}