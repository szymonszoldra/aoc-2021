import * as fs from 'fs';

let measurements: Array<[string, number]> = [];

try {
  measurements = fs
    .readFileSync('input.txt', 'utf8')
    .split('\n')
    .map((pair) => {
      const [direction, value] = pair.split(' ');
      return [direction, parseInt(value, 10)];
    });

} catch (e) {
  console.error(e);
  process.exit(1);
}

const first = () => {
  const { forward, depth } = measurements
    .reduce<{ forward: number, depth: number }>((acc, [direction, value]) => {
      switch (direction) {
        case 'up':
          acc.depth -= value;
          break;
        case 'down':
          acc.depth += value;
          break;
        case 'forward':
          acc.forward += value;
          break;
        default:
          break;
      }
      return acc;

    }, {
      forward: 0,
      depth: 0,
    });

  console.log('First: ', forward * depth);
};


const second = () => {
  const { forward, depth } = measurements
    .reduce<{ forward: number, depth: number, aim: number }>((acc, [direction, value]) => {
      switch (direction) {
        case 'up':
          acc.aim -= value;
          break;
        case 'down':
          acc.aim += value;
          break;
        case 'forward':
          acc.forward += value;
          acc.depth += acc.aim * value;
          break;
        default:
          break;
      }
      return acc;

    }, {
      forward: 0,
      depth: 0,
      aim: 0,
    });
  console.log('Second: ', forward * depth);
};

first();
second();
