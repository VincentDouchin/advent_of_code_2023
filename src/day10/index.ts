import run from 'aocrunner'

type Dir = 's' | 'n' | 'w' | 'e'
const parseInput = (rawInput: string) => rawInput.split('\n')
const directions: Record<Dir, { x: number, y: number }> = {
	n: { x: 0, y: -1 },
	s: { x: 0, y: 1 },
	e: { x: 1, y: 0 },
	w: { x: -1, y: 0 },
}
const opposites: Record<Dir, Dir> = {
	n: 's',
	s: 'n',
	e: 'w',
	w: 'e',
}
const map: Record<string, Dir[]> = {
	'|': ['n', 's'],
	'-': ['e', 'w'],
	'L': ['n', 'e'],
	'J': ['n', 'w'],
	'7': ['s', 'w'],
	'F': ['s', 'e'],
	'S': ['s', 'w', 'n', 'e'],
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const start = input.reduce((acc, v, y) => v.includes('S') ? { y, x: v.indexOf('S') } : acc, { y: 0, x: 0 })

	let lastdir: Dir = 's'
	let last: null | string = null
	let steps = 0
	let lastpos = start

	while (last !== 'S') {
		const offset: { x: number, y: number } = directions[lastdir]
		const next = input[lastpos.y + offset.x]?.[lastpos.x + offset.y]

		lastdir = map[next].find(x => x !== opposites[lastdir])!
		steps++
		lastpos = { x: lastpos.x + offset.x, y: lastpos.y + offset.y }
		last = next
	}
	return steps / 2
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const start = input.reduce((acc, v, y) => v.includes('S') ? { y, x: v.indexOf('S') } : acc, { y: 0, x: 0 })
	const points = [{ ...start, s: '7' }]
	let lastdir: Dir = 's'
	let last = null

	let lastpos = { ...start }

	while (last !== 'S') {
		const offset: { x: number, y: number } = directions[lastdir]
		const next = input[lastpos.y + offset.x]?.[lastpos.x + offset.y]

		lastdir = map[next].find(x => x !== opposites[lastdir])!
		lastpos = { x: lastpos.x + offset.x, y: lastpos.y + offset.y }
		last = next
		points.push({ x: lastpos.x, y: lastpos.y, s: next })
	}

	let tiles = 0
	for (let i = 0; i < input.length; i++) {
		let ins = false
		const p = points.filter(x => x.y === i)
		for (let j = 0; j < input[i].length - 1; j++) {
			const fo = p.find(x => x.x === j)?.s
			const right = fo && ['7', 'F', '|'].includes(fo)

			if (right) ins = !ins
			if (!fo && ins) tiles++
		}
	}
	return tiles
}

const example = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`
run({
	part1: {
		tests: [
			{
				input: example,
				expected: 8,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
				expected: 8,
			},
			{
				input: `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
				expected: 10,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
