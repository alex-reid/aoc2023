import run from "aocrunner";

const parseInput = (rawInput) => {
  const sections = rawInput.split("\n\n");
  const seeds = sections[0].match(/\d+/g).map((v) => parseInt(v));
  const maps = sections.reduce((a, c, i) => {
    const map = c.split(" map:\n");
    if (i >= 1)
      return {
        ...a,
        [map[0]]: map[1]
          .split("\n")
          .map((v) => v.match(/\d+/g).map((v) => parseInt(v))),
      };
  }, {});
  return { seeds, ...maps };
};

const getRanges = (input) => {
  const output = [];
  for (let j = 0; j < input.length; j++) {
    const [dest, source, range] = input[j];
    output.push({ start: source, end: source + range, add: dest - source });
  }
  return output;
};

function buildSteps(input) {
  return [
    getRanges(input["seed-to-soil"]),
    getRanges(input["soil-to-fertilizer"]),
    getRanges(input["fertilizer-to-water"]),
    getRanges(input["water-to-light"]),
    getRanges(input["light-to-temperature"]),
    getRanges(input["temperature-to-humidity"]),
    getRanges(input["humidity-to-location"]),
  ];
}

const getMapping = (input, ranges) => {
  let out = input;
  for (const { start, end, add } of ranges) {
    if (input >= start && input < end) {
      out = input + add;
    }
  }
  return out;
};

const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const steps = buildSteps(input);

  let smallest = Infinity;

  input.seeds.forEach((v) => {
    let input = v;
    steps.forEach((step) => {
      input = getMapping(input, step);
    });
    if (input < smallest) smallest = input;
  });

  return smallest;
};

const getOutputMappings = (input, mapping) => {
  // create an intersection of two objects and return the remainder of object one as a new object
  const start = Math.max(input.start, mapping.start);
  const end = Math.min(input.end, mapping.end);

  const intersect = start <= end ? { start, end } : null;

  const remaining = [];

  // add remainder if input starts before mapping
  if (input.start < start) {
    remaining.push({ start: input.start, end: start });
  }
  // add remainder if input ends after mapping
  if (input.end > end) {
    remaining.push({ start: end, end: input.end });
  }

  // calculate the mapping of the input seed to the output for that step
  if (intersect) {
    intersect.start += mapping.add;
    intersect.end += mapping.add;
  }

  return { intersect, remaining };
};

const union = (obj1, obj2) => {
  // create a union of two objects
  const start = Math.min(obj1.start, obj2.start);
  const end = Math.max(obj1.end, obj2.end);
  return { start, end };
};

const unionAll = (objects) => {
  // Sort the objects based on their start values
  const sortedObjects = objects.sort((a, b) => a.start - b.start);

  // Initialize the result array with the first object
  let result = [sortedObjects[0]];

  // Iterate through the sorted objects and perform unions
  for (let i = 1; i < sortedObjects.length; i++) {
    const currentObject = sortedObjects[i];
    const lastResultObject = result[result.length - 1];

    // Check if there's an overlap, and perform union if necessary
    if (currentObject.start <= lastResultObject.end) {
      result[result.length - 1] = union(lastResultObject, currentObject);
    } else {
      // If no overlap, add the current object to the result array
      result.push(currentObject);
    }
  }

  return result;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  // build seed ranges
  const seeds = input.seeds.reduce((a, c, i) => {
    if (i % 2 == 0) return [...a, { start: c, end: c + input.seeds[i + 1] }];
    return a;
  }, []);

  const steps = buildSteps(input);

  let inputs = seeds;

  // go through each step and generate an array of ranges to feed into the next step.
  for (const step of steps) {
    const stepMappings = [];
    // go through each sub step and calculate the possible ranges
    for (const subStep of step) {
      const newInputs = [];
      // get possible ranges from each input (seed)
      for (const input of inputs) {
        let { intersect, remaining } = getOutputMappings(input, subStep);
        if (intersect) {
          stepMappings.push(intersect);
          newInputs.push(...remaining);
        } else {
          newInputs.push(input);
        }
      }
      inputs = newInputs;
    }

    // union all of the ranges to save redundant computation
    inputs = unionAll([...stepMappings, ...inputs]);
  }

  // as the unionAll function sorts before it unions, we can just pull the result from the inputs
  return inputs[0].start;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
