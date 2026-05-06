var n3 = 1, n4 = 0;
var SEED = 5410;
var N = 10 + n3;
var VR = 18;

var seed = SEED;
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

var k1 = 1.0 - n3 * 0.01 - n4 * 0.01 - 0.3;

seed = SEED;
var Adir = [];
for (var i = 0; i < N; i++) {
  Adir[i] = [];
  for (var j = 0; j < N; j++) {
    var val = rand() * 2.0 * k1;
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

var k2 = 1.0 - n3 * 0.005 - n4 * 0.005 - 0.27;

seed = SEED;
var Adir2 = [];
for (var i = 0; i < N; i++) {
  Adir2[i] = [];
  for (var j = 0; j < N; j++) {
    var val2 = rand() * 2.0 * k2;
    Adir2[i][j] = (i !== j && val2 >= 1.0) ? 1 : 0;
  }
}

function getPositions(W, H, n) {
  var cx = W / 2, cy = H / 2;
  var r = Math.min(cx, cy) * 0.78;
  var pos = [];
  for (var i = 0; i < n; i++) {
    var angle = (2 * Math.PI * i / n) - Math.PI / 2;
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

function drawDirectedGraph(canvasId, A, n) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  var pos = getPositions(canvas.width, canvas.height, n);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (A[i][j] !== 1) continue;
      if (A[j][i] === 1) {
        drawCurvedArrow(ctx, pos[i].x, pos[i].y, pos[j].x, pos[j].y, 30);
      } else {
        drawArrow(ctx, pos[i].x, pos[i].y, pos[j].x, pos[j].y);
      }
    }
  }
  for (var i = 0; i < n; i++) {
    drawVertex(ctx, pos[i].x, pos[i].y, i + 1);
  }
}

function drawUndirectedGraph(canvasId, A, n) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  var pos = getPositions(canvas.width, canvas.height, n);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      if (A[i][j] !== 1) continue;
      var dx = pos[j].x - pos[i].x, dy = pos[j].y - pos[i].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      ctx.beginPath();
      ctx.moveTo(pos[i].x + dx / len * VR, pos[i].y + dy / len * VR);
      ctx.lineTo(pos[j].x - dx / len * VR, pos[j].y - dy / len * VR);
      ctx.stroke();
    }
  }
  for (var i = 0; i < n; i++) {
    drawVertex(ctx, pos[i].x, pos[i].y, i + 1);
  }
}

function renderMatrix(id, mat, n) {
  var el = document.getElementById(id);
  var lines = [];
  for (var i = 0; i < n; i++) {
    lines.push(mat[i].join(' '));
  }
  el.innerHTML = lines.join('<br>');
}

function matMul(A, B, n) {
  var C = [];
  for (var ii = 0; ii < n; ii++) {
    C[ii] = [];
    for (var jj = 0; jj < n; jj++) {
      var s = 0;
      for (var kk = 0; kk < n; kk++) s += A[ii][kk] * B[kk][jj];
      C[ii][jj] = s;
    }
  }
  return C;
}

function matBool(A, n) {
  var B = [];
  for (var ii = 0; ii < n; ii++) {
    B[ii] = [];
    for (var jj = 0; jj < n; jj++) B[ii][jj] = A[ii][jj] > 0 ? 1 : 0;
  }
  return B;
}

function computeDegrees() {
  var thead = '<tr><th>Вершина</th>';
  for (var i = 1; i <= N; i++) thead += '<th>' + i + '</th>';
  thead += '</tr>';
  var rowOut = '<tr><td>d⁺(out)</td>';
  var rowIn  = '<tr><td>d⁻(in)</td>';
  var rowUn  = '<tr><td>d(undir)</td>';
  var allDeg = [];
  for (var j = 0; j < N; j++) {
    var dout = 0, din = 0, dun = 0;
    for (var i = 0; i < N; i++) {
      dout += Adir[j][i];
      din  += Adir[i][j];
      dun  += Aundir[j][i];
    }
    rowOut += '<td>' + dout + '</td>';
    rowIn  += '<td>' + din  + '</td>';
    rowUn  += '<td>' + dun  + '</td>';
    allDeg.push(dun);
  }
  rowOut += '</tr>'; rowIn += '</tr>'; rowUn += '</tr>';
  document.getElementById('degrees-table').innerHTML =
    '<table>' + thead + rowOut + rowIn + rowUn + '</table>';

  var isReg = allDeg.every(function(d) { return d === allDeg[0]; });
  document.getElementById('regularity').textContent =
    isReg ? 'Однорідний (регулярний), степінь: ' + allDeg[0] : 'Неоднорідний (нерегулярний)';

  var hanging = [], isolated = [];
  for (var j = 0; j < N; j++) {
    if (allDeg[j] === 1) hanging.push(j + 1);
    if (allDeg[j] === 0) isolated.push(j + 1);
  }
  document.getElementById('hanging').textContent  = hanging.length  ? hanging.join(', ')  : 'відсутні';
  document.getElementById('isolated').textContent = isolated.length ? isolated.join(', ') : 'відсутні';
}

function computeDegrees2() {
  var thead = '<tr><th>Вершина</th>';
  for (var i = 1; i <= N; i++) thead += '<th>' + i + '</th>';
  thead += '</tr>';
  var rowOut = '<tr><td>d⁺(out)</td>';
  var rowIn  = '<tr><td>d⁻(in)</td>';
  for (var j = 0; j < N; j++) {
    var dout = 0, din = 0;
    for (var i = 0; i < N; i++) {
      dout += Adir2[j][i];
      din  += Adir2[i][j];
    }
    rowOut += '<td>' + dout + '</td>';
    rowIn  += '<td>' + din  + '</td>';
  }
  rowOut += '</tr>'; rowIn += '</tr>';
  document.getElementById('degrees-table2').innerHTML =
    '<table>' + thead + rowOut + rowIn + '</table>';
}

