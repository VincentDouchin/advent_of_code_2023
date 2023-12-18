import { writeFile } from 'node:fs/promises'
import run from 'aocrunner'

type Dir = 'D' | 'R' | 'L' | 'U'
const parseInput = (rawInput: string) => rawInput.split('\n').map(l => l.split(' ')).map(([dir, nb, color]) => {
	return { dir, nb: Number(nb), color: color.replace(/[\(\)]/g, '') } as { dir: Dir, nb: number, color: string }
})

const coords: Record<Dir, { x: number, y: number }> = {
	D: { x: 0, y: -1 },
	U: { x: 0, y: 1 },
	R: { x: 1, y: 0 },
	L: { x: -1, y: 0 },
}

interface Node {
	x: number
	y: number
	is7?: boolean
	isF?: boolean
}

const getTotal = (input: { dir: Dir, nb: number }[]) => {
	const nodes = []
	let minX = Number.POSITIVE_INFINITY
	let maxX = 0
	let minY = Number.POSITIVE_INFINITY
	let maxY = 0
	for (let n = 0; n < input.length; n++) {
		const { dir, nb } = input[n]
		const nextLine = input[(n + 1) % input.length]
		const offset = coords[dir]
		for (let i = 0; i < nb - 1; i++) {
			const lastNode = nodes.at(-1) ?? { x: 0, y: 0 }
			const newNode: Node = { x: lastNode.x + offset.x, y: lastNode.y + offset.y }
			if (newNode.x < minX) minX = newNode.x
			if (newNode.x > maxX) maxX = newNode.x
			if (newNode.y < minY) minY = newNode.y
			if (newNode.y > maxY) maxY = newNode.y
			nodes.push(newNode)
		}
		const lastNode = nodes.at(-1) ?? { x: 0, y: 0 }
		const newNode: Node = { x: lastNode.x + offset.x, y: lastNode.y + offset.y, is7: dir === 'D' && nextLine.dir === 'L' || dir === 'R' && nextLine.dir === 'U', isF: dir === 'U' && nextLine.dir === 'L' || dir === 'R' && nextLine.dir === 'D' }
		if (newNode.x < minX) minX = newNode.x
		if (newNode.x > maxX) maxX = newNode.x
		if (newNode.y < minY) minY = newNode.y
		if (newNode.y > maxY) maxY = newNode.y
		nodes.push(newNode)
	}
	let total = 0
	for (let y = minY; y <= maxY; y++) {
		let digging = false
		const t = 0
		const line = nodes.filter(n => n.y === y).sort((a, b) => a.x - b.x)
		for (let x = minX; x <= maxX; x++) {
			const isNode = line.find(n => n.x === x)
			const is7 = isNode?.is7
			const isF = isNode?.isF
			const isPipe = nodes.some(n => n.x === x && n.y === y - 1) && nodes.some(n => n.x === x && n.y === y + 1)
			const right = isNode && (is7 || isF || isPipe)
			if (right) digging = !digging
			if (!isNode && digging) total++
		}
		total += t
	}
	return total + nodes.length
}
const getTotal2 = (input: { dir: Dir, nb: number }[]) => {
	const nodes: { x: number, y: number }[] = [{ x: 0, y: 0 }]
	for (let n = 0; n < input.length; n++) {
		const { dir, nb } = input[n]
		const offset = coords[dir]

		const lastNode = nodes.at(-1)!
		const newNode: Node = { x: lastNode.x + offset.x * nb, y: lastNode.y + offset.y * nb }

		nodes.push(newNode)
	}

	let sum1 = 0
	let sum2 = 0
	for (let i = 0; i < nodes.length - 1; i++) {
		const node = nodes[i]
		const nextNode = nodes[i + 1]
		sum1 += node.x * nextNode.y
		sum2 += node.y * nextNode.x
	}
	sum1 += nodes[nodes.length - 1].x * nodes[0].y
	sum2 += nodes[0].x * nodes[nodes.length - 1].y
	const length = input.reduce((acc, v) => acc + v.nb, 0)
	return Math.abs(sum1 - sum2) / 2 + Math.floor(length / 2) + 1
}
const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	return getTotal(input)
}
const dirMap: Dir[] = ['R', 'D', 'L', 'U']
const parseInput2 = (rawInput: string) => rawInput.split('\n').map((l) => {
	const color = l.split('#')[1].split(')')[0]
	const dir: Dir = dirMap[Number(color!.at(-1))]
	const nb = Number.parseInt(color.slice(0, 5), 16)
	return { dir, nb }
})
const part2 = (rawInput: string) => {
	const input = parseInput2(rawInput)
	return getTotal2(input)
}

run({
	part1: {
		tests: [
			{
				input: `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
				expected: 62,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
			R 6 (#70c710)
			D 5 (#0dc571)
			L 2 (#5713f0)
			D 2 (#d2c081)
			R 2 (#59c680)
			D 2 (#411b91)
			L 5 (#8ceee2)
			U 2 (#caa173)
			L 1 (#1b58a2)
			U 2 (#caa171)
			R 2 (#7807d2)
			U 3 (#a77fa3)
			L 2 (#015232)
			U 2 (#7a21e3)`,
				expected: 952408144115,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
