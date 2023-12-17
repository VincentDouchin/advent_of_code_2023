import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map((l: string) => l.split('').map(x => Number(x)))

type Dir = 'r' | 'u' | 'd' | 'l'

const coords: Record<Dir, { x: number, y: number }> = {
	r: { x: 1, y: 0 },
	l: { x: -1, y: 0 },
	d: { x: 0, y: 1 },
	u: { x: 0, y: -1 },
}
const opposite: Record<Dir, Dir> = {
	r: 'l',
	l: 'r',
	u: 'd',
	d: 'u',
}

interface Path {
	x: number
	y: number
	dir: Dir
	dist: number
}
const part1 = (rawInput: string) => {
	console.time('part1')
	const input = parseInput(rawInput)
	const width = input[0].length - 1
	const height = input.length - 1
	const seen = new Set<string>()
	const queues: Path[][] = [[{ x: 0, y: 0, dir: 'r', dist: 1 }, { x: 0, y: 0, dir: 'd', dist: 1 }]]

	const findPath = (step: number): number => {
		const tryPath = (path: Path, dir: Dir): void => {
			if (dir === opposite[path.dir]) return
			const offset = coords[dir]

			const newPath: Path = {
				x: path.x + offset.x,
				y: path.y + offset.y,
				dir,
				dist: dir === path.dir ? path.dist + 1 : 1,
			}
			if (newPath.dist > 3) return
			if (input[newPath.y]?.[newPath.x] === undefined) return
			const key = [newPath.x, newPath.y, newPath.dir, newPath.dist].join('-')
			if (seen.has(key)) return
			seen.add(key)
			const heat = step + input[newPath.y][newPath.x]
			queues[heat] ??= []
			queues[heat].push(newPath)
		}
		for (const path of queues[step] ?? []) {
			if (path.x === width && path.y === height) {
				return step
			}
			tryPath(path, 'd')
			tryPath(path, 'r')
			tryPath(path, 'l')
			tryPath(path, 'u')
		}
		return findPath(step + 1)
	}
	console.timeEnd('part1')
	return findPath(0)
}

const part2 = (rawInput: string) => {
	console.time('part2')
	const input = parseInput(rawInput)
	const width = input[0].length - 1
	const height = input.length - 1
	const seen = new Set<string>()
	const queues: Path[][] = [[{ x: 0, y: 0, dir: 'r', dist: 1 }, { x: 0, y: 0, dir: 'd', dist: 1 }]]

	const findPath = (step: number): number => {
		const tryPath = (path: Path, dir: Dir): void => {
			if (dir === opposite[path.dir]) return
			const offset = coords[dir]

			const newPath: Path = {
				x: path.x + offset.x,
				y: path.y + offset.y,
				dir,
				dist: dir === path.dir ? path.dist + 1 : 1,
			}
			if (path.dist < 4 && dir !== path.dir) return
			if (path.dist >= 10 && dir === path.dir) return
			if (input[newPath.y]?.[newPath.x] === undefined) return
			const key = [newPath.x, newPath.y, newPath.dir, newPath.dist].join('-')
			if (seen.has(key)) return
			seen.add(key)
			const heat = step + input[newPath.y][newPath.x]
			queues[heat] ??= []
			queues[heat].push(newPath)
		}
		for (const path of queues[step] ?? []) {
			if (path.x === width && path.y === height) {
				return step
			}
			tryPath(path, 'd')
			tryPath(path, 'r')
			tryPath(path, 'l')
			tryPath(path, 'u')
		}
		return findPath(step + 1)
	}
	console.timeEnd('part2')
	return findPath(0)
}

run({
	part1: {
		tests: [
			{
						  input: `
			2413432311323
			3215453535623
			3255245654254
			3446585845452
			4546657867536
			1438598798454
			4457876987766
			3637877979653
			4654967986887
			4564679986453
			1224686865563
			2546548887735
			4322674655533`,
						  expected: 102,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
						  input: `
			2413432311323
			3215453535623
			3255245654254
			3446585845452
			4546657867536
			1438598798454
			4457876987766
			3637877979653
			4654967986887
			4564679986453
			1224686865563
			2546548887735
			4322674655533`,
						  expected: 94,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
