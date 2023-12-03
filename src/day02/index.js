import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) => v.trim() + ";");

const getGameResults = (input) => {
  const output = { red: 0, green: 0, blue: 0 };
  const results = input.matchAll(/((\d+) (red|green|blue))/g);
  for (const result of results) {
    const [, , num, col] = result;
    if (parseInt(num) > output[col]) output[col] = parseInt(num);
  }
  return output;
};

const part1 = (rawInput) => {
  const compare = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const input = parseInput(rawInput);
  return input.reduce((acc, curr, index) => {
    const results = getGameResults(curr);
    let isFine = true;
    for (const colour in compare) {
      if (compare[colour] < results[colour]) isFine = false;
    }
    return (acc += isFine ? index + 1 : 0);
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, curr) => {
    const { red, green, blue } = getGameResults(curr);
    return (acc += red * green * blue);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
