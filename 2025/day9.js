require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 9;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let tiles = lines.map((line) => {
        let [x, y] = line.split(',').map(Number);
        return { x, y };
      });

      for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
          let width = Math.abs(tiles[i].x - tiles[j].x) + 1;
          let height = Math.abs(tiles[i].y - tiles[j].y) + 1;
          let area = width * height;
          ans = Math.max(ans, area);
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let redTiles = lines.map((line) => {
        let [x, y] = line.split(',').map(Number);
        return { x, y };
      });

      let redSet = new Set(redTiles.map((t) => `${t.x},${t.y}`));

      let greenSet = new Set();

      for (let i = 0; i < redTiles.length; i++) {
        let curr = redTiles[i];
        let next = redTiles[(i + 1) % redTiles.length];

        if (curr.x === next.x) {
          let minY = Math.min(curr.y, next.y);
          let maxY = Math.max(curr.y, next.y);
          for (let y = minY + 1; y < maxY; y++) {
            greenSet.add(`${curr.x},${y}`);
          }
        } else if (curr.y === next.y) {
          let minX = Math.min(curr.x, next.x);
          let maxX = Math.max(curr.x, next.x);
          for (let x = minX + 1; x < maxX; x++) {
            greenSet.add(`${x},${curr.y}`);
          }
        }
      }

      function isValidTile(x, y) {
        let key = `${x},${y}`;
        if (redSet.has(key) || greenSet.has(key)) return true;
        return isInsidePolygon(x, y, redTiles);
      }

      function orientation(px, py, qx, qy, rx, ry) {
        let val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
        if (val === 0) return 0;
        return val > 0 ? 1 : -1;
      }

      function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        let o1 = orientation(x1, y1, x2, y2, x3, y3);
        let o2 = orientation(x1, y1, x2, y2, x4, y4);
        let o3 = orientation(x3, y3, x4, y4, x1, y1);
        let o4 = orientation(x3, y3, x4, y4, x2, y2);

        return o1 * o2 < 0 && o3 * o4 < 0;
      }

      function isRectangleValid(minX, maxX, minY, maxY) {
        if (
          !isValidTile(minX, minY) ||
          !isValidTile(minX, maxY) ||
          !isValidTile(maxX, minY) ||
          !isValidTile(maxX, maxY)
        ) {
          return false;
        }

        let rectEdges = [
          [minX, minY, maxX, minY],
          [maxX, minY, maxX, maxY],
          [maxX, maxY, minX, maxY],
          [minX, maxY, minX, minY],
        ];

        for (let i = 0; i < redTiles.length; i++) {
          let curr = redTiles[i];
          let next = redTiles[(i + 1) % redTiles.length];

          for (let rectEdge of rectEdges) {
            if (
              segmentsIntersect(
                curr.x,
                curr.y,
                next.x,
                next.y,
                rectEdge[0],
                rectEdge[1],
                rectEdge[2],
                rectEdge[3]
              )
            ) {
              return false;
            }
          }
        }

        return true;
      }

      let candidates = [];
      for (let i = 0; i < redTiles.length; i++) {
        for (let j = i + 1; j < redTiles.length; j++) {
          let t1 = redTiles[i];
          let t2 = redTiles[j];

          let minRectX = Math.min(t1.x, t2.x);
          let maxRectX = Math.max(t1.x, t2.x);
          let minRectY = Math.min(t1.y, t2.y);
          let maxRectY = Math.max(t1.y, t2.y);

          let width = maxRectX - minRectX + 1;
          let height = maxRectY - minRectY + 1;
          let area = width * height;

          candidates.push({
            i,
            j,
            minRectX,
            maxRectX,
            minRectY,
            maxRectY,
            area,
          });
        }
      }

      candidates.sort((a, b) => b.area - a.area);

      let checked = 0;

      for (let cand of candidates) {
        if (ans > 0 && cand.area <= ans) {
          break;
        }

        checked++;
        if (checked === 1 || checked % 100 === 0) {
        }

        if (
          isRectangleValid(
            cand.minRectX,
            cand.maxRectX,
            cand.minRectY,
            cand.maxRectY
          )
        ) {
          ans = cand.area;
          break;
        }
      }

      return ans;
    }

    // Helper function: Ray casting algorithm for point-in-polygon test
    function isInsidePolygon(x, y, polygon) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x,
          yi = polygon[i].y;
        let xj = polygon[j].x,
          yj = polygon[j].y;

        let intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
