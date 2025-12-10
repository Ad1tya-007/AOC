require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 6;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let maxLength = Math.max(...lines.map((line) => line.length));
      let lastRow = lines.length - 1;

      let problems = [];
      let curr = null;

      for (let col = 0; col < maxLength; col++) {
        let hasContent = lines.some((line) => (line[col] || '').trim() !== '');
        if (hasContent) {
          curr = curr
            ? { ...curr, endCol: col }
            : { startCol: col, endCol: col };
        } else if (curr) {
          problems.push(curr);
          curr = null;
        }
      }
      if (curr) problems.push(curr);

      for (let { startCol, endCol } of problems) {
        let numbers = [];
        for (let row = 0; row < lastRow; row++) {
          let numStr = '';
          for (let col = startCol; col <= endCol; col++) {
            if ((lines[row][col] || '').trim()) numStr += lines[row][col];
          }
          let num = parseInt(numStr.trim());
          if (!isNaN(num)) numbers.push(num);
        }

        let op = lines[lastRow].slice(startCol, endCol + 1).match(/[+*]/)?.[0];
        if (numbers.length && op) {
          ans +=
            op === '+'
              ? numbers.reduce((a, b) => a + b, 0)
              : numbers.reduce((a, b) => a * b, 1);
        }
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let maxLength = Math.max(...lines.map((line) => line.length));
      let lastRow = lines.length - 1;

      let problems = [];
      let curr = null;

      for (let col = 0; col < maxLength; col++) {
        let hasContent = lines.some((line) => (line[col] || '').trim() !== '');
        if (hasContent) {
          curr = curr
            ? { ...curr, endCol: col }
            : { startCol: col, endCol: col };
        } else if (curr) {
          problems.push(curr);
          curr = null;
        }
      }
      if (curr) problems.push(curr);

      for (let { startCol, endCol } of problems) {
        let numbers = [];
        for (let col = endCol; col >= startCol; col--) {
          let numStr = '';
          for (let row = 0; row < lastRow; row++) {
            if ((lines[row][col] || '').trim()) numStr += lines[row][col];
          }
          let num = parseInt(numStr.trim());
          if (!isNaN(num)) numbers.push(num);
        }

        let op = lines[lastRow].slice(startCol, endCol + 1).match(/[+*]/)?.[0];
        if (numbers.length && op) {
          ans +=
            op === '+'
              ? numbers.reduce((a, b) => a + b, 0)
              : numbers.reduce((a, b) => a * b, 1);
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
