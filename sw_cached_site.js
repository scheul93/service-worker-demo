const cacheName = "v2";

// Call Install Event
self.addEventListener("install", function(e) {
    console.log("Service Worker: Installed");
});

// Call Activate Event
self.addEventListener("activate", function(e) {
    console.log("Service Worker: Activated");

    // Remove unwanted caches
    // extends the life of the activate event until promise resolves successfully
    e.waitUntil(
        // cache api keys
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log(`Service Worker: Clearing Old Cache ${cache}`);
                            return caches.delete(cache);
                        }
                    })
                );
            })
    );
});

// Call Fetch Event
self.addEventListener("fetch", e => {
    console.log("Service Worker: Fetching");
    // if the fetch fails (offline), then pull from cache
    if (e.request.method === "GET") {
        e.respondWith(
            // perform the fetch
            fetch(e.request)
                .then(resp => {
                    // copy the fetch resp into cache
                    const resClone = resp.clone();
                    caches.open(cacheName)
                        .then(cache => {
                            cache.put(e.request, resClone);
                        });
                    return resp;
                })
                .catch(err => caches.match(e.request).then(res => res))
        );
    }
   
});