import run from "aocrunner";
import { dir } from "console";

const parseInput = (rawInput) => {
  let startpos = [];
  const map = rawInput.split("\n").map((v, y) =>
    v
      .trim()
      .split("")
      .map((v2, x) => {
        if (v2 == "S") startpos = { x, y };
        return v2;
      }),
  );
  return { map, startpos };
};

const dirsName = {
  "|": ["U", "D"],
  "-": ["L", "R"],
  L: ["U", "R"],
  J: ["L", "U"],
  7: ["L", "D"],
  F: ["R", "D"],
  ".": [],
  S: ["L", "U", "R", "D"],
};

const dirsVec = {
  L: { x: -1, y: 0 },
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
};
const dirFrom = {
  L: "R",
  R: "L",
  U: "D",
  D: "U",
};

function getSymbol(x, y, map) {
  return map[y][x];
}

function isValid(dir, currentX, currentY, map) {
  const from = dirFrom[dir];
  const vec = dirsVec[dir];
  const newSymbol = getSymbol(currentX + vec.x, currentY + vec.y, map);
  const newDirs = dirsName[newSymbol];
  const isValid = !!newDirs?.includes(from);
  return isValid;
}

const part1 = (rawInput) => {
  const { map, startpos } = parseInput(rawInput);

  let currentX = startpos.x;
  let currentY = startpos.y;

  const startDirs = dirsName[getSymbol(currentX, currentY, map)];

  const dirsMove = [];
  startDirs.forEach((dir) => {
    if (isValid(dir, currentX, currentY, map)) dirsMove.push(dir);
  });

  let currDir = dirsMove[0];
  let length = 0;

  while (true) {
    const vector = dirsVec[currDir];
    const symbol = getSymbol(currentX + vector.x, currentY + vector.y, map);
    const newDirs = dirsName[symbol];
    const toDir = newDirs.filter((newDir) => newDir != dirFrom[currDir])[0];
    currentX += vector.x;
    currentY += vector.y;
    currDir = toDir;
    length++;
    if (getSymbol(currentX, currentY, map) == "S") break;
  }

  return length / 2;
};

const part2 = (rawInput) => {
  const { map, startpos } = parseInput(rawInput);
  const path = map.map((y) => y.map((x) => "."));

  let currentX = startpos.x;
  let currentY = startpos.y;

  const startDirs = dirsName[getSymbol(currentX, currentY, map)];

  const dirsMove = [];
  startDirs.forEach((dir) => {
    if (isValid(dir, currentX, currentY, map)) dirsMove.push(dir);
  });
  let startSymbol = "";
  for (const pipe in dirsName) {
    if (pipe != "S" && pipe != ".") {
      const dirs = dirsName[pipe];
      if (
        (dirs[0] == dirsMove[0] && dirs[1] == dirsMove[1]) ||
        (dirs[1] == dirsMove[0] && dirs[0] == dirsMove[1])
      ) {
        startSymbol = pipe;
      }
    }
  }

  let currDir = dirsMove[0];
  let length = 0;

  while (true) {
    const currSymbol = getSymbol(currentX, currentY, map);
    const vector = dirsVec[currDir];
    const symbol = getSymbol(currentX + vector.x, currentY + vector.y, map);
    const newDirs = dirsName[symbol];
    const toDir = newDirs.filter((newDir) => newDir != dirFrom[currDir])[0];
    path[currentY][currentX] = currSymbol;
    currentX += vector.x;
    currentY += vector.y;
    currDir = toDir;
    length++;
    if (getSymbol(currentX, currentY, map) == "S") break;
  }
  path[startpos.y][startpos.x] = startSymbol;
  let filled = 0;
  for (let y = 0; y < path.length; y++) {
    let isInside = false;
    let isLine = false;
    for (let x = 0; x < path[0].length; x++) {
      const sym = path[y][x];
      if (["|", "J", "L"].includes(sym)) {
        isInside = !isInside;
      }
      if (isInside && sym == ".") {
        path[y][x] = "I";
        filled++;
      } else if (sym == ".") {
        path[y][x] = "O";
      }
    }
  }
  //prettyPrint(path);

  return filled;
};

function prettyPrint(path) {
  console.log(path.map((v) => v.join("")).join("\n"));
}

run({
  part1: {
    tests: [
      {
        input: `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,
        expected: 4,
      },
      {
        input: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`,
        expected: 8,
      },
      {
        input: `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
