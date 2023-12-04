import { readFile } from 'node:fs/promises'

async function main() {
	const inputFile = await readFile('./day4/input.txt', 'utf-8')
	const lines = inputFile.split('\n').filter(l => l.length)
	const linesFormatted = lines.map((l) => {
		return l.split(':')[1].split('|').map((r) => {
			return r.split(' ').map(Number).filter(Boolean)
		})
	})
	{ // ! Part 1
		const points = linesFormatted.reduce((acc, v) => {
			const point = v[0].reduce((total, w) => {
				const winning = v[1].includes(w)
				const amount = total === 0 ? 1 : total * 2
				return winning ? amount : total
			}, 0)
			return acc + point
		}, 0)
		console.log(points) // 23441
	}
	{ // ! Part 2
		const points = linesFormatted.map(() => 1)
		for (let i = 0; i < linesFormatted.length; i++) {
			const [winning, numbers] = linesFormatted[i]
			const amount = winning.reduce((total, w) => numbers.includes(w) ? total + 1 : total, 1)
			for (let j = i + 1; j < i + amount; j++) {
				if (points[j]) {
					points[j] += points[i]
				}
			}
		}
		const result = points.reduce((acc, v) => acc + v, 0)
		console.log(result) // 5923918
	}
}
main()