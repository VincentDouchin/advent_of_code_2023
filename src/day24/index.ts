import run from 'aocrunner'
import { init } from 'z3-solver'

interface Vec3 {
	x: number
	y: number
	z: number
}

interface Point {
	pos: Vec3
	vel: Vec3
	key: string
}

const parseInput = (rawInput: string): Point[] => rawInput.split('\n').map((l, i) => {
	const [posArr, velArr] = l.split('@').map(x => x.split(',').map(Number))
	return {
		pos: { x: posArr[0], y: posArr[1], z: posArr[2] },
		vel: { x: velArr[0], y: velArr[1], z: velArr[2] },
		key: String.fromCharCode(97 + i),
	}
})
function intersects(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
	const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
	if (denom === 0) return null
	const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
	return {
		x: x1 + ua * (x2 - x1),
		y: y1 + ua * (y2 - y1),
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const intersections = new Set<string>()
	for (const point1 of input) {
		for (const point2 of input) {
			if (point1 !== point2) {
				const [pointA, pointB] = [point1, point2]
				const MIN = 200000000000000
				const MAX = 400000000000000
				const xa1 = pointA.pos.x
				const xa2 = pointA.pos.x + pointA.vel.x
				const xb1 = pointB.pos.x
				const xb2 = pointB.pos.x + pointB.vel.x
				const ya1 = pointA.pos.y
				const ya2 = pointA.pos.y + pointA.vel.y
				const yb1 = pointB.pos.y
				const yb2 = pointB.pos.y + pointB.vel.y
				const int = intersects(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2)
				if (!int) continue
				if (MIN <= int.x && int.x <= MAX && MIN <= int.y && int.y <= MAX) {
					if ((int.x > xa1) === (xa2 - xa1 > 0) && (int.y > ya1) === (ya2 - ya1 > 0) && (int.x > xb1) === (xb2 - xb1 > 0) && (int.y > yb1) === (yb2 - yb1 > 0)) {
						const key = [pointA.key, pointB.key].sort().join(',')
						intersections.add(key)
					}
				}
			}
		}
	}
	return intersections.size
}

const { Context } = await init()
const part2 = async (rawInput: string) => {
	const input = parseInput(rawInput).slice(0, 3)
	const { Solver, Int } = Context('main')
	const x = Int.const('x')
	const y = Int.const('y')
	const z = Int.const('z')
	const dx = Int.const('dx')
	const dy = Int.const('dy')
	const dz = Int.const('dz')
	const solver = new Solver()
	for (let i = 0; i < input.length; i++) {
		const t = Int.const(`t${i}`)
		const p = input[i]
		solver.add(t.mul(p.vel.x).add(p.pos.x).sub(x).sub(t.mul(dx)).eq(0))
		solver.add(t.mul(p.vel.y).add(p.pos.y).sub(y).sub(t.mul(dy)).eq(0))
		solver.add(t.mul(p.vel.z).add(p.pos.z).sub(z).sub(t.mul(dz)).eq(0))
	}
	await solver.check()
	const solution = Number(solver.model().eval(x.add(y).add(z)))
	console.log('solution', solution)
	return solution
}

run({
	part1: {
		tests: [
			{
				input: `
				19, 13, 30 @ -2,  1, -2
				18, 19, 22 @ -1, -1, -2
				20, 25, 34 @ -2, -2, -4
				12, 31, 28 @ -1, -2, -1
				20, 19, 15 @  1, -5, -3`,
				expected: 2,
			},
		],
		solution: part1,
	},
	part2: {
		// tests: [
		// 	{
		// 		input: `
		// 		19, 13, 30 @ -2,  1, -2
		// 		18, 19, 22 @ -1, -1, -2
		// 		20, 25, 34 @ -2, -2, -4
		// 		12, 31, 28 @ -1, -2, -1
		// 		20, 19, 15 @  1, -5, -3`,
		// 		expected: 47,
		// 	},
		// ],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
