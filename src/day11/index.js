import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) => v.trim().split(""));

const getCol = (i, col) => i.reduce((a, c) => (a += c[col]), "");

const manhattanDistance = (point1, point2) => {
  const dx = Math.abs(point1.x - point2.x);
  const dy = Math.abs(point1.y - point2.y);

  return dx + dy;
};

function getExpansion(input, multiplier) {
  const expRows = [];
  let rowAmt = 0;

  input.forEach((row) => {
    expRows.push(rowAmt);
    if (!row.includes("#")) {
      rowAmt += multiplier - 1;
    }
  });

  const expCols = [];
  let colAmt = 0;

  input[0].forEach((v, col) => {
    expCols.push(colAmt);
    if (!getCol(input, col).includes("#")) {
      colAmt += multiplier - 1;
    }
  });
  return { expCols, expRows };
}

function getPositions(input, multiplier) {
  const { expCols, expRows } = getExpansion(input, multiplier);

  const starPos = [];
  let starNum = 0;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] == "#") {
        starPos[starNum++] = { x: x + expCols[x], y: y + expRows[y] };
      }
    }
  }
  return starPos;
}

function getDists(starPos) {
  const dists = [];
  for (let starA = 0; starA < starPos.length; starA++) {
    for (let starB = starA; starB < starPos.length; starB++) {
      if (starA != starB)
        dists.push(manhattanDistance(starPos[starA], starPos[starB]));
    }
  }
  return dists;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let starPos = getPositions(input, 2);

  let dists = getDists(starPos);

  return dists.reduce((a, c) => (a += c), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let starPos = getPositions(input, 1000000);

  let dists = getDists(starPos);

  return dists.reduce((a, c) => (a += c), 0);
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 82000210,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
