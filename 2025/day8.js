require('dotenv').config();
let fetchData = require('../fetchData');

// Union-Find data structure ( copied from internet )
// https://en.wikipedia.org/wiki/Disjoint-set_data_structure
// https://www.geeksforgeeks.org/union-find-algorithm-set-2-union-by-rank/
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.numCircuits = n; // Initially, each box is its own circuit
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX === rootY) return false; // Already connected

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.numCircuits--; // We merged two circuits into one
    return true; // Successfully connected
  }

  getCircuitSizes() {
    let sizes = new Map();
    for (let i = 0; i < this.parent.length; i++) {
      let root = this.find(i);
      sizes.set(root, (sizes.get(root) || 0) + 1);
    }
    return Array.from(sizes.values());
  }

  getNumCircuits() {
    return this.numCircuits;
  }
}

function distance(box1, box2) {
  let dx = box1.x - box2.x;
  let dy = box1.y - box2.y;
  let dz = box1.z - box2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

async function main() {
  try {
    let day = 8;
    let year = 2025;

    // Get the input data
    let input = await fetchData(day, year);

    // Part 1
    function solvePart1(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let boxes = lines.map((line) => {
        let [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
      });

      let dist = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          let d = distance(boxes[i], boxes[j]);
          dist.push({ d, i, j });
        }
      }

      dist.sort((a, b) => a.d - b.d);

      let uf = new UnionFind(boxes.length);

      let check = 1000;
      let connections = 0;

      for (let { i, j } of dist) {
        if (connections >= check) break;
        uf.union(i, j);
        connections++;
      }

      let circuits = uf.getCircuitSizes();

      circuits.sort((a, b) => b - a);
      return circuits[0] * circuits[1] * circuits[2];
    }

    // Part 2
    function solvePart2(data) {
      let ans = 0;
      let lines = data.split('\n').filter((line) => line.trim() !== '');

      let boxes = lines.map((line) => {
        let [x, y, z] = line.split(',').map(Number);
        return { x, y, z };
      });

      let dist = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          let d = distance(boxes[i], boxes[j]);
          dist.push({ d, i, j });
        }
      }

      dist.sort((a, b) => a.d - b.d);

      let uf = new UnionFind(boxes.length);

      for (let { i, j } of dist) {
        uf.union(i, j);

        if (uf.getNumCircuits() === 1) {
          return boxes[i].x * boxes[j].x;
        }
      }

      return 0;
    }

    console.log('Part 1:', solvePart1(input));
    console.log('Part 2:', solvePart2(input));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
