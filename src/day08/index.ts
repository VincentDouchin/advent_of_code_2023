import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	const [directions, nodesRaw] = rawInput.split('\n\n') as [('R' | 'L')[], string]
	const nodes = nodesRaw.split('\n').filter(x => x.length).reduce<Record<string, { R: string, L: string }>>((acc, v) => {
		const [adress, L, R] = v.match(/\b[A-Z0-9]{3}\b/g)!
		return { ...acc, [adress]: { L, R } }
	}, {})

	return { directions, nodes }
}

const part1 = (rawInput: string) => {
	const { directions, nodes } = parseInput(rawInput)
	let lastNode = 'AAA'
	let step = 0
	while (lastNode !== 'ZZZ') {
		const direction = directions[step % directions.length]
		lastNode = nodes[lastNode][direction]
		step++
	}
	return step
}

export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)

const part2 = (rawInput: string) => {
	const { directions, nodes } = parseInput(rawInput)
	const startNodes = Object.keys(nodes).filter(n => n[2] === 'A')
	const steps = startNodes.map((n) => {
  	let lastNode = n
		let step = 0
		while (lastNode[2] !== 'Z') {
			const direction = directions[step % directions.length]
			lastNode = nodes[lastNode][direction]
			step++
		}
		return step
	})
	console.log(steps)
	return steps.reduce(lcm)
}

const example = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`
const example2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`
const example3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`
run({
	part1: { tests: [
		{ input: example, expected: 2 },
		{ input: example2, expected: 6 },
	], solution: part1 },
	part2: {
		tests: [
			{
			  input: example3,
			  expected: 6,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
