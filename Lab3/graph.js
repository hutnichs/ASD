var n3 = 1, n4 = 0;
var SEED = 5410;
var N = 10 + n3;
var k = 1.0 - n3 * 0.02 - n4 * 0.005 - 0.25;
var VR = 18;
var seed = SEED;
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
var Adir = [];
for (var i = 0; i < N; i++) {
  Adir[i] = [];
  for (var j = 0; j < N; j++) {
    var val = rand() * 2.0 * k;
    Adir[i][j] = (i !== j && val >= 1.0) ? 1 : 0;
  }
}

var Aundir = [];
for (var i = 0; i < N; i++) {
  Aundir[i] = [];
  for (var j = 0; j < N; j++) {
    Aundir[i][j] = (i !== j && (Adir[i][j] === 1 || Adir[j][i] === 1)) ? 1 : 0;
  }
}
function getPositions(W, H) {
  var cx = W / 2, cy = H / 2;
  var r = Math.min(cx, cy) * 0.78;
  var pos = [];
  for (var i = 0; i < N; i++) {
    var angle = (2 * Math.PI * i / N) - Math.PI / 2;
    pos.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return pos;
}
function drawArrow(ctx, x1, y1, x2, y2) {
  var dx = x2 - x1, dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy);
  var ux = dx / len, uy = dy / len;

  var sx = x1 + ux * VR, sy = y1 + uy * VR;
  var ex = x2 - ux * VR, ey = y2 - uy * VR;

  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  var a = Math.atan2(ey - sy, ex - sx);
  var AL = 10, AW = 0.4;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - AL * Math.cos(a - AW), ey - AL * Math.sin(a - AW));
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - AL * Math.cos(a + AW), ey - AL * Math.sin(a + AW));
  ctx.stroke();
}
function drawCurvedArrow(ctx, x1, y1, x2, y2, bend) {
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  var dx = x2 - x1, dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy);
  var cpx = mx - (dy / len) * bend;
  var cpy = my + (dx / len) * bend;

  var d0x = x1 - cpx, d0y = y1 - cpy;
  var l0 = Math.sqrt(d0x * d0x + d0y * d0y);
  var sx = x1 - d0x / l0 * VR, sy = y1 - d0y / l0 * VR;

  var dex = x2 - cpx, dey = y2 - cpy;
  var le = Math.sqrt(dex * dex + dey * dey);
  var ex = x2 - dex / le * VR, ey = y2 - dey / le * VR;

  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(cpx, cpy, ex, ey);
  ctx.stroke();

  var a = Math.atan2(ey - cpy, ex - cpx);
  var AL = 10, AW = 0.4;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - AL * Math.cos(a - AW), ey - AL * Math.sin(a - AW));
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - AL * Math.cos(a + AW), ey - AL * Math.sin(a + AW));
  ctx.stroke();
}
function drawVertex(ctx, x, y, label) {
  ctx.beginPath();
  ctx.arc(x, y, VR, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.stroke();

  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
}
function drawDirected() {
  var canvas = document.getElementById('canvas-dir');
  var ctx = canvas.getContext('2d');
  var pos = getPositions(canvas.width, canvas.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (Adir[i][j] !== 1) continue;
      if (Adir[j][i] === 1) {
        drawCurvedArrow(ctx, pos[i].x, pos[i].y, pos[j].x, pos[j].y, 30);
      } else {
        drawArrow(ctx, pos[i].x, pos[i].y, pos[j].x, pos[j].y);
      }
    }
  }

  for (var i = 0; i < N; i++) {
    drawVertex(ctx, pos[i].x, pos[i].y, i + 1);
  }
}
function drawUndirected() {
  var canvas = document.getElementById('canvas-undir');
  var ctx = canvas.getContext('2d');
  var pos = getPositions(canvas.width, canvas.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (var i = 0; i < N; i++) {
    for (var j = i + 1; j < N; j++) {
      if (Aundir[i][j] !== 1) continue;
      var dx = pos[j].x - pos[i].x, dy = pos[j].y - pos[i].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      ctx.beginPath();
      ctx.moveTo(pos[i].x + dx / len * VR, pos[i].y + dy / len * VR);
      ctx.lineTo(pos[j].x - dx / len * VR, pos[j].y - dy / len * VR);
      ctx.stroke();
    }
  }

  for (var i = 0; i < N; i++) {
    drawVertex(ctx, pos[i].x, pos[i].y, i + 1);
  }
}
function renderMatrix(id, mat) {
  var el = document.getElementById(id);
  var html = '';
  for (var i = 0; i < N; i++) {
    html += mat[i].join(' ') + '<br>';
  }
  el.innerHTML = html;
}
drawDirected();
drawUndirected();
renderMatrix('mat-dir', Adir);
renderMatrix('mat-undir', Aundir);