import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split(',')

const hash = (str: string) => {
	let res = 0
	for (const char of str.split('')) {
		res += char.charCodeAt(0)
		res *= 17
		res = res % 256
	}
	return res
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return input.reduce((acc, v) => {
		return acc + hash(v)
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const boxes: Array<Map<string, number>> = Array.from({ length: 256 }).map(() => new Map())
	for (const lens of input) {
		const label = lens.match(/([^=-]+)[=-]/)![1]
		const box = hash(label)
		if (lens.includes('=')) {
			const power = Number(lens.split('=')[1])
			boxes[box].set(label, power)
		} else {
			boxes[box].delete(label)
		}
	}
	return boxes.reduce((acc, v, i) => {
		return acc + [...v.values()].reduce((total, pow, slot) => {
			return total + (slot + 1) * pow * (i + 1)
		}, 0)
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `HASH`,
				expected: 52,
			},
			{
				input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
				expected: 1320,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
				expected: 145,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