function findPaths(A2bool, A3bool) {
  var p2 = [], p3 = [];
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (i !== j && A2bool[i][j] === 1) {
        for (var m = 0; m < N; m++) {
          if (m !== i && m !== j && Adir2[i][m] === 1 && Adir2[m][j] === 1) {
            p2.push((i+1) + ' \u2192 ' + (m+1) + ' \u2192 ' + (j+1));
          }
        }
      }
      if (i !== j && A3bool[i][j] === 1) {
        for (var m = 0; m < N; m++) {
          if (Adir2[i][m] === 1 && m !== i) {
            for (var l = 0; l < N; l++) {
              if (Adir2[m][l] === 1 && Adir2[l][j] === 1 && l !== m && l !== i) {
                p3.push((i+1) + ' \u2192 ' + (m+1) + ' \u2192 ' + (l+1) + ' \u2192 ' + (j+1));
              }
            }
          }
        }
      }
    }
  }
  var p2u = p2.filter(function(v, idx, arr) { return arr.indexOf(v) === idx; });
  var p3u = p3.filter(function(v, idx, arr) { return arr.indexOf(v) === idx; });
  document.getElementById('paths2').innerHTML = p2u.join('<br>');
  document.getElementById('paths2-count').textContent = 'Всього: ' + p2u.length;
  document.getElementById('paths3').innerHTML = p3u.join('<br>');
  document.getElementById('paths3-count').textContent = 'Всього: ' + p3u.length;
}

function computeReachability() {
  var R = [];
  for (var i = 0; i < N; i++) {
    R[i] = Adir2[i].slice();
    R[i][i] = 1;
  }
  for (var kk = 0; kk < N; kk++) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        if (R[i][kk] && R[kk][j]) R[i][j] = 1;
      }
    }
  }
  return R;
}

function computeStrongMatrix(R) {
  var S = [];
  for (var i = 0; i < N; i++) {
    S[i] = [];
    for (var j = 0; j < N; j++) {
      S[i][j] = (R[i][j] === 1 && R[j][i] === 1) ? 1 : 0;
    }
  }
  return S;
}

function findSCCs(S) {
  var visited = [];
  for (var i = 0; i < N; i++) visited[i] = false;
  var comps = [];
  for (var i = 0; i < N; i++) {
    if (!visited[i]) {
      var comp = [];
      for (var j = 0; j < N; j++) {
        if (S[i][j] === 1) {
          comp.push(j);
          visited[j] = true;
        }
      }
      comps.push(comp);
    }
  }
  return comps;
}

function drawCondensation(sccs) {
  var nc = sccs.length;
  var canvas = document.getElementById('canvas-cond');
  var ctx = canvas.getContext('2d');
  var pos = getPositions(canvas.width, canvas.height, nc);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var condEdges = [];
  for (var ci = 0; ci < nc; ci++) {
    for (var cj = 0; cj < nc; cj++) {
      if (ci === cj) continue;
      var found = false;
      for (var a = 0; a < sccs[ci].length && !found; a++) {
        for (var b = 0; b < sccs[cj].length && !found; b++) {
          if (Adir2[sccs[ci][a]][sccs[cj][b]] === 1) found = true;
        }
      }
      if (found) condEdges.push([ci, cj]);
    }
  }

  var edgeHtml = '';
  for (var e = 0; e < condEdges.length; e++) {
    edgeHtml += 'C' + (condEdges[e][0]+1) + ' \u2192 C' + (condEdges[e][1]+1) + '<br>';
  }
  document.getElementById('cond-edges').innerHTML = edgeHtml || 'відсутні';

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  for (var e = 0; e < condEdges.length; e++) {
    var ci = condEdges[e][0], cj = condEdges[e][1];
    var back = false;
    for (var f = 0; f < condEdges.length; f++) {
      if (condEdges[f][0] === cj && condEdges[f][1] === ci) { back = true; break; }
    }
    if (back) {
      drawCurvedArrow(ctx, pos[ci].x, pos[ci].y, pos[cj].x, pos[cj].y, 30);
    } else {
      drawArrow(ctx, pos[ci].x, pos[ci].y, pos[cj].x, pos[cj].y);
    }
  }

  for (var ci = 0; ci < nc; ci++) {
    ctx.beginPath();
    ctx.arc(pos[ci].x, pos[ci].y, VR, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C' + (ci + 1), pos[ci].x, pos[ci].y);
  }
}

drawDirectedGraph('canvas-dir1', Adir, N);
drawUndirectedGraph('canvas-undir1', Aundir, N);
renderMatrix('mat-dir1', Adir, N);
renderMatrix('mat-undir1', Aundir, N);
computeDegrees();

drawDirectedGraph('canvas-dir2', Adir2, N);
renderMatrix('mat-dir2', Adir2, N);
computeDegrees2();

var A2 = matBool(matMul(Adir2, Adir2, N), N);
var A3 = matBool(matMul(A2, Adir2, N), N);
findPaths(A2, A3);

var Reach = computeReachability();
renderMatrix('mat-reach', Reach, N);

var Strong = computeStrongMatrix(Reach);
renderMatrix('mat-strong', Strong, N);

var sccs = findSCCs(Strong);
var sccsHtml = '';
for (var idx = 0; idx < sccs.length; idx++) {
  sccsHtml += 'C' + (idx+1) + ': {' + sccs[idx].map(function(v) { return v+1; }).join(', ') + '}<br>';
}
document.getElementById('sccs').innerHTML = sccsHtml;

drawCondensation(sccs);