// Caching defined pages

const cacheName = 'v2';

// Call Install Event
self.addEventListener('install', function(e) {
    console.log('Service Worker: Installed');
});

// Call Activate Event
self.addEventListener('activate', function(e) {
    console.log('Service Worker: Activated');

//     // Remove unwanted caches
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
// self.addEventListener('fetch', e => {
//     console.log('Service Worker: Fetching');
//     // if the fetch fails (offline), then pull from cache
//     e.respondWith(
//         fetch(e.request)
//             .then(resp => {
//                 // Clone resp from server into cache
//                 const resClone = resp.clone();
//                 caches.open(cacheName)
//                     .then(cache => {
//                         cache.put(e.request, resClone)
//                     });
//                 return resp;
//             })
//             .catch(err => caches.match(e.request).then(res => res))
//     )
// });

self.addEventListener('sync', function (event) {
    console.log('AM I HERE???');
    // if (event.tag == 'todo_updated') {
    //   event.waitUntil(submitFormData());
    // }
    self.registration.showNotification("Sync event fired!");
  });

function submitFormData() {
    console.log('submitFormData')
    return new Promise((resolve, reject), () => {
        return setTimeout(() => resolve(), 500);
    })
}