import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) => {
    const vals = v.trim().split(" ");
    return { cards: vals[0], bid: parseInt(vals[1]), score: 0 };
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
  // console.log(
  //   scores,
  //   a.cards,
  //   b.cards,
  //   a.cards[index],
  //   b.cards[index],
  //   scores[a.cards[index]],
  //   scores[b.cards[index]],
  // );
  if (index > 4) return 0;
  if (scores[a.cards[index]] == scores[b.cards[index]]) {
    return getScores(scores, a, b, ++index);
  } else if (scores[a.cards[index]] > scores[b.cards[index]]) {
    return -1;
  } else {
    return 1;
  }
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  input.forEach((hand) => {
    hand.score = getHandType(hand.cards);
  });
  input.sort((a, b) => {
    const score = a.score - b.score;
    if (score == 0) {
      return getScores(cardScores, b, a);
    }
    return score;
  });

  return input.reduce((a, c, i) => (a += c.bid * (i + 1)), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  input.forEach((hand) => {
    hand.score = getHandType(hand.cards);
    if (hand.cards.includes("J")) {
      for (const card in cardScoresPart2) {
        const newCards = hand.cards;
        const score = getHandType(newCards.replaceAll("J", card));
        if (score > hand.score) {
          //console.log(newCards.replaceAll("J", card), hand.cards, score);
          hand.score = score;
        }
      }
    }
  });
  input.sort((a, b) => {
    const score = a.score - b.score;
    if (score == 0) {
      return getScores(cardScoresPart2, b, a);
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
