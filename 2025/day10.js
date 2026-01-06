require('dotenv').config();
let fetchData = require('../fetchData');
const solver = require('javascript-lp-solver');

async function main() {
  try {
    let day = 10;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      function patternToBits(pattern) {
        let bits = 0;
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] === '#') {
            bits += Math.pow(2, i);
          }
        }
        return bits;
      }

      function buttonToBits(buttonStr) {
        let indices = buttonStr
          .slice(1, -1)
          .split(',')
          .map((x) => parseInt(x));
        let bits = 0;
        for (let idx of indices) {
          bits += Math.pow(2, idx);
        }
        return bits;
      }

      let ans = 0;
      let lines = data.trim().split('\n');

      for (let line of lines) {
        let words = line.split(/\s+/);
        let goalPattern = words[0].slice(1, -1);
        let goalBits = patternToBits(goalPattern);
        let buttons = words.slice(1, -1);

        let buttonBits = [];
        for (let button of buttons) {
          buttonBits.push(buttonToBits(button));
        }

        let minPresses = buttons.length;
        let numCombinations = Math.pow(2, buttons.length);

        for (let combo = 0; combo < numCombinations; combo++) {
          let resultBits = 0;
          let presses = 0;

          for (let i = 0; i < buttons.length; i++) {
            if ((combo >> i) & 1) {
              resultBits ^= buttonBits[i];
              presses++;
            }
          }

          if (resultBits === goalBits) {
            minPresses = Math.min(minPresses, presses);
          }
        }

        ans += minPresses;
      }

      return ans;
    }

    // Part 2
    function solvePart2(data) {
      function parseList(str) {
        return str
          .slice(1, -1)
          .split(',')
          .map((x) => parseInt(x));
      }

      let ans = 0;
      let lines = data.trim().split('\n');

      for (let line of lines) {
        let words = line.split(/\s+/);
        let buttons = words.slice(1, -1);
        let joltageTargets = parseList(words[words.length - 1]);

        let buttonCounters = [];
        for (let button of buttons) {
          buttonCounters.push(parseList(button));
        }

        let model = {
          optimize: 'total',
          opType: 'min',
          constraints: {},
          variables: {},
          ints: {},
        };

        for (let j = 0; j < buttons.length; j++) {
          let varName = `B${j}`;
          model.variables[varName] = { total: 1 };
          model.ints[varName] = 1;
        }

        for (let i = 0; i < joltageTargets.length; i++) {
          let constraintName = `pos${i}`;
          let target = joltageTargets[i];

          for (let j = 0; j < buttons.length; j++) {
            if (buttonCounters[j].includes(i)) {
              model.variables[`B${j}`][constraintName] = 1;
            }
          }

          model.constraints[constraintName] = { equal: target };
        }

        let result = solver.Solve(model);

        if (result.feasible) {
          let presses = 0;
          for (let j = 0; j < buttons.length; j++) {
            if (result[`B${j}`]) {
              presses += result[`B${j}`];
            }
          }
          ans += presses;
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
