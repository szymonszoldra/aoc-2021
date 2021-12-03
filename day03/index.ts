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

if (measurements[measurements.length - 1] === '') measurements.pop();

const first = () => {
  const len = measurements[0].length;

  const result = Array.from(new Array(len)).map((_, index) => {
    return measurements.reduce<number>((acc, val) => {
      return acc += parseInt(val[index], 10);
    }, 0);
  });

  const gammaBinary = parseInt(result.map(value => value > measurements.length / 2 ? 1 : 0).join(''), 2);
  const epsilonBinary = parseInt(result.map(value => value < measurements.length / 2 ? 1 : 0).join(''), 2);

  console.log('First: ', gammaBinary * epsilonBinary);
};

const second = () => {
  const getResult = (first: string, second: string) => {
    let tempArr = [...measurements];

    for (let i = 0; i <= measurements[0].length; i++) {
      if (tempArr.length === 1) {
        return parseInt(tempArr[0], 2);
      }

      if (i === measurements[0].length) {
        console.error('Input probably wrong!');
        process.exit(1);
      }

      const temp = tempArr.reduce<number>((acc, val) => {
        return acc += parseInt(val[i], 10);
      }, 0) >= tempArr.length / 2 ? first : second;

      tempArr = tempArr.filter(bytes => bytes[i] === temp);
    }
  }

  const oxygenGeneratorRating = getResult('1', '0')!;
  const CO2ScrubberRating = getResult('0', '1')!;

  console.log('Second: ', oxygenGeneratorRating * CO2ScrubberRating);
};

first();
second();
