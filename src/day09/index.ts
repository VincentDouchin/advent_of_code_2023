import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(' ').map(Number)).filter(arr => arr.length)

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let res = 0
	for (const list of input) {
		let lastList = list
		const steps: number[] = [list.at(-1) ?? 0]
		while (lastList.some(nb => nb !== lastList[0])) {
			lastList = lastList.reduce<number[]>((acc, v, i) => {
				const next = lastList[i + 1]
				if (next !== undefined) {
					acc.push(next - v)
				}
				return acc
			}, [])
			steps.push(lastList.at(-1) ?? 0)
		}
		const sum = steps.reduce((acc, v) => acc + v, 0)

		res += sum
	}
	return res
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let res = 0
	for (const list of input) {
		let lastList = list
		const steps: number[] = [list.at(0) ?? 0]
		while (lastList.some(nb => nb !== lastList[0])) {
			lastList = lastList.reduce<number[]>((acc, v, i) => {
				const next = lastList[i + 1]
				if (next !== undefined) {
					acc.push(next - v)
				}
				return acc
			}, [])
			steps.push(lastList.at(0) ?? 0)
		}
		const sum = -steps.reduceRight((acc, v) => -acc - v, 0)
		res += sum
	}
	return res
}

run({
	part1: {
		tests: [
			{
			  input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
			  expected: 114,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
			  input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
			  expected: 2,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
