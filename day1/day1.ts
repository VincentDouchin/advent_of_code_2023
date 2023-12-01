import { readFile } from 'node:fs/promises'

async function part1() {
	const input = await readFile('./input.txt', 'utf-8')
	const lines = input.split('\n')
	const linesNumbers = lines.map((line) => {
		const numbers = [...line].filter(character => character.match(/[0-9]/))
		if (numbers.length === 0) return 0
		return Number(numbers[0] + numbers.at(-1))
	})
	return linesNumbers.reduce((acc, v) => acc + v, 0)
}
console.log(await part1())
// 55488
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
async function part2() {
	const input = await readFile('./input.txt', 'utf-8')
	const lines = input.split('\n').filter(line => line.length)
	const linesNumbers = lines.map((line) => {
		const numbers: string[] = []
		for (let i = 0; i < line.length; i++) {
			if (line[i].match(/[0-9]/))numbers.push(line[i])
			const part = [...line].slice(i, line.length)
			for (const text of Object.keys(numbersMap)) {
				if (part.slice(0, text.length).join('') === text) {
					numbers.push(String(numbersMap[text as keyof typeof numbersMap]))
				}
			}
		}
		return Number(numbers[0] + numbers.at(-1))
	})
	return linesNumbers.reduce((acc, v) => acc + v, 0)
}
// 55614
console.log(await part2())
