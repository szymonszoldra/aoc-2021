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

const first = () => {
  const uniqueLengths = { 2: true, 3: true, 4: true, 7: true };

  const result = measurements
    .map(pair => pair.split(' | ')[1])
    .filter(str => !!str) // filter nasty random nulls caused by IDE input format style
    .map(str => str.split(' '))
    .flat()
    .filter(str => str.length in uniqueLengths)
    .length;

  console.log('First: ', result);
};

const second = () => {
  const parsed = measurements
    .map(pair => pair.split(' | '))
    .filter(x => x.length > 1);

  const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  let result: number = 0;

  parsed.forEach(line => {
    const firstPart = line[0].split(' ');

    const temp = {
      top: '',
      topLeft: '',
      topRight: '',
      center: '',
      bottomLeft: '',
      bottomRight: '',
      bottom: '',
    };

    const lettersFrom7 = firstPart.find(str => str.length === 3)!.split('');
    const lettersFrom1 = firstPart.find(str => str.length === 2)!.split('');
    const lettersFrom4 = firstPart.find(str => str.length === 4)!.split('');

    temp.top = lettersFrom7.filter(letter => !lettersFrom1.includes(letter))[0];

    temp.bottom = allLetters.find(letter => {
      return firstPart.filter(str => {
        return ![2, 3, 4].includes(str.length) && str.includes(letter)
      }).length === 7 && letter !== temp.top;
    })!;

    const possible069 = firstPart.filter(str => str.length === 6);
    const lettersFrom9 = [...lettersFrom4, temp.top, temp.bottom];
    const possible06 = possible069.filter(letters => !lettersFrom9.every(letter => letters.includes(letter)));

    const rightLetters = [...lettersFrom1];

    const lettersFrom0 = possible06.find(letters => rightLetters.every(letter => letters.includes(letter)))!.split('');
    const lettersFrom6 = possible06.find(letters => !rightLetters.every(letter => letters.includes(letter)))!.split('');
    const lettersFrom8 = [...allLetters];

    // we have 0 1 4 6 7 8 9
    // we don't have 2 3 5
    const possible235 = firstPart.filter(str => str.length === 5);
    const lettersFrom3 = possible235.find(letters => rightLetters.every(letter => letters.includes(letter)))!.split('');
    const possible25 = possible235.filter(letters => !lettersFrom3.every(letter => letters.includes(letter)));

    // now we can identify 5 and 2
    temp.topLeft = lettersFrom9.find(letter => !lettersFrom3.includes(letter))!;
    const lettersFrom5 = possible25.find(letters => letters.includes(temp.topLeft))!.split('');
    const lettersFrom2 = possible25.find(letters => !letters.includes(temp.topLeft))!.split('');

    // finally
    const letters = {
      [lettersFrom0.sort().join('')]: 0,
      [lettersFrom1.sort().join('')]: 1,
      [lettersFrom2.sort().join('')]: 2,
      [lettersFrom3.sort().join('')]: 3,
      [lettersFrom4.sort().join('')]: 4,
      [lettersFrom5.sort().join('')]: 5,
      [lettersFrom6.sort().join('')]: 6,
      [lettersFrom7.sort().join('')]: 7,
      [lettersFrom8.sort().join('')]: 8,
      [lettersFrom9.sort().join('')]: 9,
    };

    const secondPart = line[1]
      .split(' ')
      .map(str => str.split('').sort().join(''))
      .reduce<string>((acc, val) => acc += letters[val], '');

    result += parseInt(secondPart, 10);
  });

  console.log('Second: ', result);
}

first();
second();
