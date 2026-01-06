require('dotenv').config();
let fetchData = require('../fetchData');

async function main() {
  try {
    let day = 11;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let lines = data.split('\n').filter((line) => line.trim() !== '');
      let graph = {};
      for (let line of lines) {
        let [device, outputs] = line.split(':').map((s) => s.trim());
        graph[device] = outputs.split(' ').filter((s) => s.trim() !== '');
      }

      function dfs(node, visited) {
        if (node === 'out') {
          return 1;
        }

        if (visited.has(node)) {
          return 0;
        }

        visited.add(node);
        let count = 0;

        if (graph[node]) {
          for (let neighbor of graph[node]) {
            count += dfs(neighbor, visited);
          }
        }

        visited.delete(node);
        return count;
      }

      let ans = dfs('you', new Set());
      return ans;
    }

    // Part 2
    function solvePart2(data) {
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let graph = {};
      for (let line of lines) {
        let [device, outputs] = line.split(':').map((s) => s.trim());
        graph[device] = outputs.split(' ').filter((s) => s.trim() !== '');
      }

      let memo = new Map();

      function dfs(node, hasDac, hasFft) {
        let memoKey = `${node},${hasDac},${hasFft}`;
        if (memo.has(memoKey)) {
          return memo.get(memoKey);
        }

        if (node === 'out') {
          let result = hasDac && hasFft ? 1 : 0;
          memo.set(memoKey, result);
          return result;
        }

        let newHasDac = hasDac || node === 'dac';
        let newHasFft = hasFft || node === 'fft';

        let count = 0;

        if (graph[node]) {
          for (let neighbor of graph[node]) {
            count += dfs(neighbor, newHasDac, newHasFft);
          }
        }

        memo.set(memoKey, count);
        return count;
      }

      let ans = dfs('svr', false, false);
      return ans;
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
