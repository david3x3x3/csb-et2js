best = 0;
if (typeof w == "undefined") {
  nworkers = 1;
  var startTime = Date.now();
  for (i = 0; i < nworkers; i++) {
    w = new Worker("worker.js");
    w.onmessage = function (event) {
      //console.log("event = " + event);
      if (event.data.type == "progress") {
        nodes = event.data.nodes;
        rate = Math.round((nodes / (Date.now() - startTime)) * 1000).toFixed(2);
        document.getElementById("progress").innerHTML = `progress: nodes=${
          nodes / 1000
        }k rate=${rate}/sec`;
        return;
      }
      data = event.data.board;
      score = event.data.score;
      if (score < best) {
        return;
      }
      best = score;
      while (data.length < 256) {
        data.push("0/0");
      }
      var s = "<pre>";
      for (row = 0; row < 16; row++) {
        for (col = 0; col < 16; col++) {
          d = data[row * 16 + col];
          while (d.length < 5) {
            d = " " + d;
          }
          s += d + " ";
        }
        s += "<br>";
      }
      s += "</pre>";
      document.getElementById(
        "result"
      ).innerHTML = `${score}:<br>${s}<br><a href='${event.data.url}' target='_blank'>view</a>`;
    };
  }
}
