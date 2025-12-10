require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 4;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let grid = lines.map((line) => line.split(''));
      let rows = grid.length,
        cols = grid[0].length;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] === '@') {
            let adjacent = 0;

            for (let [di, dj] of directions) {
              let ni = i + di;
              let nj = j + dj;

              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                if (grid[ni][nj] === '@') {
                  adjacent++;
                }
              }
            }

            if (adjacent < 4) {
              ans++;
            }
          }
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let grid = lines.map((line) => line.split(''));
      let rows = grid.length,
        cols = grid[0].length;

      function count(grid, i, j) {
        let res = 0;

        for (let [di, dj] of directions) {
          let ni = i + di;
          let nj = j + dj;

          if (
            ni >= 0 &&
            ni < rows &&
            nj >= 0 &&
            nj < cols &&
            grid[ni][nj] === '@'
          ) {
            res++;
          }
        }

        return res;
      }

      while (true) {
        let remove = 0;
        let toRemove = [];

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '@') {
              let adjacent = count(grid, i, j);
              if (adjacent < 4) {
                toRemove.push([i, j]);
              }
            }
          }
        }

        for (let [i, j] of toRemove) {
          grid[i][j] = '.';
          remove++;
        }

        ans += remove;

        if (!remove) {
          break;
        }
      }

      return ans;
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
