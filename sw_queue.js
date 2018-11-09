// layer on top of Service Workers to provide a way to easily use
importScripts('./js/lib/serviceWorkerWare.js');
// a wrapper for indexedDB
importScripts('./js/lib/localforage.min.js');

const endpoint = 'https://5bc8d3808bfe5a00131b6f96.mockapi.io/api/quotations';
const worker = new ServiceWorkerWare();

/**
 * tries to complete a request or returns a default response
 * 
 * @param {Response} fakeResponse the default response for route when offline
 */
function tryOrFallback(fakeResponse) {
    return (req, res) => {
        if (!navigator.onLine) {
            console.log('No network availability, enqueuing');
            return enqueue(req).then(() => fakeResponse.clone());
        } else {
            console.log('Network available! Flushing queue.');
            return flushQueue().then(() => fetch(req));
        }
    }
}

// setting up default responses for different fetch methods
worker.get(endpoint, tryOrFallback(new Response(null, {
    status: 202
})));

worker.delete(endpoint + '/:id?*', tryOrFallback(new Response(null, {
    status: 204
})));

worker.post(endpoint, tryOrFallback(new Response(null, {
    status: 202,
    headers: {'Content-Type': 'application/json'}
})));

//starting service worker
worker.init();

/**
 * gets any stored messages in the queue and adds the new request
 * 
 * @param {Request} request the item to be stored for future use
 */
function enqueue(request) {
    return serialize(request).then(serialized => {
        localforage.getItem('queue').then(queue => {
            const newQueue = queue || [];
            newQueue.push(serialized);
            return localforage.setItem('queue', newQueue).then(() => {
                console.log(serialized.method, serialized.url, 'enqueued!');
            })
        })
    })
}

/**
 * performs all requests in order that they were queued
 */
function flushQueue() {
    return localforage.getItem('queue').then(queue => {
        if (!queue || (queue && !queue.length)) {
            return Promise.resolve();
        }

        console.log('Sending ', queue.length, ' requests...');
        return sendInOrder(queue).then(() => localforage.setItem('queue', []));
    })
}

/**
 * Makes sure that the previous request is complete before sending the next one
 * 
 * @param {Request[]} requests list of requests to be sent
 */
function sendInOrder(requests) {
    // TODO: convert to async/await
    return requests.reduce((prevPromise, serialized) => {
        console.log('Sending', serialized.method, serialized.url);
        return prevPromise.then(() => {
            return deserialize(serialized).then(request => fetch(request));
        })
    }, Promise.resolve())
}

function serialize(request) {
    console.log(request.headers.entries());
    const headers = {...request.headers};
    const serialized = {
        url: request.url,
        headers: headers,
        method: request.method,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return request.clone().text().then(body => {
            serialized.body = body;
            return Promise.resolve(serialized);
        })
    }
    return Promise.resolve(serialized);
}

function deserialize(data) {
    return Promise.resolve(new Request(data.url, {
        ...data,
        headers: {
            'Content-Type': 'application/json'
        }
    }));
}