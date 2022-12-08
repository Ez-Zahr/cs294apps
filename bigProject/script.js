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

const bgColors = {
  "screen1": "silver",
  "screen2": "#d2afed",
  "screen3": "#afedc8",
  "screen4": "#edafaf",
};
const navBtn = document.querySelector("#nav-btn");

function switchScreen(dest) {
  document.querySelector("#" + curScreen).style.display = "none";
  curScreen = dest;
  document.body.style.backgroundColor = bgColors[curScreen];
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
document.body.style.backgroundColor = bgColors[curScreen];
document.querySelector("#" + curScreen).style.display = "flex";

const topAppBarEl = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarEl);
topAppBarEl.addEventListener("MDCTopAppBar:nav", () => {
  if (curScreen !== "screen1") switchScreen("screen1");
});

/// Screen 1

const homeListEl = document.querySelector('#screen1 .mdc-list');
new mdc.list.MDCList(homeListEl);

homeListEl.addEventListener("MDCList:action", (e) => {
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

const articlesListEl = document.querySelector("#screen2 .mdc-list");
new mdc.list.MDCList(articlesListEl);
const articlesListItemEl = articlesListEl.querySelector(".mdc-list-item");
const articlesListDivEl = articlesListEl.querySelector(".mdc-list-divider");

function getArticles() {
  const apiKey = "MSAn7QDBsAGxXe29NG7881zylY1ANOfc";
  const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${apiKey}`;
  const query = "Chicago";

  fetch(apiUrl + `&q=${query}`)
    .then(resp => {
      if (resp.ok) return resp.json();
      throw (`${resp.status}: ${resp.statusText}`);
    }).then(data => {
      articlesListEl.innerHTML = "";
      data.response.docs.forEach(article => {
        newItem = articlesListItemEl.cloneNode(true);
        newItem.querySelector("img").src = "https://www.nytimes.com/" + article.multimedia[0].url;
        newItem.querySelector(".mdc-list-item__primary-text").innerText = article.headline.main;
        newItem.querySelector(".mdc-list-item__secondary-text").innerText = article.abstract;
        newItem.querySelector("a").href = article.web_url;
        newItem.querySelector("a").innerText = article.web_url;
        articlesListEl.append(newItem);
        articlesListEl.append(articlesListDivEl.cloneNode());
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
        zoom: 12,
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

const db = new Dexie("NotesDB");

db.version(1).stores({
  notes: "subject"
});

const noteSubject = new mdc.textField.MDCTextField(document.querySelector('#note-subject'));
const noteBody = new mdc.textField.MDCTextField(document.querySelector('#note-body'));
const notesListEl = document.querySelector("#screen4 .mdc-list");
const notesList = new mdc.list.MDCList(notesListEl);
const notesListItemEl = notesListEl.querySelector(".mdc-list-item");
const notesListDivEl = notesListEl.querySelector(".mdc-list-divider");

function showNotes(notes) {
  notesListEl.innerHTML = '';
  notes.forEach((note) => {
    const noteElem = notesListItemEl.cloneNode(true);
    noteElem.querySelector(".mdc-list-item__primary-text").innerText = note.subject;
    noteElem.querySelector(".mdc-list-item__secondary-text").innerText = note.body;
    notesListEl.append(noteElem);
    notesListEl.append(notesListDivEl.cloneNode());
  });
}

function getNotes() {
  db.notes.toArray().then((notes) => {
    showNotes(notes);
  });
}

function updateNote(subject, body) {
  db.notes.put({ subject, body })
    .then(() => getNotes())
    .catch(err => alert(err));
}

function deleteNote(subject) {
  db.notes.delete(subject)
    .then(() => {
      noteSubject.value = "";
      noteBody.value = "";
      getNotes();
    })
    .catch(err => alert(err));
}

document.querySelector("#save-btn").addEventListener("click", () => {
  if (noteSubject.value && noteBody.value) {
    updateNote(noteSubject.value, noteBody.value);
  }
});

document.querySelector("#delete-btn").addEventListener("click", () => {
  if (noteSubject.value) {
    deleteNote(noteSubject.value);
  }
});

notesListEl.addEventListener("MDCList:action", (e) => {
  const sub = notesList.listElements[e.detail.index].querySelector(".mdc-list-item__primary-text").innerText;
  db.notes.get(sub).then(note => {
    noteSubject.value = sub;
    noteBody.value = note.body;
  });
});

getNotes();