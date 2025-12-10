require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 5;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let [a, b] = data.split('\n\n');
      let ranges = a
        .split('\n')
        .map((r) => r.split('-').map(Number))
        .sort((r1, r2) => r1[0] - r2[0] || r1[1] - r2[1]);
      let ingredients = b.split('\n').map(Number);

      for (let i of ingredients) {
        let check = false;
        for (let r of ranges) {
          let [start, end] = r;
          if (start <= i && i <= end) {
            check = true;
            break;
          }
        }

        if (check) ans++;
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let [a, b] = data.split('\n\n');
      let ranges = a
        .split('\n')
        .map((r) => r.split('-').map(Number))
        .sort((r1, r2) => r1[0] - r2[0] || r1[1] - r2[1])
        .reduce((acc, r) => {
          if (acc.length && r[0] <= acc[acc.length - 1][1] + 1)
            acc[acc.length - 1][1] = Math.max(acc[acc.length - 1][1], r[1]);
          else acc.push(r);
          return acc;
        }, []);

      for (let r of ranges) {
        let [start, end] = r;
        ans += end - start + 1;
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
