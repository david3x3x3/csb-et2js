var pieces;
var best = 0;
const fit = {};

function setup() {
    var ps =
	"aabd/aabe/aacd/aadc/abgb/abhc/abjb/abjf/abmd/aboe/abpc/abte/abtf/abve/achb/acid/" +
	"ackf/acnf/acoc/acpc/acqe/acrb/acrf/acsb/acvb/adgc/adgd/adhd/adid/adof/adpc/adsd/" +
	"adtc/adte/aduf/adwe/aeib/aelf/aemf/aenc/aend/aepb/aepc/aepd/aeqb/aese/aete/aeue/" +
	"afgf/afhb/afhc/afjb/afoe/afqe/afqf/aftd/afub/afuf/afvc/afwd/ggji/ggko/ghhl/gigt/" +
	"giiw/gikk/gimh/gisj/giwt/gllo/glor/gmki/gmpq/gmsp/gmtl/gnkp/gnnp/golu/gosl/gouv/" +
	"gpni/gqii/gqmq/grin/grjk/grtr/grus/gsgv/gsjw/gsqu/gtmr/gtnp/gtnq/gtqv/gtrk/gvvl/" +
	"gwqn/gwst/gwvj/gwwv/hhrp/hhru/hhun/hhwj/hiqp/hjlt/hjnt/hjqp/hjum/hkpr/hkrp/hlsn/" +
	"hlsu/hmkq/hmor/hmrm/hmwu/hnlv/hour/hptw/hqkw/hsju/hskn/hssp/htrw/htvp/hukj/hunv/" +
	"huql/hust/hvjs/hvrk/hwku/hwmq/hwql/hwus/iiso/ijjl/ijjm/ijjr/ijnv/ijpj/ijur/ijvv/" +
	"iklq/ilir/iliw/illk/ilpr/injm/inqw/iomm/iomn/iowu/iqoo/iqor/iqwo/isou/istj/itvv/" +
	"iujs/iuks/iwpm/iwqu/jklq/jkqt/jmll/jnmp/jnnv/joqt/josu/jovm/jppp/jprs/jqov/jron/" +
	"jskq/jtru/jttp/juou/jvmu/jvom/kknt/klwo/kmnr/kmtt/knvo/kokv/koln/koun/kpll/kpps/" +
	"kqmo/krvm/krvw/krwp/ksmw/ksnt/ksss/ktnl/kuvt/kuwo/kvrn/kvrt/kvul/kvwv/llwo/lmnw/" +
	"lmtp/lomn/loup/lplu/lqtt/lrls/lrqw/lrwv/lsnp/luqr/lvmq/lwmu/lwvv/lwvw/mmrw/mmso/" +
	"mmup/monp/morr/mqnt/msow/msut/mtrs/mtrv/nnns/nouq/nqoq/nqos/nqrp/nrqu/nspw/nsvp/" +
	"ntov/ntqv/oppr/opst/oqws/ovuw/ppvw/pqrq/prqv/psuv/qqwt/qrtr/rtus/suvu/swuw/twvw";
    pieces = ["aaaa"].concat(ps.split("/"));
    p2 = [];
    for (p=0; p<pieces.length; p++) {
	var s2 = [];
	var s = pieces[p];
	s = s.substring(2, 4) + s.substring(0, 2);
	for (i = 0; i < 4; i++) {
	    if (s[1] == "a") {
		k3 = '1';
	    } else {
		k3 = '0';
	    }
	    if (s[2] == "a") {
		k4 = '1';
	    } else {
		k4 = '0';
	    }
	    k = s[0] + s[3] + k3 + k4;
	    if (p > 0) {
		if (!(k in fit)) {
		    fit[k] = [];
		}
  		fit[k].push([p, i]);
	    }
	    s2.push(s);
	    // rotate the piece
	    s = s.substring(3, 4) + s.substring(0, 3);
	}
	p2.push(s2);
    }
    pieces = p2;
    //console.log(pieces);
    // postMessage(pieces);
}

