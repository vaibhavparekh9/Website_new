// --- A* with Manhattan distance ---
function aStar(start, goal, gridWidth, gridHeight) {
  function h(pos) {
    return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
  }

  const openSet = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const key = (p) => `${p.x},${p.y}`;

  gScore[key(start)] = 0;
  fScore[key(start)] = h(start);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore[key(a)] ?? Infinity) - (fScore[key(b)] ?? Infinity));
    const current = openSet.shift();

    if (current.x === goal.x && current.y === goal.y) {
      const path = [current];
      let k = key(current);
      while (cameFrom[k]) {
        path.unshift(cameFrom[k]);
        k = key(cameFrom[k]);
      }
      return path;
    }

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x,     y: current.y + 1 },
      { x: current.x,     y: current.y - 1 },
    ].filter(n => n.x >= 0 && n.x < gridWidth && n.y >= 0 && n.y < gridHeight);

    for (const neighbor of neighbors) {
      const tentative = (gScore[key(current)] ?? Infinity) + 1;
      if (tentative < (gScore[key(neighbor)] ?? Infinity)) {
        cameFrom[key(neighbor)] = current;
        gScore[key(neighbor)] = tentative;
        fScore[key(neighbor)] = tentative + h(neighbor);
        if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return [];
}

// --- Animate dog along path ---
function moveDogTo(goalCell, onFinish) {
  const cols = window.gridCols;
  const rows = window.gridRows;
  const cs   = window.cellSizeGetter();

  const start = { x: window.dog_x, y: window.dog_y };
  const path = aStar(start, goalCell, cols, rows);
  if (!path.length) { if (onFinish) onFinish(); return; }

  let step = 0;

  function animate() {
    if (step < path.length) {
      // redraw background
      window.drawGridLines();

      // draw partial path in CMU red
      ctx.strokeStyle = "#C41230";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((start.x + 0.5) * cs, (start.y + 0.5) * cs);
      for (let i = 0; i <= step; i++) {
        ctx.lineTo((path[i].x + 0.5) * cs, (path[i].y + 0.5) * cs);
      }
      ctx.stroke();

      // advance dog by one grid cell
      window.dog_x = path[step].x;
      window.dog_y = path[step].y;

      window.drawDog(window.dog_x, window.dog_y);

      step++;
      requestAnimationFrame(animate);
    } else {
      if (onFinish) onFinish();
    }
  }
  animate();
}