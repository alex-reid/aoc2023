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

const getRanges = (input, reverse = false) => {
  const output = [];
  for (let j = 0; j < input.length; j++) {
    const [dest, source, range] = input[j];
    if (reverse) {
      output.push({ start: dest, end: dest + range, add: source - dest });
    } else {
      output.push({ start: source, end: source + range, add: dest - source });
    }
  }
  return output;
};

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
  const steps = [
    getRanges(input["seed-to-soil"]),
    getRanges(input["soil-to-fertilizer"]),
    getRanges(input["fertilizer-to-water"]),
    getRanges(input["water-to-light"]),
    getRanges(input["light-to-temperature"]),
    getRanges(input["temperature-to-humidity"]),
    getRanges(input["humidity-to-location"]),
  ];
  // console.log(steps);

  const final = input.seeds.reduce((a, v, seedI) => {
    let seed = v;
    steps.forEach((step, index) => {
      seed = getMapping(seed, step);
    });
    return [...a, seed];
  }, []);

  return final.sort((a, b) => a - b)[0];
};

const intersectAndRemaining = (obj1, obj2) => {
  const start = Math.max(obj1.start, obj2.start);
  const end = Math.min(obj1.end, obj2.end);

  const intersect = start <= end ? { start, end } : null;

  const remaining = [];
  if (obj1.start < start) {
    remaining.push({ start: obj1.start, end: start });
  }
  if (obj1.end > end) {
    remaining.push({ start: end, end: obj1.end });
  }

  return { intersect, remaining };
};

const union = (obj1, obj2) => {
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
  const seeds = input.seeds.reduce((a, c, i) => {
    if (i % 2 == 0) return [...a, { start: c, end: c + input.seeds[i + 1] }];
    return a;
  }, []);

  /*

  const steps = [
    getRanges(input["seed-to-soil"]),
    getRanges(input["soil-to-fertilizer"]),
    getRanges(input["fertilizer-to-water"]),
    getRanges(input["water-to-light"]),
    getRanges(input["light-to-temperature"]),
    getRanges(input["temperature-to-humidity"]),
    getRanges(input["humidity-to-location"]),
  ];


  const test1 = [
    { start: 69, end: 70, add: -69 },
    { start: 0, end: 69, add: 1 },
  ];

  let sources = seeds;
  //console.log(unionAll([...seeds, ...sources]));
  for (const step of steps) {
    const nextInput = [];
    step.forEach((step) => {
      const newSources = [];
      sources.forEach((source) => {
        let intersect = intersectAndRemaining(source, step);
        if (intersect.intersect) {
          intersect.intersect.start += step.add;
          intersect.intersect.end += step.add;
          nextInput.push(intersect.intersect);
          newSources.push(...intersect.remaining);
        } else {
          newSources.push(source);
        }
      });
      sources = newSources;
    });
    nextInput.push(...sources);
    sources = unionAll(nextInput);
  }
  console.log(sources);
  return sources[0].start;
  */

  const isSeed = (input) => {
    let out = false;
    seeds.forEach(({ start, end }) => {
      if (input >= start && input < end) {
        out = true;
      }
    });
    return out;
  };

  const steps = [
    getRanges(input["humidity-to-location"], true),
    getRanges(input["temperature-to-humidity"], true),
    getRanges(input["light-to-temperature"], true),
    getRanges(input["water-to-light"], true),
    getRanges(input["fertilizer-to-water"], true),
    getRanges(input["soil-to-fertilizer"], true),
    getRanges(input["seed-to-soil"], true),
  ];
  console.log(steps);

  let i = 0;
  while (true) {
    let final = i;
    steps.forEach((step, index) => {
      final = getMapping(final, step);
    });
    if (isSeed(final)) break;
    i++;
  }

  return i;
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
