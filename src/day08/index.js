import run from "aocrunner";

const parseInput = (rawInput) =>
  rawInput.split("\n\n").map((v, i) => {
    if (i == 0)
      return v
        .trim()
        .split("")
        .map((v3) => (v3 == "L" ? 0 : 1));
    const instructions = {};
    v.split("\n").forEach((v2) => {
      const line = v2.trim().match(/\w+/g);
      instructions[line[0]] = [line[1], line[2]];
    });
    return instructions;
  });

const part1 = (rawInput) => {
  const [instructions, network] = parseInput(rawInput);
  let currentStep = "AAA";
  let currentInstruction = 0;
  let steps = 0;
  while (currentStep != "ZZZ") {
    currentStep = network[currentStep][instructions[currentInstruction]];
    currentInstruction = (currentInstruction + 1) % instructions.length;
    steps++;
  }
  return steps;
};

const getPrimeFactors = (number) => {
  const factors = [];

  // Divide by 2 until it's odd
  while (number % 2 === 0) {
    factors.push(2);
    number /= 2;
  }

  // Divide by odd numbers starting from 3
  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    while (number % i === 0) {
      factors.push(i);
      number /= i;
    }
  }

  // If the remaining number is a prime greater than 2
  if (number > 2) {
    factors.push(number);
  }

  return factors;
};

class Stepper {
  constructor(start, network, instructions) {
    this.currentStep = start;
    this.network = network;
    this.instructions = instructions;
    this.currentInstruction = 0;
    this.instructionLength = instructions.length;
    this.isFinished = false;
    this.numSteps = 0;
    this.loopLength = 0;
  }
  finished() {
    this.isFinished = this.currentStep.endsWith("Z");
    return this.isFinished;
  }
  step() {
    this.currentStep =
      this.network[this.currentStep][
        this.instructions[this.currentInstruction]
      ];
    this.finished();
    this.currentInstruction =
      (this.currentInstruction + 1) % this.instructions.length;
  }
  findEnd() {
    while (!this.isFinished) {
      this.step();
      this.numSteps++;
    }
  }
  findLoop() {
    this.findEnd();
    this.loopLength = this.numSteps;
    return this.numSteps;
  }
}

const part2 = (rawInput) => {
  const [instructions, network] = parseInput(rawInput);
  const startKeys = [];

  for (const key in network) {
    if (key.endsWith("A")) startKeys.push(key);
  }

  const loopLengths = startKeys.map((v) =>
    new Stepper(v, network, instructions).findLoop(),
  );

  const primeFactors = loopLengths.map((v) => getPrimeFactors(v));

  const primes = new Set(primeFactors.flat());

  //20,685,524,831,999
  return Array.from(primes).reduce((a, c) => (a *= c), 1);
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
