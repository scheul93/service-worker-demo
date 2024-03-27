// Make sure sw are supported
function initServiceWorker() {
    if (navigator.serviceWorker) {
        console.log("Service Worker IS supported");
    
        navigator.serviceWorker
            .register("./sw_cached_site.js")
            .then(() => {
                console.log("Service Worker: Registered");
            })
            .catch(err => console.log(`Service Worker Error: ${err}`));
    } else {
        console.log("Service Worker is NOT supported");
    }
}

initServiceWorker();
