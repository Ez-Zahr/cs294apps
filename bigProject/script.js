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

function switchScreen(dest) {
  document.querySelector("#" + curScreen).style.display = "none";
  curScreen = dest;
  document.querySelector("#" + curScreen).style.display = "block";
}

let curScreen = "screen1";
document.querySelector("#" + curScreen).style.display = "block";