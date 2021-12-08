import * as fs from 'fs';

let measurements: number[] = [];

try {
  measurements = fs
    .readFileSync('input.txt', 'utf8')
    .split(',')
    .map(Number);

} catch (e) {
  console.error(e);
  process.exit(1);
}

const first = () => {
  const min = Math.min(...measurements);
  const max = Math.max(...measurements);

  let result = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    result = Math.min(measurements.reduce<number>((acc, val) => acc += Math.abs(val - i), 0), result);
  }

  console.log('First: ', result);
};

const second = () => {
  const getFuel = (n: number): number => n * (n + 1) / 2;

  const min = Math.min(...measurements);
  const max = Math.max(...measurements);

  let result = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    result = Math.min(measurements.reduce<number>((acc, val) => acc += getFuel(Math.abs(val - i)), 0), result);
  }

  console.log('Second: ', result);
};

first();
second();
