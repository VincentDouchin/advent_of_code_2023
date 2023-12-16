import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.replace(/\\/g, 'r').split('\n')

type Dir = 'u' | 'd' | 'l' | 'r'

const coords: Record<Dir, { x: number, y: number }> = {
	u: { x: 0, y: -1 },
	d: { x: 0, y: 1 },
	l: { x: -1, y: 0 },
	r: { x: 1, y: 0 },
}

const followPath = (visited: Map<string, Dir[]>, input: string[], x: number, y: number, dir: Dir) => {
	const offset = coords[dir]
	if (input[y]?.[x] !== undefined) {
		const key = `${x}-${y}`
		const visitedBefore = visited.get(key)
		if (visitedBefore) {
			if (visitedBefore.includes(dir)) {
				return visited
			} else {
				visitedBefore.push(dir)
			}
		} else {
			visited.set(`${x}-${y}`, [dir])
		}
	}
	switch (input[y]?.[x]) {
		case '.': {
			 followPath(visited, input, x + offset.x, y + offset.y, dir) }; break
		case '|':{
			if (dir === 'r' || dir === 'l') {
				 followPath(visited, input, x, y + 1, 'd')
				followPath(visited, input, x, y - 1, 'u')
			} else {
				followPath(visited, input, x + offset.x, y + offset.y, dir)
			}
		};break
		case '-':{
			if (dir === 'u' || dir === 'd') {
				followPath(visited, input, x - 1, y, 'l')
				followPath(visited, input, x + 1, y, 'r')
			} else {
				followPath(visited, input, x + offset.x, y + offset.y, dir)
			}
		};break
		case '/':{
			if (dir === 'u') followPath(visited, input, x + 1, y, 'r')
			if (dir === 'd') followPath(visited, input, x - 1, y, 'l')
			if (dir === 'r') followPath(visited, input, x, y - 1, 'u')
			if (dir === 'l') followPath(visited, input, x, y + 1, 'd')
		};break
		case 'r':{ // \
			if (dir === 'u') followPath(visited, input, x - 1, y, 'l')
			if (dir === 'd') followPath(visited, input, x + 1, y, 'r')
			if (dir === 'r') followPath(visited, input, x, y + 1, 'd')
			if (dir === 'l') followPath(visited, input, x, y - 1, 'u')
		};break
	}
	return visited
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const res = followPath(new Map(), input, 0, 0, 'r')

	return res.size
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const result = []
	for (let i = 0; i < input[0].length; i++) {
		const res1 = followPath(new Map(), input, i, 0, 'd')
		result.push(res1.size)
		const res2 = followPath(new Map(), input, i, input[0].length - 1, 'u')
		result.push(res2.size)
	}
	for (let i = 0; i < input.length; i++) {
		const res1 = followPath(new Map(), input, 0, i, 'r')
		result.push(res1.size)
		const res2 = followPath(new Map(), input, input.length - 1, i, 'l')
		result.push(res2.size)
	}
	return Math.max(...result)
}

run({
	part1: {
		tests: [
			{
				input: `
.|...r....
|.-.r.....
.....|-...
........|.
..........
.........r
..../.rr..
.-.-/..|..
.|....-|.r
..//.|....`,
				expected: 46,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
    .|...r....
    |.-.r.....
    .....|-...
    ........|.
    ..........
    .........r
    ..../.rr..
    .-.-/..|..
    .|....-|.r
    ..//.|....`,
				expected: 51,
			},

		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
