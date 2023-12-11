import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const expandedX = input.flatMap(line => !line.includes('#') ? [line, line] : line)
	const emptyCols: number[] = []
	for (let i = 0; i < expandedX[0].length; i++) {
		if (expandedX.every(line => line[i] !== '#')) {
			emptyCols.push(i)
		}
	}
	const expanded = expandedX.map((line) => {
		return line.split('').flatMap((x, i) => emptyCols.includes(i) ? [x, x] : x)
	})

	const galaxies: { x: number, y: number, id: number }[] = []

	for (let y = 0; y < expanded.length; y++) {
		const row = expanded[y]
		for (let x = 0; x < row.length; x++) {
			if (row[x] === '#') {
				galaxies.push({ x, y, id: galaxies.length + 1 })
			}
		}
	}
	const pairs = new Map<string, number>()
	for (const start of galaxies) {
		for (const end of galaxies) {
			if (start.id !== end.id) {
				const distance = Math.abs(end.y - start.y) + Math.abs(end.x - start.x)
				pairs.set([start.id, end.id].sort().join('--'), distance)
			}
		}
	}

	const steps = [...pairs.values()].reduce((acc, v) => acc + v, 0)
	return steps
}

const part2 = (rawInput: string) => {
	const factor = 1000000
	const input = parseInput(rawInput)
	const emptyRows: number[] = []
	for (let y = 0; y < input.length; y++) {
		if (!input[y].includes('#')) {
			emptyRows.push(y)
		}
	}
	const emptyCols: number[] = []
	for (let x = 0; x < input[0].length; x++) {
		if (input.every(line => line[x] !== '#')) {
			emptyCols.push(x)
		}
	}
	const galaxies: { x: number, y: number, id: number }[] = []

	for (let y = 0; y < input.length; y++) {
		const row = input[y]
		for (let x = 0; x < row.length; x++) {
			if (row[x] === '#') {
				galaxies.push({
					x: x + Math.max((emptyCols.filter(nb => nb < x).length), 0) * (factor - 1),
					y: y + Math.max((emptyRows.filter(nb => nb < y).length), 0) * (factor - 1),
					id: galaxies.length + 1,
				})
			}
		}
	}
	const pairs = new Map<string, number>()
	for (const start of galaxies) {
		for (const end of galaxies) {
			if (start.id !== end.id) {
				const distance = Math.abs(end.y - start.y) + Math.abs(end.x - start.x)
				pairs.set([start.id, end.id].sort().join('--'), distance)
			}
		}
	}
	const steps = [...pairs.values()].reduce((acc, v) => acc + v, 0)
	return steps
}

run({
	part1: {
		tests: [
			{
			  input: `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
			  expected: 374,
			},

		],
		solution: part1,
	},
	part2: {
		tests: [
			{
			  input: `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
			  expected: 374,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
