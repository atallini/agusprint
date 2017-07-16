const CACHE_NAME = "v1";
const cacheUrls = ["/offline/view.html","/offline/style.css","/offline/map.png"];
console.log("SW startup");


self.addEventListener('install', function(event) {
  console.log("SW installed");
  caches.open(CACHE_NAME)
	  .then(function(cache) {
	    console.log('Opened cache');
	    return cache.addAll(cacheUrls);
	  });
});

self.addEventListener('activate', function(event) {
  console.log("SW activated");
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
    	console.log(cacheNames);
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log(event.request.url);
          console.log("In cache");  
          return response;
        }
        console.log("Not in cache");

        return fetch(event.request);
      }
    ).catch(function(err){
      console.log("No internet");
      if(event.request.mode == "navigate"){
        return caches.match("/offline/view.html");
      }
    })
  );
});