var pieces;
var best = 0;

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
  for (p in pieces) {
    var s2 = [];
    var s = pieces[p];
    s = s.substring(2, 4) + s.substring(0, 2);
    for (i = 0; i < 4; i++) {
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

function search(board, remain) {
  if (++nodes % 100000 == 0) {
    msg = {};
    msg["type"] = "progress";
    msg["nodes"] = nodes;
    postMessage(msg);
  }
  // console.log("search", board, remain);
  if (board.length > best) {
    var sl = [];
    var s = "";
    for (b in board) {
      sl.push(board[b].join("/"));
      b2 = board[b];
      s += pieces[b2[0]][b2[1]];
    }
    i = remain.values();
    for (ri in remain) {
      r = remain[ri];
      sl.push(r + "/0");
      s += pieces[r][0];
    }
    msg = {};
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
  var row = Math.floor(board.length / 16);
  var col = board.length % 16;
  for (ri in remain) {
    var r = remain[ri];
    for (rot = 0; rot < 4; rot++) {
      var p = pieces[r][rot];
      // check match above
      if (row == 0) {
        if (p[0] != "a") {
          continue;
        }
      } else {
        b = board[board.length - 16];
        if (p[0] != pieces[b[0]][b[1]][2]) {
          continue;
        }
      }
      // check match left
      if (col == 0) {
        if (p[3] != "a") {
          continue;
        }
      } else {
        b = board[board.length - 1];
        if (p[3] != pieces[b[0]][b[1]][1]) {
          continue;
        }
      }
      // check right edge
      if (col == 15) {
        if (p[1] != "a") {
          continue;
        }
      } else {
        if (p[1] == "a") {
          continue;
        }
      }
      // check bottom edge
      if (row == 15) {
        if (p[2] != "a") {
          continue;
        }
      } else {
        if (p[2] == "a") {
          continue;
        }
      }
      // check above required piece
      if (board.length == 119) {
        if (pieces[r][rot][2] != pieces[139][2][0]) {
          continue;
        }
      }
      // check required piece
      if (board.length < 135) {
        if (r == 139) {
          continue;
        }
      } else if (board.length == 135) {
        if (r != 139 || rot != 2) {
          continue;
        }
      }
      board.push([r, rot]);
      remain2 = [...remain];
      remain2.splice(ri, 1);
      res = search(board, remain2);
      board.pop();
      if (res) {
        return true;
      }
    }
  }
  return false;
}

setup();
var remain = Array.from(Array(257).keys()).slice(1);
shuffle(remain);
search([], remain);
