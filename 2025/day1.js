require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 1;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let dial = 50;

      for (let l of lines) {
        let dir = l[0],
          dist = parseInt(l.slice(1));
        if (dir === 'L') {
          dial = (dial - dist + 100) % 100;
        } else {
          dial = (dial + dist) % 100;
        }
        if (dial === 0) {
          ans++;
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let dial = 50;

      for (let l of lines) {
        let dir = l[0],
          dist = parseInt(l.slice(1));

        for (let i = 0; i < dist; i++) {
          if (dir === 'L') {
            dial = (dial - 1 + 100) % 100;
          } else {
            dial = (dial + 1) % 100;
          }
          if (dial === 0) {
            ans++;
          }
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
