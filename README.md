# Service Worker Demo
Following along with the [tutorial](https://www.youtube.com/watch?v=ksXwaWHCW6k)

## Browser APIs
+ [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API): proxy server that sits between web apps, the browser and the network.
[Support](https://caniuse.com/#feat=serviceworkers)
+ [Background Sync API](https://developers.google.com/web/updates/2015/12/background-sync): API to allow defered actions until stable connectivity exists.
[Support](https://caniuse.com/#feat=background-sync)
+ [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): client-side storage
[Support](https://caniuse.com/#feat=indexeddb)

## Other Helpers
+ [IDB-Keyval library](https://www.npmjs.com/package/idb-keyval): helps interact with IndexedDB using promises
+ [mock API](https://www.mockapi.io): creates endpoints and mocks data so I don't have to have a server for this demo

## Notes to self
Testing was super hard especially because testing a sync event on localhost doesn't seem to work. Couldn't find any documentation as to why or why not, it just didn't seem to do anything. I had to push my changes to GH Pages to test. Possibly related, I found [an article](https://notes.eellson.com/2018/02/11/chrome-the-background-sync-api-and-exponential-backoff/) that explains how retrying events works. This could have been part of the problem also.


Not sure the best way to import scripts into my service worker. I needed access to the ID-Keyval library so I ended up saving it to my project and loading it using `importScripts`.