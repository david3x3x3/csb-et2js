best = 0;
if (typeof w == "undefined") {
    w = [];
    nworkers = 8;
    var startTime = Date.now();
    var progress = [];
    var bests = [];
    for (workerNum = 0; workerNum < nworkers; workerNum++) {
	progress.push("");
	bests.push(0);
	w.push(new Worker("worker.js"));
	w[workerNum].onmessage = function (event) {
	    for(var workerNum=0; workerNum<nworkers; workerNum++) {
		if (event.target == w[workerNum]) {
		    break;
		}
	    }
	    //console.log("event = " + event);
	    if (event.data.type == "progress") {
		nodes = event.data.nodes;
		rate = Math.round((nodes / (Date.now() - startTime)) * 1000);
		progress[workerNum] = `worker=${workerNum} nodes=${nodes / 1000000}m rate=${rate}/sec best=${bests[workerNum]}`;
		document.getElementById("progress").innerHTML = progress.join("<br>");
		return;
	    }
	    data = event.data.board;
	    score = event.data.score;
	    if (score > bests[workerNum]) {
		bests[workerNum] = score;
	    }
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
