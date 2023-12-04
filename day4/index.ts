import { readFile } from 'node:fs/promises'

async function main() {
	const inputFile = await readFile('./day4/input.txt', 'utf-8')
// 	const inputFile = `
// 	Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`
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
			for (let a = i + 1; a < i + amount; a++) {
				if (points[a]) {
					points[a] += points[i]
				}
			}
		}
		const result = points.reduce((acc, v) => acc + v, 0)
		console.log(result)
	}
}
main()