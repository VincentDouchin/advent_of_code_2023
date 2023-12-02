import { readFile } from 'node:fs/promises'

async function main() {
	const inputFile = await readFile('./day2/input.txt', 'utf-8')
	const games = inputFile.split('\n').filter(l => l.length).map((line) => {
		const id = line.match(/Game (\d+):/)?.[1]
		const draws = line.split(':')[1].split(';').map((d) => {
			const red = Number(d.match(/(\d+) red/)?.[1] ?? 0)
			const green = Number(d.match(/(\d+) green/)?.[1] ?? 0)
			const blue = Number(d.match(/(\d+) blue/)?.[1] ?? 0)
			return { red, green, blue }
		})

		return { id, draws }
	})
	// ! PART1
	{
		const max = { red: 12, green: 13, blue: 14 }
		const possibleGames = games.filter((g) => {
			return g.draws.every(({ red, green, blue }) => red <= max.red && blue <= max.blue && green <= max.green)
		})
		const result = possibleGames.reduce((acc, v) => acc + Number(v.id), 0)
		console.log(result) // 2101
	}
	// ! PART2
	{
		const minimum = games.map(({ draws }) => {
			return draws.reduce((acc, v) => {
				return {
					red: Math.max(acc.red, v.red),
					blue: Math.max(acc.blue, v.blue),
					green: Math.max(acc.green, v.green),
				}
			}, { red: 0, green: 0, blue: 0 })
		})
		const result = minimum.reduce((acc, v) => {
			return acc + [v.red, v.green, v.blue].filter(color => color !== 0).reduce((total, color) => total * color, 1)
		}, 0)
		console.log(result) // 58269
	}
}
main()