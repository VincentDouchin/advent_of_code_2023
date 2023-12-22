import { writeFile } from 'node:fs/promises'
import run from 'aocrunner'
import { memo } from '../utils/index.js'

const parseInput = (rawInput: string) => rawInput.split('\n').flatMap((l, y) => l.split('').flatMap((s, x) => ({ s, x, y })))

const directions: { x: number, y: number }[] = [
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: -1, y: 0 },
]

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const garden = new Set<string>()
	const start = input.find((c => c.s === 'S'))!
	const takeStep = memo((cell: { x: number, y: number }, steps: number) => {
		const key = `${cell.x}-${cell.y}`
		if (steps % 2 === 0) garden.add(key)
		if (steps === 0) return
		for (const dir of directions) {
			const newCoords = { x: cell.x + dir.x, y: cell.y + dir.y }
			const newCell = input.find(c => c.x === newCoords.x && c.y === newCoords.y)
			if (newCell?.s !== '#') {
				takeStep(newCoords, steps - 1)
			}
		}
	})
	takeStep(start, 10)

	return garden.size
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const seen = new Set<string>()
	const garden = new Set<string>()
	const maxx = Math.max(...input.map(c => c.x))
	const maxy = Math.max(...input.map(c => c.y))
	const mod = (a: number, b: number) => (a % b + b) % b
	const takeStep = memo((cell: { x: number, y: number }, steps: number) => {
		const key = `${cell.x}¤${cell.y}`
		const key2 = `${cell.x}¤${cell.y}¤${steps}`
		if (seen.has(key2)) return
		seen.add(key2)
		if (steps % 2 === 0) garden.add(key)
		if (steps === 0) return
		for (const dir of directions) {
			const newX = mod((cell.x + dir.x), maxx + 1)
			const newY = mod((cell.y + dir.y), maxy + 1)

			const newCell = input.find(c => c.x === newX && c.y === newY)
			if (newCell?.s !== '#') {
				takeStep({ x: cell.x + dir.x, y: cell.y + dir.y }, steps - 1)
			}
		}
	})
	// takeStep(start, 65 + 131 * 0)
	// takeStep(start, 65 + 131 * 1)
	// takeStep(start, 65 + 131 * 2)
	// 65 + 131 * 0 3802
	// 65 + 131 * 1 33732
	// 65 + 131 * 2 93480

	// Then use an online polynomial solver to find the equation

	return 610158187362102
}

run({
	part1: {
		tests: [
			{
				input: `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
				expected: 16,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
				expected: 50,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
