// Make sure sw are supported

const apiEndpoint = 'https://5bc8d3808bfe5a00131b6f96.mockapi.io/api/preferences';
const messageEl = document.querySelector('.js-message');

function initServiceWorker() {
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
}

async function bindBackgroundSyncEvents() {
    const formEl = document.querySelector('.js-form');
    if (formEl) {
        formEl.addEventListener('submit', e => {
            e.preventDefault(e);
            processFormData(e);
        })
    }
    
}

function getFormData(formEl) {
    const inputEls = Array.from(formEl.querySelectorAll('input, select, textarea'));
    return inputEls.reduce((accum, inputEl) => {
        accum[inputEl.name] = inputEl.value;
        return accum;
    }, {})
}

async function processFormData(e) {
    const formData = getFormData(e.target);
    if ('SyncManager' in window && window.indexedDB) {
        await setDataInIndexedDB(formData);
        navigator.serviceWorker.ready
            .then(swRegistration => swRegistration.sync.register('form-submit'))
            .then(() => setMessage('Message saved from service worker.', 'success'))
            .catch(() => postFormData(formData));
    } else {
        postFormData(formData)
    }
}

function setDataInIndexedDB(formData) {
    return idbKeyval.set('uuid', {
        endpoint: apiEndpoint,
        header: {
            method: 'POST',
            body: JSON.stringify(formData)
        }
    })
}

function postFormData(formData) {
    console.log('Posting the old fashioned way.');
    fetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(fetchResponse => fetchResponse.json())
    .then(resp => {
        if (resp.success) {
            setMessage('Form data saved!', 'success');
        } else {
            setMessage(resp.message, 'error');
        }

    })
    .catch(() => {
        setMessage('Error saving form data', 'error');
    })
}

function setMessage(text, type) {
    messageEl.classList.toggle('message--error', type === 'error');
    messageEl.classList.toggle('message--warning', type === 'warning');
    messageEl.classList.toggle('message--success', type === 'success');
    messageEl.textContent = text;
}

function isOnline(messageEl) {
    const message = navigator.onLine ?
        '' :
        'You are currently offline. All requests will be queued and synced as soon as you are connected again.';
        setMessage(message, 'warning');
}

function init() {
    initServiceWorker();

    window.addEventListener('online', () => isOnline(messageEl));
    window.addEventListener('offline', () => isOnline(messageEl));
    isOnline(messageEl);
}

init();
