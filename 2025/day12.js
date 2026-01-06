require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 12;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let shapes = {};
      let i = 0;
      while (i < lines.length) {
        let line = lines[i];

        if (line.match(/^\d+:\s*$/) && !line.includes('x')) {
          let shapeIndex = parseInt(line.split(':')[0]);
          let shapeLines = [];
          i++;

          while (
            i < lines.length &&
            lines[i] &&
            !lines[i].includes('x') &&
            !lines[i].match(/^\d+:\s*$/)
          ) {
            shapeLines.push(lines[i]);
            i++;
          }
          shapes[shapeIndex] = shapeLines;
        } else {
          break;
        }
      }

      function rotate90(shape) {
        let rows = shape.length;
        let cols = shape[0].length;
        let rotated = [];
        for (let c = 0; c < cols; c++) {
          let row = '';
          for (let r = rows - 1; r >= 0; r--) {
            row += shape[r][c];
          }
          rotated.push(row);
        }
        return rotated;
      }

      function flip(shape) {
        return shape.map((row) => row.split('').reverse().join(''));
      }

      function getAllVariants(shape) {
        let variants = new Set();
        let current = shape;

        for (let rot = 0; rot < 4; rot++) {
          let key = current.join('\n');
          variants.add(key);
          current = rotate90(current);
        }

        current = flip(shape);
        for (let rot = 0; rot < 4; rot++) {
          let key = current.join('\n');
          variants.add(key);
          current = rotate90(current);
        }

        return Array.from(variants).map((v) => v.split('\n'));
      }

      let shapeVariants = {};
      for (let idx in shapes) {
        if (shapes[idx].length > 0) {
          shapeVariants[idx] = getAllVariants(shapes[idx]);
        }
      }

      let regions = [];
      while (i < lines.length) {
        let line = lines[i];
        if (line.includes('x') && line.includes(':')) {
          let parts = line.split(':');
          let dims = parts[0].split('x');
          let width = parseInt(dims[0]);
          let height = parseInt(dims[1]);
          let quantities = parts[1]
            .trim()
            .split(/\s+/)
            .filter((x) => x !== '')
            .map((x) => parseInt(x));
          if (!isNaN(width) && !isNaN(height)) {
            regions.push({ width, height, quantities });
          }
        }
        i++;
      }

      function getCells(shape, row, col) {
        let cells = [];
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === '#') {
              cells.push([row + r, col + c]);
            }
          }
        }
        return cells;
      }

      function countFilled(shape) {
        let count = 0;
        for (let r = 0; r < shape.length; r++) {
          for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === '#') count++;
          }
        }
        return count;
      }

      function canFit(region, shapeVariants) {
        let { width, height, quantities } = region;

        let shapesToPlace = [];
        for (let shapeIdx = 0; shapeIdx < quantities.length; shapeIdx++) {
          let shapeKey = String(shapeIdx);
          if (
            !shapeVariants[shapeKey] ||
            shapeVariants[shapeKey].length === 0
          ) {
            continue;
          }
          for (let count = 0; count < quantities[shapeIdx]; count++) {
            let size = countFilled(shapeVariants[shapeKey][0]);
            shapesToPlace.push({ id: shapeIdx, size });
          }
        }

        if (shapesToPlace.length === 0) return true;

        shapesToPlace.sort((a, b) => b.size - a.size);

        let occupied = new Set();

        function getKey(row, col) {
          return row * width + col;
        }

        function canPlace(shape, row, col) {
          for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
              if (shape[r][c] === '#') {
                let gridRow = row + r;
                let gridCol = col + c;
                if (
                  gridRow < 0 ||
                  gridCol < 0 ||
                  gridRow >= height ||
                  gridCol >= width ||
                  occupied.has(getKey(gridRow, gridCol))
                ) {
                  return false;
                }
              }
            }
          }
          return true;
        }

        function placeShape(shape, row, col) {
          let cells = getCells(shape, row, col);
          for (let [r, c] of cells) {
            occupied.add(getKey(r, c));
          }
          return cells;
        }

        function removeShape(cells) {
          for (let [r, c] of cells) {
            occupied.delete(getKey(r, c));
          }
        }

        let totalCellsNeeded = shapesToPlace.reduce(
          (sum, s) => sum + s.size,
          0
        );
        let totalCells = width * height;

        if (totalCellsNeeded > totalCells) {
          return false;
        }

        function backtrack(shapeIndex) {
          if (shapeIndex >= shapesToPlace.length) {
            return true;
          }

          let shapeId = shapesToPlace[shapeIndex].id;
          let variants = shapeVariants[String(shapeId)];

          if (!variants || variants.length === 0) {
            return false;
          }

          let remainingNeeded = 0;
          for (let i = shapeIndex; i < shapesToPlace.length; i++) {
            remainingNeeded += shapesToPlace[i].size;
          }

          let remainingAvailable = totalCells - occupied.size;
          if (remainingNeeded > remainingAvailable) {
            return false;
          }

          for (let variant of variants) {
            for (let row = 0; row <= height - variant.length; row++) {
              for (let col = 0; col <= width - variant[0].length; col++) {
                if (canPlace(variant, row, col)) {
                  let cells = placeShape(variant, row, col);
                  if (backtrack(shapeIndex + 1)) {
                    return true;
                  }
                  removeShape(cells);
                }
              }
            }
          }

          return false;
        }

        return backtrack(0);
      }

      let ans = 0;
      console.log(`Checking ${regions.length} regions...`);
      for (let i = 0; i < regions.length; i++) {
        let region = regions[i];
        let totalShapes = region.quantities.reduce((a, b) => a + b, 0);
        console.log(
          `Region ${i + 1}: ${region.width}x${
            region.height
          }, ${totalShapes} shapes`
        );

        if (canFit(region, shapeVariants)) {
          console.log(`  ✓ Region ${i + 1} can fit all shapes`);
          ans++;
        } else {
          console.log(`  ✗ Region ${i + 1} cannot fit all shapes`);
        }
      }

      return ans;
    }

    console.log('Part 1:', solvePart1(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
