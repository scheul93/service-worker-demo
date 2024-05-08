# Service Worker Demo
Following along with the [tutorial](https://www.youtube.com/watch?v=ksXwaWHCW6k)

update to readme

## Browser APIs
+ [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API): proxy server that sits between web apps, the browser and the network.
[Support](https://caniuse.com/#feat=serviceworkers)
+ [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): client-side storage
[Support](https://caniuse.com/#feat=indexeddb)
+ [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification): display desktop notifications to user
[Support](https://developer.mozilla.org/en-US/docs/Web/API/notification#Browser_compatibility)

## Other Helpers
+ [Local Forage](https://localforage.github.io/localForage/): an asynchronous data store to help with offline experiences
+ [Service Worker Ware](https://github.com/fxos-components/serviceworkerware): layer on top of service workers to provide easy use
+ [mock API](https://www.mockapi.io): creates endpoints and mocks data so I don't have to have a server for this demo

## Notes to self
Background Sync API was really difficult to use. Testing was super hard especially because testing a sync event on localhost doesn't seem to work. Couldn't find any documentation as to why or why not, it just didn't seem to do anything. I had to push my changes to GH Pages to test. Possibly related, I found [an article](https://notes.eellson.com/2018/02/11/chrome-the-background-sync-api-and-exponential-backoff/) that explains how retrying events works. This could have been part of the problem also.


Not sure the best way to import scripts into my service worker. I needed access some libraries so I ended up saving it to my project and loading it using `importScripts`.
