import run from "aocrunner";

const parseInput = (rawInput, cardScores) =>
  rawInput.split("\n").map((v) => {
    const vals = v.trim().split(" ");
    const sortScore =
      cardScores[vals[0][0]].toString().padStart(2, "0") + // * 5 +
      cardScores[vals[0][1]].toString().padStart(2, "0") + // * 4 +
      cardScores[vals[0][2]].toString().padStart(2, "0") + // * 3 +
      cardScores[vals[0][3]].toString().padStart(2, "0") + // * 2 +
      cardScores[vals[0][4]].toString().padStart(2, "0"); //;
    return {
      cards: vals[0],
      bid: parseInt(vals[1]),
      score: 0,
      sortScore: parseInt(sortScore),
    };
  });

const cardScores = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};
const cardScoresPart2 = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};

function getHandType(cards) {
  const counts = {};
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    if (!counts[card]) {
      counts[card] = 1;
    } else {
      counts[card]++;
    }
  }
  const flat = Object.entries(counts);
  if (flat.length == 1) {
    // console.log("five of a kind");
    return 7;
  } else if (flat.length == 2) {
    if (flat.find(([, count]) => count == 4)) {
      // console.log("four of a kind");
      return 6;
    } else {
      // console.log("full house");
      return 5;
    }
  } else if (flat.length == 3) {
    if (flat.find(([, count]) => count == 3)) {
      // console.log("three of a kind");
      return 4;
    } else {
      // console.log("two pair");
      return 3;
    }
  } else if (flat.length == 4) {
    // console.log("one pair");
    return 2;
  } else if (flat.length == 5) {
    // console.log("highest card");
    return 1;
  }
}

const getScores = (scores, a, b, index = 0) => {
  if (index > 4) {
    return 0;
  }
  if (scores[a.cards[index]] == scores[b.cards[index]]) {
    return getScores(scores, a, b, ++index);
  } else if (scores[a.cards[index]] > scores[b.cards[index]]) {
    return -1;
  } else {
    return 1;
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput, cardScores);
  input.forEach((hand) => {
    hand.score = getHandType(hand.cards);
  });
  input.sort((a, b) => {
    const score = a.score - b.score;
    if (score == 0) {
      return a.sortScore - b.sortScore; //getScores(cardScores, b, a);
    }
    return score;
  });
  //console.log(input);

  return input.reduce((a, c, i) => (a += c.bid * (i + 1)), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput, cardScoresPart2);
  input.forEach((hand) => {
    if (hand.cards.includes("J")) {
      const newCards = hand.cards.replaceAll("J", "");
      for (let i = 0; i < newCards.length; i++) {
        const newScore = getHandType(newCards.padEnd(5, newCards[i]));
        if (newScore > hand.score) {
          hand.score = newScore;
        }
      }
    } else {
      hand.score = getHandType(hand.cards);
    }
  });
  input.sort((a, b) => {
    const score = a.score - b.score;
    if (score == 0) {
      return getScores(cardScores, b, a);
    }
    return score;
  });
  //input.forEach((hand) => console.log(hand.cards));

  return input.reduce((a, c, i) => (a += c.bid * (i + 1)), 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
