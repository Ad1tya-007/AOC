require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 2;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split(',').filter((line) => line.trim() !== '');
      let ranges = [];

      for (let l of lines) {
        let [a, b] = l.split('-').map(Number);
        ranges.push({ a: a, b: b });
      }

      function invalid(id) {
        let s = id.toString();

        if (s.length % 2 !== 0) return false;
        let half = s.length / 2;
        let firstHalf = s.substring(0, half);
        let secondHalf = s.substring(half);

        return firstHalf === secondHalf;
      }

      for (let r of ranges) {
        for (let i = r.a; i <= r.b; i++) {
          if (invalid(i)) {
            ans += i;
          }
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split(',').filter((line) => line.trim() !== '');
      let ranges = [];

      for (let l of lines) {
        let [a, b] = l.split('-').map(Number);
        ranges.push({ a: a, b: b });
      }

      function invalid(id) {
        let s = id.toString();
        let l = s.length;

        for (let n = 2; n <= l; n++) {
          if (l % n !== 0) continue;
          let partLen = l / n;
          let firstPart = s.substring(0, partLen);

          let check = true;
          for (let i = 1; i < n; i++) {
            let part = s.substring(i * partLen, (i + 1) * partLen);
            if (part !== firstPart) {
              check = false;
              break;
            }
          }

          if (check) return true;
        }

        return false;
      }

      for (let r of ranges) {
        for (let i = r.a; i <= r.b; i++) {
          if (invalid(i)) {
            ans += i;
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
