// for this problem input like this, with border made out of nines

// 9 9 9 9 9
// 9 1 2 3 9                    1 2 3
// 9 5 4 1 9  is identical as   5 4 1 but it can reduce the code
// 9 2 3 3 9                    2 3 3
// 9 9 9 9 9

// Without that trick with 9 loop code for 1 part would look like this

// for (let y = 0; y < yLen; y++) {
//   for (let x = 0; x < xLen; x++) {
//     const point = parsed[y][x];
//
//     // first row
//     if (y === 0) {
//       if (x === 0) {
//         // Left corner
//         if (point < parsed[y][x + 1] && point < parsed[y + 1][x]) points.push(point);
//       } else if (x === xLen - 1) {
//         // Right corner
//         if (point < parsed[y][x - 1] && point < parsed[y + 1][x]) points.push(point);
//       } else {
//         // Center
//         if (point < parsed[y][x + 1] && point < parsed[y + 1][x] && point < parsed[y][x - 1]) points.push(point);
//       }
//
//       // Last row
//     } else if (y === yLen - 1) {
//       if (x === 0) {
//         // Left corner
//         if (point < parsed[y][x + 1] && point < parsed[y - 1][x]) points.push(point);
//       } else if (x === xLen - 1) {
//         // Right corner
//         if (point < parsed[y][x - 1] && point < parsed[y - 1][x]) points.push(point);
//       } else {
//         // Center
//         if (point < parsed[y][x + 1] && point < parsed[y - 1][x] && point < parsed[y][x - 1]) points.push(point);
//       }
//
//       // Any other row
//     } else {
//       if (x === 0) {
//         // Left border
//         if (point < parsed[y - 1][x] && point < parsed[y + 1][x] && point < parsed[y][x + 1]) points.push(point);
//       } else if (x === xLen - 1) {
//         //Right border
//         if (point < parsed[y - 1][x] && point < parsed[y + 1][x] && point < parsed[y][x - 1]) points.push(point);
//       } else {
//         // Center point
//         if (point < parsed[y - 1][x] && point < parsed[y + 1][x] && point < parsed[y][x - 1] && point < parsed[y][x + 1]) points.push(point);
//       }
//     }
//   }
// }

import * as fs from 'fs';

let measurements: string[] = [];

try {
  measurements = fs
    .readFileSync('input.txt', 'utf8')
    .split('\n');

} catch (e) {
  console.error(e);
  process.exit(1);
}

// Extra line at the end of the input
if (measurements[measurements.length - 1] === '') measurements.pop();

const xLen = measurements[0].length;
const yLen = measurements.length;

const inputWithNines = measurements
  .map(row => row.split('').map(Number))
  .map((row) => [9, ...row, 9]);

const parsed = [
  Array.from(new Array(xLen + 2)).fill(9),
  ...inputWithNines,
  Array.from(new Array(xLen + 2)).fill(9)
];

const first = () => {
  const minimums: number[] = [];

  for (let row = 1; row <= yLen; row++) {
    for (let col = 1; col <= xLen; col++) {
      const point = parsed[row][col];
      if (point < parsed[row - 1][col] && point < parsed[row + 1][col] && point < parsed[row][col - 1] && point < parsed[row][col + 1]) {
        minimums.push(point);
      }
    }
  }

  const result = minimums.length + minimums.reduce<number>((acc, val) => acc += val, 0);
  console.log('First: ', result);
};

// Unfortunately JS doesn't have a tuples yet, so I could not use simple Set().
// In JS set can hold two identical arrays, because their references are different
// so I wrote this simple CustomSet class which gives me possibility to treat arrays
// with the same values on the same indexes as if they were the same array (like tuples)
type RowColPair = [row: number, col: number];

class CustomSet {
  constructor(private readonly inputs: {[key: number]: RowColPair} = {}) { }

  public add([row, col]: RowColPair): undefined {
    const hashLike = row * 100000000 + col;
    if (hashLike in this.inputs) return;
    this.inputs[hashLike] = [row, col];
  };

  public has([row, col]: RowColPair): boolean {
    const hashLike = row * 100000000 + col;
    return hashLike in this.inputs;
  };
}

const second = () => {
  const minimums: Array<RowColPair> = [];

  for (let row = 1; row <= yLen; row++) {
    for (let col = 1; col <= xLen; col++) {
      const point = parsed[row][col];
      if (point < parsed[row - 1][col] && point < parsed[row + 1][col] && point < parsed[row][col - 1] && point < parsed[row][col + 1]) {
        minimums.push([row, col]);
      }
    }
  }

  const idMatrix = Array.from(new Array(yLen + 2)).map(() => Array.from(new Array(xLen + 2)).fill(0));
  let basinId = 1;

  minimums.forEach(([row, col]) => {
    const stack = [[row, col]];
    const visited = new CustomSet();

    while (stack.length) {
      const [row, col] = stack.pop() as number[];
      const point = parsed[row][col];

      if (
        visited.has([row, col]) ||
        point === 9
      ) continue;

      visited.add([row, col]);
      idMatrix[row][col] = basinId;
      stack.push([row, col + 1], [row, col - 1], [row + 1, col], [row - 1, col]);
    }

    basinId++;
  });

  const result = Object
    .values(
      idMatrix
        .flat()
        .reduce<{[key: number]: number}>((acc, val) => {
          if (!val) return acc;
          if (val in acc) {
            acc[val] += 1
          } else {
            acc[val] = 1;
          }
          return acc;
        }, {}))
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce<number>((acc, val) => acc *= val, 1);

  console.log('Second: ', result);
};

first();
second();
