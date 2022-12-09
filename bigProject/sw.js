// Set a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheFiles = [
  './',
  './index.html',
  './script.js',
  './style.css',
  './cat.png',
  './crash.png',
  './notes.png',
  './nyt.png',
];


self.addEventListener('install', function(e) {
  // e.waitUntil Delays the event until the Promise is resolved
  e.waitUntil(

    // Open the cache
    caches.open(cacheName).then(function(cache) {

      // Add all the default files to the cache
      return cache.addAll(cacheFiles);
    })
  ); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
  e.waitUntil(

    // Get all the cache keys (cacheName)
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {

        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          return caches.delete(thisCacheName);
        }
      }));
    })
  ); // end e.waitUntil

});


self.addEventListener('fetch', (event) => {
  // Check if this is a request for an image
  if (event.request.destination === 'image') {
    event.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the cache first
      return cache.match(event.request.url).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      });
    }));
  } else {
    return;
  }
});