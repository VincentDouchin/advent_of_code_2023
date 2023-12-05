import run from 'aocrunner'

interface range {
	destination: number
	source: number
	range: number
	isInRange: (nb: number) => boolean
}
interface map {
	source: string
	destination: string
	ranges: range[]
}
const parseInput = (rawInput: string) => {
	const lines = rawInput.split('\n\n')
	const seeds = lines[0].replace('seeds: ', '').split(' ').map(Number)
	const maps = lines.slice(1, lines.length).map((line) => {
		const map = line.split('\n')
		const [source, destination] = map[0].replace(' map:', '').split('-to-')
		const ranges = map.slice(1, map.length).map((r) => {
			const [destination, source, range] = r.split(' ').map(Number)
			const isInRange = (nb: number) => source <= nb && nb < source + range
			return { destination, source, range, isInRange }
		})
		return { destination, source, ranges }
	})
	return { seeds, maps }
}

const findLocation = (maps: map[], seed: number, from: string): number => {
	const map = maps.find(({ source }) => source === from)
	if (!map) return seed
	const range = map.ranges.find(r => r.source <= seed && seed < r.source + r.range)!
	const newSeed = range ? range.destination + (seed - range.source) : seed
	return findLocation(maps, newSeed, map.destination)
}

const part1 = (rawInput: string) => {
	const { seeds, maps } = parseInput(rawInput)
	const locations = seeds.map(s => findLocation(maps, s, 'seed'))
	return Math.min(...locations)
}

const part2 = (rawInput: string) => {
	const { seeds, maps } = parseInput(rawInput)
	const seedRanges = []
	for (let i = 0; i < seeds.length; i += 2) {
		seedRanges.push([seeds[i], seeds[i] + seeds[i + 1]])
	}
	console.log(seedRanges)

	let lowest = Number.POSITIVE_INFINITY
	for (const [start, end] of seedRanges) {
		for (let s = start; s < end; s++) {
			const location = findLocation(maps, s, 'seed')
			if (location < lowest) {
				lowest = location
			}
		}
		console.log(start, lowest)
	}
	return lowest
}

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
})
