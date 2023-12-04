import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput

const getGames = (inputFile: string) => inputFile.split('\n').filter(l => l.length).map((line) => {
	const id = line.match(/Game (\d+):/)?.[1]
	const draws = line.split(':')[1].split(';').map((d) => {
		const red = Number(d.match(/(\d+) red/)?.[1] ?? 0)
		const green = Number(d.match(/(\d+) green/)?.[1] ?? 0)
		const blue = Number(d.match(/(\d+) blue/)?.[1] ?? 0)
		return { red, green, blue }
	})

	return { id, draws }
})
const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const games = getGames(input)
	const max = { red: 12, green: 13, blue: 14 }
	const possibleGames = games.filter((g) => {
		return g.draws.every(({ red, green, blue }) => red <= max.red && blue <= max.blue && green <= max.green)
	})
	return possibleGames.reduce((acc, v) => acc + Number(v.id), 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const games = getGames(input)
	const minimum = games.map(({ draws }) => {
		return draws.reduce((acc, v) => {
			return {
				red: Math.max(acc.red, v.red),
				blue: Math.max(acc.blue, v.blue),
				green: Math.max(acc.green, v.green),
			}
		}, { red: 0, green: 0, blue: 0 })
	})
	return minimum.reduce((acc, v) => {
		return acc + [v.red, v.green, v.blue].filter(color => color !== 0).reduce((total, color) => total * color, 1)
	}, 0)
	
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
