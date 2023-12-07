import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n").map((v) => v.match(/\d+/g).map((v) => parseInt(v)));

const part1 = (rawInput) => {
  const [times, distances] = parseInput(rawInput);
  let output = 1;

  times.forEach((duration, index) => {
    let winning = 0;
    const tobeat = distances[index];
    for (let i = 0; i < duration; i++) {
      let held = i + 1;
      let time = duration - held;
      let speed = held;
      let distance = speed * time;
      //console.log(held + "ms", time + "ms", speed + "mm/ms", distance + "mm");
      if (distance > tobeat) winning++;
    }
    output *= winning;
    //console.log(winning);
  });

  return output;
};

const part2 = (rawInput) => {
  const [times, distances] = parseInput(rawInput);
  const duration = parseInt(times.join(""));
  const tobeat = parseInt(distances.join(""));
  let winning = 0;

  for (let held = 1; held <= duration; held++) {
    winning += held * (duration - held) > tobeat ? 1 : 0;
  }

  return winning;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
