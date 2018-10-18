// Make sure sw are supported

if (navigator.serviceWorker) {
    console.log('Service Worker IS supported');

    navigator.serviceWorker
        .register('./sw_cached_pages.js')
        .then(function reg() {
            console.log('Service Worker: Registered')
        })
        .catch(function(err) {
            console.log(`Service Worker Error: ${err}`)
        })
} else {
    console.log('Service Worker is NOT supported');
}
