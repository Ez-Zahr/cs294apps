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

function getArticles() {
  const apiKey = "MSAn7QDBsAGxXe29NG7881zylY1ANOfc";
  const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${apiKey}`;
  const query = "Chicago";

  fetch(apiUrl + `&q=${query}`)
    .then(resp => {
      if (resp.ok) return resp.json();
      throw (`${resp.status}: ${resp.statusText}`);
    }).then(data => {
      console.log(data);
      data.response.docs.forEach(article => {
        // TODO
      });
    }).catch(err => console.log(err));
}

function getCrashes() {
  const apiUrl = "https://data.cityofchicago.org/resource/85ca-t3if.json";
  const date = new Date().toISOString();

  fetch(apiUrl + `?crash_date=${date}`)
    .then(resp => {
      if (resp.ok) return resp.json();
      throw (`${resp.status}: ${resp.statusText}`);
    }).then(data => {
      console.log(data);
      data.response.docs.forEach(crash => {
        // TODO
      });
    }).catch(err => console.log(err));
}

const navBtn = document.querySelector("#nav-btn");

function switchScreen(dest) {
  document.querySelector("#" + curScreen).style.display = "none";
  curScreen = dest;
  document.querySelector("#" + curScreen).style.display = "flex";
  navBtn.innerText = (curScreen === "screen1") ? "menu" : "arrow_back";
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