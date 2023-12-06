import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(':')[1].split(/ /).filter(n => n.length).map(Number))
const parseInput2 = (rawInput: string) => rawInput.split('\n').map(l => l.split(':')[1].replace(/ /g, '')).map(Number)

const part1 = (rawInput: string) => {
	const [times, distances] = parseInput(rawInput)
	let res = 1
	for (let i = 0; i < times.length; i++) {
		let won = 0
		for (let t = 0; t < times[i]; t++) {
			const d = (times[i] - t) * t
			if (d > distances[i]) {
				won++
			}
		}
		res *= won
	}

	return res
}

const part2 = (rawInput: string) => {
	const [time, distance] = parseInput2(rawInput)
  	let won = 0
	for (let t = 0; t < time; t++) {
		const d = (time - t) * t
		if (d > distance) {
			won++
		}
	}
	return won
}

const example = `
Time:      7  15   30
Distance:  9  40  200`
run({
	part1: { tests: [{ input: example, expected: 288 }], solution: part1 },
	part2: { tests: [{ input: example, expected: 71503 }], solution: part2 },
	trimTestInputs: true,
	onlyTests: false,
})
