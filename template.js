require('dotenv').config();
const fetchData = require('./fetchData');

async function main() {
  try {
    const day = 0;
    const year = 2024;

    // Get the input data
    const input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      const lines = data.split('\n').filter((line) => line.trim() !== '');

      // Your solution for part 1 here

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      const lines = data.split('\n').filter((line) => line.trim() !== '');

      // Your solution for part 2 here

      return ans;
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
