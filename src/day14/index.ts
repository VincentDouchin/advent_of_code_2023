import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(''))
const memo = (fn: (...a: any[]) => any) => {
	const cache: Record<string, any> = {}
	return (...args: any[]) => {
		const argString = JSON.stringify(args)

		const result = cache[argString] === undefined
			? fn(...args)
			: cache[argString]
		cache[argString] = result
		return result
	}
}
const reverseLine = (l: string[]) => l.reverse()
const transposeLine = (m: string[][], i: number) => m.map(row => row[i])
const transposeLineReversed = (m: string[][], i: number) => m.map(row => row[i]).reverse()
const transpose = (m: string[][]) => [...m[0]].map((_, colIndex) => transposeLine(m, colIndex))
const transposeReversed = (m: string[][]) => [...m[0]].map((_, colIndex) => transposeLineReversed(m, colIndex))
const reverse = (m: string[][]) => m.map(l => reverseLine(l))
const _displayMatrix = <T>(m: T[][]) => {
	console.log(m.map(x => x.join('')).join('\n'))
	console.log('\n')
}
const sortPart = memo((p: string) => [...p].sort((a, b) => (b === 'O' ? 1 : 0) - (a === 'O' ? 1 : 0)).join(''))
const sortLine = (l: string[]) => {
	return l.join('').split('#').map(x => sortPart(x)).join('#').split('')
}
const sortMatrix = (m: string[][]) => m.map((l) => {
	return sortLine(l)
})

const sumLoad2 = (m: string[][]) => m.reduce((acc, v, i) => {
	return acc + v.filter(x => x === 'O').length * (v.length - i)
}, 0)

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const t = transpose(input)
	const s = sortMatrix(t)
	return sumLoad2(transpose(s))
	// const sorted = transpose(input).map((l) => {
	// 	return l.join('').split('#').map(x => [...x].sort((a, b) => (b === 'O' ? 1 : 0) - (a === 'O' ? 1 : 0)).join('')).join('#').split('')
	// })
	// return sorted.reduce((acc, v) => {
	// 	return acc + v.reduce((total, x, i) => total + (x === 'O' ? v.length - i : 0), 0)
	// }, 0)
}

const cycle = memo((m: string[][]) => {
	let res = m
	// N
	res = transpose(res)
	res = sortMatrix(res)
	// W
	res = transpose(res)
	res = sortMatrix(res)
	// E
	res = transposeReversed(res)
	res = sortMatrix(res)
	// S
	res = transposeReversed(res)
	res = sortMatrix(res)
	// init
	res = transpose(transposeReversed(reverse(res)))
	return res
})

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	// const test = [['.', 'N', '.'], ['W', '.', 'E'], ['.', 'S', '.']]
	console.time('part2')
	let c = input
	const results: number[] = []
	let startLoop = null
	const history: string[] = []
	let cycles = 0
	while (!startLoop) {
		c = cycle(c)
		results.push(sumLoad2(c))
		cycles++
		const matrixStringified = c.map(x => x.join('')).join('')
		const alreadyPresent = history.find(x => x === matrixStringified)
		if (alreadyPresent) {
			startLoop = history.indexOf(matrixStringified)
		}
		history.push(matrixStringified)
	}
	startLoop++
	console.log(startLoop, cycles)
	const loopLenght = cycles - startLoop
	console.log(results)
	console.log({ loopLenght, cycles, startLoop }, (1_000_000_000 - startLoop) % loopLenght)
	return results[startLoop + (1_000_000_000 - startLoop) % loopLenght - 1]
}

run({
	part1: {
		tests: [
			{
				input: `
        OOOO.#.O..
        OO..#....#
        OO..O##..O
        O..#.OO...
        ........#.
        ..#....#.#
        ..O..#.O.O
        ..O.......
        #....###..
        #....#....`,
				expected: 136,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
			  				input: `
			  OOOO.#.O..
			  OO..#....#
			  OO..O##..O
			  O..#.OO...
			  ........#.
			  ..#....#.#
			  ..O..#.O.O
			  ..O.......
			  #....###..
			  #....#....`,
			  expected: 64,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