function shuffle(array) {
    let currentIndex = array.length,
	randomIndex;
    while (currentIndex > 0) {
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex--;
	[array[currentIndex], array[randomIndex]] = [
	    array[randomIndex],
	    array[currentIndex],
	];
    }
    return array;
}

var nodes = 0;

function printBoard(board) {
    var sl = [];
    var s = "";
    for (var b in board) {
	sl.push(board[b].join("/"));
	var b2 = board[b];
	s += pieces[b2[0]][b2[1]];
    }
    for (var i=1; i<=256; i++) {
	if (remain[i]) {
	    sl.push(i + "/0");
	    s += pieces[i][0];
	}
    }
    var msg = {};
    msg["type"] = "best";
    msg["board"] = sl;
    msg["score"] = board.length;
    msg[
	"url"
    ] = `https://e2.bucas.name/#puzzle=EternityII&board_w=16&board_h=16&board_edges=${s}`;
    //console.log(msg);
    postMessage(msg);
    best = board.length;
}

var procs = [];
for(var i=0; i<256; i++) {
    var src = `// cell ${i}\n`;
    src += `    if (++nodes % 2000000 == 0) {\n`;
    src += `        msg = {};\n`;
    src += `        msg["type"] = "progress";\n`;
    src += `        msg["nodes"] = nodes;\n`;
    src += `        postMessage(msg);\n`;
    src += `    }\n`;
    src += `if (${i} > best) {\n`;
    src += `    printBoard(board);\n`;
    src += `    best = ${i};\n`;
    src += `}\n`;
    var row = Math.floor(i / 16);
    var col = i % 16;
    src += `var k1, k2;\n`;
    if (row == 0) {
	src += `k1 = "a";\n`;
    } else {
	src += `b = board[${i - 16}];\n`
	src += `k1 = pieces[b[0]][b[1]][2];\n`;
    }
    if (col == 0) {
	src += `k2 = "a";\n`;
    } else {
	src += `b = board[${i - 1}];\n`;
	src += `k2 = pieces[b[0]][b[1]][1];\n`;
    }
    if (col == 15) {
	k3 = '1';
    } else {
	k3 = '0';
    }
    if (row == 15) {
	k4 = '1';
    } else {
	k4 = '0';
    }
    src += `var fl = fit[k1 + k2 + "${k3}${k4}"];\n`;
    src += `for (fi in fl) {\n`;
    src += `    var r = fl[fi][0];\n`;
    src += `    var rot = fl[fi][1];\n`;
    src += `    // check if piece is used\n`;
    src += `    if (!remain[r]) {\n`;
    src += `        continue;\n`;
    src += `    }\n`;
    if (i == 119) {
	src += `    // check above required piece\n`;
	src += `        if (pieces[r][rot][2] != pieces[139][2][0]) {\n`;
	src += `            continue;\n`;
	src += `        }\n`;
    }
    if (i < 135) {
	src += `    // check required piece\n`;
	src += `        if (r == 139) {\n`;
	src += `            continue;\n`;
	src += `        }\n`;
    }
    if (i == 135) {
	src += `        if (r != 139 || rot != 2) {\n`;
	src += `            continue;\n`;
	src += `        }\n`;
    }
    src += `    board.push([r, rot]);\n`;
    src += `    remain[r] = false;\n`;
    src += `    res = procs[${i+1}]();\n`;
    src += `    board.pop();\n`;
    src += `    remain[r] = true;\n`;
    src += `    if (res) {\n`;
    src += `        return true;\n`;
    src += `    }\n`;
    src += `}\n`;
    src += `return false;\n`;
    // console.log(`proc ${i}:\n${src}`);
    procs.push(Function(src));
}
               

setup();
var remain = [];
var board = [];
for (i=0; i < 257; i++) {
    remain.push(true);
}
for (k in fit) {
    shuffle(fit[k]);
}
procs[0]([], remain);
