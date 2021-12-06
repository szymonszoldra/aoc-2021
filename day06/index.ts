import * as fs from 'fs';

const AFTER_RESET = 6;
const NEW_FISH = 8;

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
  let currentPopulation = [...measurements];
  let newPopulation: number[] = [];

  const TOTAL_DAYS = 80;

  for (let i = 0; i < TOTAL_DAYS; i++) {
    currentPopulation = currentPopulation.map(age => {
      if (age === 0) {
        newPopulation.push(NEW_FISH);
        return AFTER_RESET;
      } else {
        return age - 1;
      }
    });
    currentPopulation = currentPopulation.concat(newPopulation);
    newPopulation = [];
  }

  console.log('First: ', currentPopulation.length);
};

// Bruteforce won't work for TOTAL_DAYS = 256
// "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory"
const second = () => {
  const population: {[key: number]: number} = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
  };

  measurements.forEach((fish) => population[fish]++);

  const TOTAL_DAYS = 256;

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const cache = { ...population };
    Object
      .keys(population)
      .slice(0, 8)
      .reverse()
      .map(Number)
      .forEach(key => {
        if (key === 0) {
          population[NEW_FISH] = cache[0];
          population[AFTER_RESET] += cache[0];
          population[0] = cache[1];
        }  else {
          population[key] = cache[key + 1];
        }
    });
  }

  const populationLength = Object.values(population).reduce<number>((acc, val) => acc += val, 0);
  console.log('Second: ', populationLength);
};

first();
second();
