// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js', { scope: '.' })
//     .then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
// }

/// Setup

const navBtn = document.querySelector("#nav-btn");

function switchScreen(dest) {
  document.querySelector("#" + curScreen).style.display = "none";
  curScreen = dest;
  document.querySelector("#" + curScreen).style.display = "flex";
  navBtn.innerText = (curScreen === "screen1") ? "menu" : "arrow_back";
  switch (curScreen) {
    case "screen1": break;
    case "screen2": getArticles(); break;
    case "screen3": getCrashes(); break;
    case "screen4": break;
  }
}

let curScreen = "screen1";
document.querySelector("#" + curScreen).style.display = "flex";

const topAppBarEl = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarEl);
topAppBarEl.addEventListener("MDCTopAppBar:nav", () => {
  if (curScreen !== "screen1") switchScreen("screen1");
});

document.querySelectorAll('.mdc-list').forEach(listElem => {
  const list = new mdc.list.MDCList(listElem);
  list.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));
});

/// Screen 1

document.querySelector("#screen1 .mdc-list").addEventListener("MDCList:action", (e) => {
  switch (e.detail.index) {
    case 0:
      switchScreen("screen2");
      break;
    case 1:
      switchScreen("screen3");
      break;
    case 2:
      switchScreen("screen4");
      break;
  }
});

/// Screen 2

const listEl = document.querySelector("#screen2 .mdc-list");
const listItemEl = listEl.querySelector("#template");
const listDivEl = listEl.querySelector(".mdc-list-divider");

function getArticles() {
  const apiKey = "MSAn7QDBsAGxXe29NG7881zylY1ANOfc";
  const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${apiKey}`;
  const query = "Chicago";

  fetch(apiUrl + `&q=${query}`)
    .then(resp => {
      if (resp.ok) return resp.json();
      throw (`${resp.status}: ${resp.statusText}`);
    }).then(data => {
      listEl.innerHTML = "";
      data.response.docs.forEach(article => {
        newItem = listItemEl.cloneNode(true);
        newItem.querySelector("img").src = "https://www.nytimes.com/" + article.multimedia[0].url;
        newItem.querySelector(".mdc-list-item__primary-text").innerText = article.headline.main;
        newItem.querySelector(".mdc-list-item__secondary-text").innerText = article.abstract;
        newItem.querySelector("a").href = article.web_url;
        newItem.querySelector("a").innerText = article.web_url;
        listEl.append(newItem);
        listEl.append(listDivEl.cloneNode());
      });
    }).catch(err => console.log(err));
}

/// Screen 3

let map;
let watchID;
let myLocation;

function getCrashes() {
  const apiUrl = "https://data.cityofchicago.org/resource/85ca-t3if.json";
  const date = new Date().toISOString().slice(0, 10);

  fetch(apiUrl + `?crash_date=${date}`)
    .then(resp => {
      if (resp.ok) return resp.json();
      throw (`${resp.status}: ${resp.statusText}`);
    }).then(data => {
      data.forEach(crash => {
        new google.maps.Marker({
          position: { lat: parseFloat(crash.latitude), lng: parseFloat(crash.longitude) },
          map: map,
        });
      });
    }).catch(err => console.log(err));
}

function initMap() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((location) => {
      const coord = { lat: location.coords.latitude, lng: location.coords.longitude };

      map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 10,
        center: coord,
      });

      addMarker(coord);

      watchID = navigator.geolocation.watchPosition((position) => {
        addMarker({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    });
  } else {
    document.querySelector("#map").innerText = "Your browser does not support Geolocation.";
  }
}

function addMarker(coord) {
  if (myLocation != null) myLocation.setMap(null);
  myLocation = new google.maps.Marker({
    position: coord,
    icon: {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "green",
      fillOpacity: 1,
      strokeWeight: 1,
      rotation: 0,
      scale: 1.5,
      anchor: new google.maps.Point(15, 30),
    },
    map: map,
  });
  map.setCenter(coord);
}

/// Screen 4

