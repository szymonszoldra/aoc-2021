import * as fs from 'fs';

let measurements: number[] = [];

try {
  measurements = fs
    .readFileSync('input.txt', 'utf8')
    .split('\n')
    .map(parseFloat);

} catch (e) {
  console.error(e);
  process.exit(1);
}

const first = () => {
  let counter = 0;

  for (let i = 1; i < measurements.length; i++) {
    if (measurements[i] > measurements[i - 1]) counter++;
  }

  console.log(`First: ${counter}`);
};

const second = () => {
  const triples: number[] = [];

  for (let i = 2; i < measurements.length; i++) {
    triples.push(measurements[i - 2] + measurements[i - 1] + measurements[i]);
  }

  let counter = 0;

  for (let i = 1; i < triples.length; i++) {
    if (triples[i] > triples[i - 1]) counter++;
  }

  console.log(`Second: ${counter}`);
};

first();
second();
