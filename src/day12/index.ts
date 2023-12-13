import run from 'aocrunner'

const parseInput = (rawInput: string): [string, number[]][] => rawInput.split('\n').map(line => line.split(' ')).map(([parts, nbs]) => [parts, nbs.split(',').map(Number)])
const parseInput2 = (rawInput: string): [string, number[]][] => rawInput.split('\n').map(line => line.split(' ')).map(([parts, nbs]) => {
	const nbssplit = nbs.split(',').map(Number)
	const allNbs = Array.from({ length: 5 }).fill(null).flatMap(() => nbssplit)
	return [
		Array.from({ length: 5 }).fill(parts).join('?'),
		allNbs,
	]
})
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

const solveLine2 = (line: string, pattern: number[]) => {
	const walk = memo((pos: number, index: number): number => {
		if (pos >= line.length) return index < pattern.length ? 0 : 1

		let res = 0
		if (line[pos] === '.') {
			res += walk(pos + 1, index)
		} else {
			if (line[pos] === '?') {
				res += walk(pos + 1, index)
			}
			if (index < pattern.length) {
				let count = 0
				for (let i = pos; i < line.length; i++) {
					if (count > pattern[index] || line[i] === '.' || (count === pattern[index] && line[i] === '?')) {
						break
					}
					count += 1
				}

				if (count === pattern[index]) {
					const skip = line[pos + count] === '#' ? 0 : 1
					res += walk(pos + count + skip, index + 1)
				}
			}
		}

		return res
	})
	return walk(0, 0)
}

const solve2 = (input: [string, number[]][]) => {
	let result = 0
	for (const [parts, pattern] of input) {
		result += solveLine2(parts, pattern)
	}
	return result
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return solve2(input)
}

const part2 = (rawInput: string) => {
	const input = parseInput2(rawInput)
	const result = solve2(input)
	return result
}

run({
	part1: {
		tests: [],
		solution: part1,
	},
	part2: {
		tests: [
			{
			  input: `????.#...#... 4,1,1`,
			  expected: 16,
			},
			{
			  input: `?.??..#?##?# 1,6`,
			  expected: 571,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
