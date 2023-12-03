import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split("\n").map((v) => v.trim());

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  return input
    .map((l) =>
      l.split("").reduce((a, c) => {
        return parseInt(c) >= 0 ? [...a, c] : a;
      }, []),
    )
    .reduce((a, c) => {
      return (a += parseInt(c[0] + c[c.length - 1]));
    }, 0);
};

const numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function numberConvert(string) {
  const idx = numbers.indexOf(string);
  return idx >= 0 ? idx + "" : string;
}

function findAndReplaceNums(line) {
  const matches = line.matchAll(
    /(?=(\d|one|two|three|four|five|six|seven|eight|nine|zero))/g,
  );
  const outArr = [];
  for (const match of matches) {
    outArr.push(numberConvert(match[1]));
  }
  return parseInt(outArr[0] + outArr.at(-1));
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return input.reduce((a, c) => (a += findAndReplaceNums(c)), 0);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
      eightwothree
      abcone2threexyz
      xtwone3four
      4nineeightseven2
      zoneight234
      7pqrstsixteen`,
        expected: 281,
      },
      {
        input: `t1
2clqj
dpbpqppsixngvmkflllcrtn8
jnrms1fkssgpvvlrmf
kqkj9qqvfxn
w2sghsevenine
`,
        expected: 240,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
