import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map((l, i) => {
	const [s, e] = l.split('~').map((c) => {
		const [x, y, z] = c.split(',').map(Number)
		return { x, y, z }
	})
	const name = String.fromCharCode(i + 97)
	return { s, e, name }
})
interface Brick {
	name: string
	s: { x: number, y: number, z: number }
	e: { x: number, y: number, z: number }
}
const int = (b1: Brick, b2: Brick) => {
	return ((b1.s.x <= b2.e.x && b1.e.x >= b2.s.x) || (b2.s.x <= b1.e.x && b2.e.x >= b1.s.x))
		&& ((b1.s.y <= b2.e.y && b1.e.y >= b2.s.y) || (b2.s.y <= b1.e.y && b2.e.y >= b1.s.y))
}

const isUnder = (b: Brick, b2: Brick) => b2 !== b && int(b, b2) && b2.e.z === b.s.z - 1
const isAbove = (b: Brick, b2: Brick) => b2 !== b && int(b, b2) && b.e.z === b2.s.z - 1

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const bricks = input.sort((a, b) => a.s.z - b.s.z)
	const allAbove = (b: Brick) => bricks.filter(b2 => isAbove(b, b2))
	const allUnder = (b: Brick) => bricks.filter(b2 => isUnder(b, b2))
	for (const b of bricks) {
		while (allUnder(b).length === 0 && b.s.z > 0) {
			b.s.z--
			b.e.z--
		}
	}
	const namesBricks: [string, string[], string[]][] = bricks.map((b) => {
		const a = allAbove(b).map(x => x.name)
		const u = allUnder(b).map(x => x.name)
		return [b.name, a, u]
	})
	const all = new Set<string>()
	for (const [_name, _supports, supported] of namesBricks) {
		if (supported.length === 1) {
			all.add(supported[0])
		}
	}
	return namesBricks.length - all.size
}
const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const bricks = input.sort((a, b) => a.s.z - b.s.z)
	const allAbove = (b: Brick) => bricks.filter(b2 => isAbove(b, b2))
	const allUnder = (b: Brick) => bricks.filter(b2 => isUnder(b, b2))
	for (const b of bricks) {
		while (allUnder(b).length === 0 && b.s.z > 0) {
			b.s.z--
			b.e.z--
		}
	}
	const getAllAboveBricks = (b: Brick) => {
		const fallen = [b]
		let total = 0
		const queue = allAbove(b)
		while (queue.length) {
			const b2 = queue.pop()
			if (b2 && allUnder(b2).every(b3 => fallen.includes(b3))) {
				fallen.push(b2)
				total += 1
				queue.push(...allAbove(b2))
			}
		}
		return total
	}
	return bricks.reduce((acc, v) => acc + getAllAboveBricks(v), 0)
}

run({
	part1: {
		tests: [
			{
				input: `
				1,0,1~1,2,1
				0,0,2~2,0,2
				0,2,3~2,2,3
				0,0,4~0,2,4
				2,0,5~2,2,5
				0,1,6~2,1,6
				1,1,8~1,1,9`,
				expected: 5,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
				1,0,1~1,2,1
				0,0,2~2,0,2
				0,2,3~2,2,3
				0,0,4~0,2,4
				2,0,5~2,2,5
				0,1,6~2,1,6
				1,1,8~1,1,9`,
				expected: 7,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
