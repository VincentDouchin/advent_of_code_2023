import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n\n').map(line => line.split('\n'))

const splitInMiddle = (input: string) => {
	const length = input.length
	const middleIndex = Math.ceil(length / 2)

	const firstPart = input.slice(0, middleIndex)
	const secondPart = [...input.slice(middleIndex)].reverse().join('')
	return firstPart === secondPart
}
const splitInMiddle2 = (input: string) => {
	const length = input.length
	const middleIndex = Math.ceil(length / 2)

	const firstPart = input.slice(0, middleIndex)
	const secondPart = [...input.slice(middleIndex)].reverse().join('')
	return differByOneCharacter(firstPart, secondPart)
}
function differByOneCharacter(str1: string, str2: string) {
	let differences = 0
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) {
			differences++
		}
	}
	return differences
}

const findMiddle = (p: string[]) => {
	for (let x = 0; x < p[0].length; x++) {
		if (p.every(l => splitInMiddle(l.slice(0, l.length - x)))) {
			console.log(p[0].length, x)
			return Math.floor(Math.abs(p[0].length - x) / 2)
		}
		if (p.every(l => splitInMiddle(l.slice(x, l.length)))) {
			return Math.floor((p[0].length - x) / 2) + x
		}
	}
	return 0
}
const findMiddle2 = (p: string[]) => {
	for (let x = 0; x < p[0].length; x++) {
		if (p.reduce((acc, l) => acc + splitInMiddle2(l.slice(0, l.length - x)), 0) === 1) {
			return Math.floor(Math.abs(p[0].length - x) / 2)
		}
		if (p.reduce((acc, l) => acc + splitInMiddle2(l.slice(x, l.length)), 0) === 1) {
			return Math.floor((p[0].length - x) / 2) + x
		}
	}
	return 0
}

const findVertMiddle = (p: string[]) => {
	const newP = [...p[0]].map((_, colIndex) => p.map(row => row[colIndex]).join(''))
	return findMiddle(newP) * 100
}
const findVertMiddle2 = (p: string[]) => {
	const newP = [...p[0]].map((_, colIndex) => p.map(row => row[colIndex]).join(''))
	return findMiddle2(newP) * 100
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return input.reduce((acc, v) => acc + findMiddle(v) + findVertMiddle(v), 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return input.reduce((acc, v) => acc + findMiddle2(v) + findVertMiddle2(v), 0)
}

run({
	part1: {
		tests: [
			{
				input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
				expected: 405,
			},
			{ input: `
.##..#..#........
.##..##.......#.#
#########.###....
..#..#..#....#.##
..#..#........#.#
#......##..###...
.######.#....####
#......###.######
..#..#..#..##....
..#..#..#..##....
#......###.######
.######.#....####
#......##..###...
..#..#........#.#
..#..#..#....#.##
#########.###....
.##..##.......#.#`, expected: 900 },
			{ input: `
###......####
..##....##...
.#.######.#..
#.###..###.##
#.##.....#.##
.#.##..##.#..
.##......##..
`, expected: 12 },

		],
		solution: part1,
	},
	part2: {
		tests: [
			// {
			//   input: ``,
			//   expected: "",
			// },
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
