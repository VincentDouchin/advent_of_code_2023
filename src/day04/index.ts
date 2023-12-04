import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	const lines = rawInput.split('\n').filter(l => l.length)
	return lines.map((l) => {
		return l.split(':')[1].split('|').map((r) => {
			return r.split(' ').map(Number).filter(Boolean)
		})
	})
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const points = input.reduce((acc, v) => {
		const point = v[0].reduce((total, w) => {
			const winning = v[1].includes(w)
			const amount = total === 0 ? 1 : total * 2
			return winning ? amount : total
		}, 0)
		return acc + point
	}, 0)
	return points
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const points = input.map(() => 1)
	for (let i = 0; i < input.length; i++) {
		const [winning, numbers] = input[i]
		const amount = winning.reduce((total, w) => numbers.includes(w) ? total + 1 : total, 1)
		for (let j = i + 1; j < i + amount; j++) {
			if (points[j]) {
				points[j] += points[i]
			}
		}
	}
	return points.reduce((acc, v) => acc + v, 0)
}

run({
	part1: {
		tests: [
			// {
			//   input: ``,
			//   expected: "",
			// },
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
