import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) =>
    v
      .split(":")[1]
      .split("|")
      .map((v1) => v1.match(/\d+/g).map((v2) => parseInt(v2))),
  );

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  let finalScore = 0;

  input.forEach(([winning, mine]) => {
    let score = 0.5;
    mine.forEach((number) => {
      if (winning.includes(number)) {
        score *= 2;
      }
    });
    if (score >= 1) finalScore += score;
  });

  return finalScore;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const cardScores = [];

  input.forEach(([winning, mine], index) => {
    const current = { winners: 0, index };
    mine.forEach((number) => {
      if (winning.includes(number)) {
        current.winners += 1;
      }
    });
    cardScores.push(current);
  });

  function processCards({ index, winners }, memo = []) {
    if (memo[index]) return memo[index];
    let total = 1;
    for (let i = index; i < index + winners; i++) {
      total += processCards(cardScores[i + 1], memo);
    }
    memo[index] = total;
    return total;
  }

  return cardScores.reduce((a, c) => (a += processCards(c)), 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
