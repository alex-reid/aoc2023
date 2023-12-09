import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) =>
    v
      .trim()
      .split(" ")
      .map((v2) => parseInt(v2)),
  );

function getDifference(input, lastVal = []) {
  lastVal.push(input.at(-1));
  if (new Set(input).size == 1) return lastVal;

  const output = [];
  for (let i = 0; i < input.length - 1; i++) {
    output.push(input[i + 1] - input[i]);
  }

  return getDifference(output, lastVal);
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const values = input.map((v) => getDifference(v));
  const predicted = values.map((v) => v.reduce((a, c) => (a += c), 0));
  return predicted.reduce((a, c) => (a += c), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const values = input.map((v) => getDifference(v.reverse()));
  const predicted = values.map((v) => v.reduce((a, c) => (a += c), 0));
  return predicted.reduce((a, c) => (a += c), 0);
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
      {
        input: `-2 4 12 17 14 -2 -36 -93 -178 -296 -452 -651 -898 -1198 -1556 -1977 -2466 -3028 -3668 -4391 -5202`,
        expected: -6106,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
      {
        input: `0 3 6 9 12 15`,
        expected: -3,
      },
      {
        input: `1 3 6 10 15 21`,
        expected: 0,
      },
      {
        input: `10 13 16 21 30 45`,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
