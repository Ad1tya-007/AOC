require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 3;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      for (let l of lines) {
        let maxJoltage = 0;
        let nums = l.split('').map(Number);
        for (let i = 0; i < nums.length - 1; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            let joltage = nums[i] * 10 + nums[j];
            maxJoltage = Math.max(joltage, maxJoltage);
          }
        }

        ans += maxJoltage;
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = BigInt(0);
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      for (let l of lines) {
        let nums = l.split('').map(Number);
        let n = nums.length;
        let k = 12;

        let selected = [];
        let lastIndex = -1;

        for (let pos = 0; pos < k; pos++) {
          let start = lastIndex + 1;
          let end = n - k + pos;
          let maxDigit = -1;
          let maxIndex = -1;

          for (let i = start; i <= end; i++) {
            if (nums[i] > maxDigit) {
              maxDigit = nums[i];
              maxIndex = i;
            }
          }

          selected.push(maxDigit);
          lastIndex = maxIndex;
        }

        let joltage = BigInt(selected.join(''));
        ans += joltage;
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
