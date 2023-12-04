import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
	const lines = input.split('\n')
	const linesNumbers = lines.map((line) => {
		const numbers = [...line].filter(character => character.match(/[0-9]/))
		if (numbers.length === 0) return 0
		return Number(numbers[0] + numbers.at(-1))
	})
	return linesNumbers.reduce((acc, v) => acc + v, 0)
}
const numbersMap = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
}
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
const lines = input.split('\n').filter(line => line.length)
	const linesNumbers = lines.map((line) => {
		const numbers: string[] = []
		for (let i = 0; i < line.length; i++) {
			if (line[i].match(/[0-9]/))numbers.push(line[i])
			for (const text of Object.keys(numbersMap)) {
				if (line.slice(i, i + text.length) === text) {
					numbers.push(String(numbersMap[text as keyof typeof numbersMap]))
				}
			}
		}
		return Number(numbers[0] + numbers.at(-1))
	})
	return linesNumbers.reduce((acc, v) => acc + v, 0)
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
