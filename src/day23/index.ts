import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(''))

interface Pos {
	x: number
	y: number
}

type Dir = 'N' | 'S' | 'E' | 'W'

const dirs: [Dir, Pos][] = [
	['N', { x: 0, y: -1 }],
	['S', { x: 0, y: 1 }],
	['E', { x: 1, y: 0 }],
	['W', { x: -1, y: 0 }],
]
const opposite: Record<Dir, Dir> = {
	N: 'S',
	S: 'N',
	E: 'W',
	W: 'E',
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const walks: number[] = []
	const intersections: Record<string, [string, number][]> = {}
	const findIntersection = (start: string, x: number, y: number, from: Dir, steps: number) => {
		const symbol = input[y]?.[x]
		if (symbol === '<' && from === 'W') return
		if (symbol === '>' && from === 'E') return
		if (symbol === 'v' && from === 'S') return
		const neighbors: [Dir, Pos][] = []
		for (const [dir, offset] of dirs.filter(([dir]) => dir !== from)) {
			const symbol = input[y + offset.y]?.[x + offset.x]
			if (symbol && symbol !== '#') {
				neighbors.push([dir, { x: x + offset.x, y: y + offset.y }])
			}
		}
		if (neighbors.length === 1) {
			const [dir, { x, y }] = neighbors[0]
			findIntersection(start, x, y, opposite[dir], steps + 1)
		} else {
			const key = `${x},${y}`
			intersections[start] ??= []
			if (!intersections[start].some(([end]) => end === key)) {
				intersections[start].push([key, steps + 1])
			}
			for (const [dir, pos] of neighbors) {
				findIntersection(key, pos.x, pos.y, opposite[dir], 0)
			}
		}
	}
	const endX = input[input.length - 1].indexOf('.')
	const endY = input.length - 1
	findIntersection(`1,0`, 1, 0, 'N', 0)
	const endKey = `${endX},${endY}`

	const findPath = (path: string[], steps: number) => {
		const last = path[path.length - 1]
		if (last === endKey) {
			walks.push(steps - 1)
			return
		}
		const possiblePaths = intersections[last].filter(([p]) => !path.includes(p))
		for (const [to, newSteps] of possiblePaths) {
			findPath([...path, to], steps + newSteps)
		}
	}
	findPath([`1,0`], 0)
	return Math.max(...walks)
}

type Intersection = [start: string, x: number, y: number, from: Dir, steps: number]
const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const intersections: Record<string, Partial<Record<Dir, [string, number]>>> = {}
	const queue: Intersection[] = []
	const findIntersection = (...int: Intersection) => queue.push(int)
	const processIntersection = (start: string, x: number, y: number, from: Dir, steps: number) => {
		const neighbors: [Dir, Pos][] = []
		for (const [dir, offset] of dirs.filter(([dir]) => dir !== from)) {
			const symbol = input[y + offset.y]?.[x + offset.x]
			if (symbol && symbol !== '#') {
				neighbors.push([dir, { x: x + offset.x, y: y + offset.y }])
			}
		}
		if (neighbors.length === 1) {
			const [dir, { x, y }] = neighbors[0]
			findIntersection(start, x, y, opposite[dir], steps + 1)
		} else {
			const key = `${x},${y}`
			intersections[key] ??= {}
			intersections[key][opposite[from]] = [start, steps]
			if (intersections[start]?.[from] !== undefined) return
			intersections[start] ??= { }
			intersections[start][from] = [key, steps]

			for (const [dir, pos] of neighbors) {
				findIntersection(key, pos.x, pos.y, opposite[dir], 0)
			}
		}
	}
	const endX = input[input.length - 1].indexOf('.')
	const endY = input.length - 1
	findIntersection(`1,0`, 1, 0, 'N', 0)
	while (queue.length > 0) {
		const int = queue.pop()
		if (int) {
			processIntersection(...int)
		}
	}

	const endKey = `${endX},${endY}`
	let max = 0
	const findPath = (path: string[], steps: number) => {
		const last = path[path.length - 1]
		if (last === endKey) {
			const length = steps
			if (max < length) {
				max = length
			}
			return
		}
		const possiblePaths = Object.values(intersections[last]).filter(([p]) => !path.includes(p))
		for (const [to, newSteps] of possiblePaths) {
			findPath([...path, to], steps + newSteps + 1)
		}
	}
	findPath([`1,0`], 0)

	return max
}

run({
	part1: {
		tests: [
			{
				input: `
				#.#####################
				#.......#########...###
				#######.#########.#.###
				###.....#.>.>.###.#.###
				###v#####.#v#.###.#.###
				###.>...#.#.#.....#...#
				###v###.#.#.#########.#
				###...#.#.#.......#...#
				#####.#.#.#######.#.###
				#.....#.#.#.......#...#
				#.#####.#.#.#########v#
				#.#...#...#...###...>.#
				#.#.#v#######v###.###v#
				#...#.>.#...>.>.#.###.#
				#####v#.#.###v#.#.###.#
				#.....#...#...#.#.#...#
				#.#########.###.#.#.###
				#...###...#...#...#.###
				###.###.#.###v#####v###
				#...#...#.#.>.>.#.>.###
				#.###.###.#.###.#.#v###
				#.....###...###...#...#
				#####################.#`,
				expected: 94,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
				#.#####################
				#.......#########...###
				#######.#########.#.###
				###.....#.>.>.###.#.###
				###v#####.#v#.###.#.###
				###.>...#.#.#.....#...#
				###v###.#.#.#########.#
				###...#.#.#.......#...#
				#####.#.#.#######.#.###
				#.....#.#.#.......#...#
				#.#####.#.#.#########v#
				#.#...#...#...###...>.#
				#.#.#v#######v###.###v#
				#...#.>.#...>.>.#.###.#
				#####v#.#.###v#.#.###.#
				#.....#...#...#.#.#...#
				#.#########.###.#.#.###
				#...###...#...#...#.###
				###.###.#.###v#####v###
				#...#...#.#.>.>.#.>.###
				#.###.###.#.###.#.#v###
				#.....###...###...#...#
				#####################.#`,
				expected: 154,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
