let map;
let coordsDiv;
let watchID;
const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 3000
};

function addCoord(coord) {
  new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.8,
    map,
    center: coord,
    radius: 25,
  });
  map.setCenter(coord);
  coordsDiv.innerHTML = `<p>${coord.lat}, ${coord.lng} | ${new Date()}</p>${coordsDiv.innerHTML}`;
}

function initMap() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((location) => {
      const coord = { lat: location.coords.latitude, lng: location.coords.longitude };

      map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 15,
        center: coord,
      });

      addCoord(coord);

      watchID = navigator.geolocation.watchPosition((position) => {
        addCoord({ lat: position.coords.latitude, lng: position.coords.longitude });
      }, null, options);
    }, null, options);

    coordsDiv = document.querySelector("#coords");
  } else {
    document.querySelector("#map").innerText = "Your browser does not support Geolocation.";
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: '.' })
    .then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
}