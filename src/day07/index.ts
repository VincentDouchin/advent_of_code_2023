import run from 'aocrunner'

const strength = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const strengthWithJoker = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
const letters = 'abcdefghijklmnopqrstuvwxyz'
const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(' '))

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const types = input.map(([cards, bid]) => {
		const same = [...new Set(cards.split(''))].map(c => cards.split('').filter(x => x === c).length).sort((a, b) => b - a).join('')
		const cardsPoints = cards.split('').map(c => letters[strength.indexOf(c)]).join('')
		return { same, cards, bid: Number(bid), cardsPoints }
	})
		.sort((a, b) => b.cardsPoints.localeCompare(a.cardsPoints))
		.sort((a, b) => a.same.localeCompare(b.same))
		.map((x, i) => ({ ...x, rank: i + 1 }))
		.reduce((acc, v) => acc + v.bid * v.rank, 0)
	return types
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const types = input.map(([cards, bid]) => {
		const s = [...new Set(cards.split(''))]
			.map(c => c === 'J' ? 0 : cards.split('').filter(x => x === c).length)
			.sort((a, b) => b - a)
			.map((c, i) => i === 0 ? c + (cards.match(/J/g)?.length ?? 0) : c)
			.join('')
			.padEnd(5, '0')
		const p = cards.split('').map(c => letters[strengthWithJoker.indexOf(c)]).join('')
		return { s, c: cards, b: Number(bid), p }
	})
		.sort((a, b) => b.p.localeCompare(a.p))
		.sort((a, b) => a.s.localeCompare(b.s))
		.map((x, i) => ({ ...x, r: i + 1 }))
	console.log([...types].reverse())
	return types.reduce((acc, v) => acc + v.b * v.r, 0)
}
const example = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`
run({
	part1: { tests: [{ input: example, expected: 6440 }], solution: part1 },
	part2: { tests: [{ input: example, expected: 5905 }], solution: part2 },
	trimTestInputs: true,
	onlyTests: false,
})
