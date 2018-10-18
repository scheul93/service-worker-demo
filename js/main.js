// Make sure sw are supported

if (navigator.serviceWorker) {
    console.log('Service Worker IS supported');

    navigator.serviceWorker
        .register('./sw_cached_site.js')
        .then(() => {
            console.log('Service Worker: Registered');
            bindBackgroundSyncEvents();
        })
        .catch(err => console.log(`Service Worker Error: ${err}`))
} else {
    console.log('Service Worker is NOT supported');
}

async function bindBackgroundSyncEvents() {
    const formEl = document.querySelector('.js-favorites-form');
    if (formEl) {
        formEl.addEventListener('submit', e => {
            e.preventDefault();
            // navigator.serviceWorker.ready
            //     .then(swRegistration => swRegistration.sync.register('todo_updated'))
            //     .then(() => console.log('event registered'));
            new Promise(function(resolve, reject) {
                Notification.requestPermission(function(result) {
                  if (result !== 'granted') return reject(Error("Denied notification permission"));
                  resolve();
                })
              }).then(function() {
                return navigator.serviceWorker.ready;
              }).then(function(reg) {
                return reg.sync.register('syncTest');
              }).then(function() {
                console.log('Sync registered');
              }).catch(function(err) {
                console.log('It broke');
                console.log(err.message);
              });
        })
    }
    
}

function isOnline(messageEl) {
    const message = navigator.onLine ?
        '' :
        'You are currently offline. All requests will be queued and synced as soon as you are connected again.';
    messageEl.textContent = message;
}

function init() {
    const messageEl = document.querySelector('.js-message');
    window.addEventListener('online', () => isOnline(messageEl));
    window.addEventListener('offline', () => isOnline(messageEl));
    isOnline(messageEl);
}

init();
