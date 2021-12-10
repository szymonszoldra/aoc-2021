import * as fs from 'fs';

let measurements: string[][] = [];

try {
  measurements = fs
    .readFileSync('input.txt', 'utf8')
    .split('\n')
    .map(input => input.split(''));

  // Extra line at the end of the input
  if (measurements[measurements.length - 1].length === 0) measurements.pop();

} catch (e) {
  console.error(e);
  process.exit(1);
}

const tokens: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const first = () => {
  const values: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };

  const illegal: string[] = [];

  measurements.forEach(originalLine => {
    const line = [...originalLine];
    const stack: string[] = [line.shift()!];

    while (line.length) {
      const current = line.shift()!;
      if (current in tokens) {
        stack.push(current);
        continue;
      }

      if (current !== tokens[stack.pop()!]) {
        illegal.push(current);
        break;
      }
    }
  });
  const result = illegal.reduce<number>((acc, val) => acc += values[val]!, 0);
  console.log('First :', result);
};

const second = () => {
  const indexes: Record<number, boolean> = {};

  measurements.forEach((originalLine, index) => {
    const line = [...originalLine];
    const stack: string[] = [line.shift()!];

    let corruptedLine = false;

    while (line.length) {
      const current = line.shift()!;
      if (current in tokens) {
        stack.push(current);
        continue;
      }

      if (current !== tokens[stack.pop()!]) {
        corruptedLine = true;
        break;
      }
    }

    if (!corruptedLine) {
      indexes[index] = true;
    }
  });

  const validLines = measurements.filter((_, index) => index in indexes);

  const missingTokens: string[][] = [];

  validLines.forEach(line => {
    const stack: string[] = [line.shift()!];

    while (line.length) {
      const current = line.shift()!;
      if (current in tokens) {
        stack.push(current);
        continue;
      }

      const lastItem = stack[stack.length - 1];

      if (current === tokens[lastItem]) {
        stack.pop();
      }
    }

    missingTokens.push(stack.reverse().map(token => tokens[token]));
  });

  const values: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };

  const finalValues = missingTokens
    .map(tokens => tokens.reduce<number>((acc, val) => acc * 5 + values[val], 0))
    .sort((a, b) => a - b);

  const result = finalValues[Math.floor(finalValues.length / 2)];

  console.log('Second: ', result);
};

first();
second();
