require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 7;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let grid = lines.map((line) => line.split(''));
      let rows = grid.length,
        cols = grid[0].length;
      let q = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] === 'S') {
            q.push({ i: i, j: j });
          }
        }
      }
      let visited = new Set();

      while (q.length) {
        let { i, j } = q.shift();
        for (let r = i + 1; r < rows; r++) {
          if (grid[r][j] === '^') {
            let key = `${r},${j}`;
            if (!visited.has(key)) {
              visited.add(key);
              ans++;

              if (j - 1 >= 0) {
                q.push({ i: r, j: j - 1 });
              }
              if (j + 1 < cols) {
                q.push({ i: r, j: j + 1 });
              }
            }
            break;
          }
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let grid = lines.map((line) => line.split(''));
      let rows = grid.length,
        cols = grid[0].length;
      let startCol = -1;
      for (let c = 0; c < cols; c++) {
        if (grid[0][c] === 'S') {
          startCol = c;
          break;
        }
      }

      let memo = new Map();

      function count(i, j) {
        let key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        for (let r = i + 1; r < rows; r++) {
          if (grid[r][j] === '^') {
            let res = 0;
            if (j - 1 >= 0) {
              res += count(r, j - 1);
            }
            if (j + 1 < cols) {
              res += count(r, j + 1);
            }

            if (res === 0) res = 1;

            memo.set(key, res);
            return res;
          }
        }
        memo.set(key, 1);
        return 1;
      }

      return count(0, startCol);
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
