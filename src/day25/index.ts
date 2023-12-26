import run from 'aocrunner'

const parseInput = (rawInput: string): [string, string[]][] => rawInput.split('\n').map((l) => {
	const [k, c] = l.split(':')
	return [k, c.split(' ').filter(Boolean)]
})

const _queue = <T extends any[]>(fn: (...args: T) => void) => {
	const queue: T[] = []
	const process = () => {
		while (queue.length > 0) {
			const args = queue.pop()
			if (args) {
				fn(...args)
			}
		}
	}
	return (...args: T) => {
		queue.push(args)
		return process
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const nodes: Record<string, Array<string>> = {}
	for (const [k, connections] of input) {
		nodes[k] ??= []
		for (const c of connections) {
			nodes[k].push(c)
			nodes[c] ??= []
			nodes[c].push(k)
		}
	}
	const group = [Object.keys(nodes)[0]]
	const intcon = (n: string) => nodes[n].filter(n => group.includes(n)).length
	const extcon = (n: string) => nodes[n].filter(n => !group.includes(n)).length
	const externalConnections = () => group.reduce((acc, v) => {
		return acc + extcon(v)
	}, 0)

	const addNode = () => {
		let node: string | null = null
		let con = Number.POSITIVE_INFINITY
		for (const n of [...new Set(group.flatMap(n => nodes[n]))]) {
			if (!group.includes(n)) {
				const w = extcon(n) - intcon(n)
				if (w < con) {
					con = w
					node = n
				}
			}
		}
		group.push(node!)
	}
	while (externalConnections() !== 3) {
		addNode()
	}
	return (Object.keys(nodes).length - group.length) * group.length
}

run({
	part1: {
		tests: [
			{
				// hfx/pzl  bvb/cmg  jqt/nvd
				input: `
        jqt: rhn xhk nvd
        rsh: frs pzl lsr
        xhk: hfx
        cmg: qnr nvd lhk bvb
        rhn: xhk bvb hfx
        bvb: xhk hfx
        pzl: lsr hfx nvd
        qnr: nvd
        ntq: jqt hfx bvb xhk
        nvd: lhk
        lsr: lhk
        rzs: qnr cmg lsr rsh
        frs: qnr lhk lsr`,
				expected: 54,
			},
		],
		solution: part1,
	},
	trimTestInputs: true,
	onlyTests: false,
})
