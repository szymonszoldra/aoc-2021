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

let tempArr = [...measurements];

const numbers = tempArr.shift()!.split(',').map(parseFloat);
tempArr = tempArr.filter(value => value !== '').reverse();

const bingoBoards: number[][] = Array.from(new Array(tempArr.length / 5))
  .map(() => [tempArr.pop()!, tempArr.pop()!, tempArr.pop()!, tempArr.pop()!, tempArr.pop()!].map((num) => num.trim()))
  .map(elements => elements.join(' ').split(/\s+/).map(parseFloat));

const lookForBingo = (arr: number[], numbers: number[]): boolean => {
  for (let i = 0, j = i / 5; i <= 20; i += 5) {
    const horizontal = [arr[i], arr[i + 1], arr[i + 2], arr[i + 3], arr[i + 4]];
    const vertical = [arr[j], arr[j + 5], arr[j + 10], arr[j + 15], arr[j + 20]];
    if (
      vertical.every(num => numbers.includes(num)) ||
      horizontal.every(num => numbers.includes(num))
    ) {
      return true;
    }
  }
  return false;
}

const first = () => {
  const visitedNumbers: number[] = [];

  for (const number of numbers) {
    visitedNumbers.push(number);

    for (const board of bingoBoards) {
      const found = lookForBingo(board, visitedNumbers);

      if (found) {
        const sum = board
          .filter(number => !visitedNumbers.includes(number))
          .reduce((acc, val) => acc += val, 0);

        return console.log('First: ', sum * number);
      }
    }
  }
};

const second = () => {
  let boardsLeft = [...bingoBoards].map((board, index) => ({ index, board }));

  let lastWon: number[] = [];
  let numbersWhileLastWon: number[] = [];

  const visitedNumbers: number[] = [];
  let indexesToRemove: number[] = [];

  for (const number of numbers) {
    visitedNumbers.push(number);

    if (indexesToRemove.length) {
      boardsLeft = boardsLeft.filter((boards) => !indexesToRemove.includes(boards.index));
    }
    indexesToRemove = [];

    for (const { board, index } of boardsLeft) {
      const found = lookForBingo(board, visitedNumbers);

      if (found) {
        lastWon = [...board];
        numbersWhileLastWon = [...visitedNumbers];
        indexesToRemove.push(index);
      }
    }
  }

  const sum = lastWon
    .filter(number => !numbersWhileLastWon.includes(number))
    .reduce((acc, val) => acc += val, 0);

  return console.log('Second: ', sum * numbersWhileLastWon[numbersWhileLastWon.length - 1]);
};

first();
second();
