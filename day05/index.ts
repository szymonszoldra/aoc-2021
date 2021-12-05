import * as fs from 'fs';

type Sizes = { xSize: number, ySize: number };
type Matrix = number[][];

let coords: Matrix = [];

try {
  coords = fs
    .readFileSync('input.txt', 'utf8')
    .split('\n')
    .map(input => {
      return input
        .split(' -> ')
        .flatMap(input => input.split(',').map(Number));
    });

} catch (e) {
  console.error(e);
  process.exit(1);
}

// debug
const printMatrix = (matrix: Matrix): void => {
  matrix.forEach(row => {
    console.log(row.join(' '));
  });
};

const getSizes = (validCoords: Matrix): Sizes => {
  return validCoords.reduce<Sizes>((acc, value) => {
    const [x1, y1, x2, y2] = value;
    acc.xSize = Math.max(acc.xSize, Math.max(x1, x2));
    acc.ySize = Math.max(acc.ySize, Math.max(y1, y2));
    return acc;
  }, { xSize: 0, ySize: 0 });
}

const getBoard = (xSize: number, ySize: number): Matrix => {
  return Array.from(new Array(ySize + 1)).map(() => Array.from(new Array(xSize + 1)).fill(0));
}

const first = () => {
  // only horizontal or vertical lines
  const validCoords = coords.filter(value => {
    const [x1, y1, x2, y2] = value;
    return (x1 === x2 || y1 === y2) && value.length === 4;
  });

  const { xSize, ySize } = getSizes(validCoords);
  const board = getBoard(xSize, ySize);

  validCoords.forEach((coords) => {
    const [x1, y1, x2, y2] = coords;
    const smallerX = Math.min(x1, x2);
    const smallerY = Math.min(y1, y2);
    const greaterX = Math.max(x1, x2);
    const greaterY = Math.max(y1, y2);

    for (let x = smallerX; x <= greaterX; x++) {
      for (let y = smallerY; y <= greaterY; y++) {
        board[y][x]++;
      }
    }
  });

  const len = board.flat().filter((value) => value > 1).length;
  console.log('First: ', len);
};

const second = () => {
  const validCoords = coords.filter(value => {
    const [x1, y1, x2, y2] = value;
    return value.length === 4;
  });

  const { ySize, xSize } = getSizes(validCoords);
  const board = getBoard(xSize, ySize);

  validCoords.forEach((coords) => {
    let [x1, y1, x2, y2] = coords;
    const smallerX = Math.min(x1, x2);
    const smallerY = Math.min(y1, y2);
    const greaterX = Math.max(x1, x2);
    const greaterY = Math.max(y1, y2);

    const a = greaterY - smallerY;
    const b = greaterX - smallerX;

    // horizontal or vertical, tgx === 1 -> angle 45*
    if (a/b !== 1) {
      for (let x = smallerX; x <= greaterX; x++) {
        for (let y = smallerY; y <= greaterY; y++) {
          board[y][x]++;
        }
      }
    } else {

      for (let _ = 0; _ <= a; _++) {
        board[y1][x1]++;
        y1 < y2 ? y1++ : y1--;
        x1 < x2 ? x1++ : x1--;
      }
    }
  });

  const len = board.flat().filter((value) => value > 1).length;
  console.log('Second: ', len);
};

first();
second();
