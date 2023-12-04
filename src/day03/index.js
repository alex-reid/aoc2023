import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split("\n").map((v) => v.trim());

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let parts = 0;

  input.forEach((line, index) => {
    for (const number of line.matchAll(/\d+/g)) {
      const nIndex = number["index"];
      const nLength = number[0].length;
      const surroundingCells = [line[nIndex - 1], line[nIndex + nLength]]; // build array of surrounding cells

      for (let i = nIndex - 1; i < nIndex + nLength + 1; i++) {
        surroundingCells.push(input[index - 1]?.[i]); // add from row above
        surroundingCells.push(input[index + 1]?.[i]); // add from row below
      }
      for (let i = 0; i < surroundingCells.length; i++) {
        const currentCell = surroundingCells[i];
        if (currentCell && currentCell.match(/[^.\d]/)) {
          parts += parseInt(number[0]);
          break;
        }
      }
    }
  });

  return parts;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  const table = input.map((v, i) => {
    const newLine = new Array(v.length).fill(false);
    for (const symbol of v.matchAll(/\*/g)) {
      newLine[symbol["index"]] = true;
    }
    for (const number of v.matchAll(/\d+/g)) {
      for (let i = 0; i < number[0].length; i++) {
        newLine[number["index"] + i] = parseInt(number[0]);
      }
    }
    return newLine;
  });

  let gears = 0;

  table.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === true) {
        const vals = new Set();
        for (let yOffset = y - 1; yOffset < y + 2; yOffset++) {
          for (let xOffset = x - 1; xOffset < x + 2; xOffset++) {
            if (typeof table[yOffset][xOffset] == "number")
              vals.add(table[yOffset][xOffset]);
          }
        }
        if (vals.size == 2) {
          const mult = [...vals];
          gears += mult[0] * mult[1];
        }
      }
    });
  });

  // console.log(table);
  // return [...vals.values()].reduce((a, c) => (a += c), 0);

  return gears;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
