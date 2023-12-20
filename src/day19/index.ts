import run from "aocrunner"

type Rule = {
	key: 'x' | 'm' | 's' | 'a',
	condition: '>' | '<'
	nb: number
	next: string
}
interface Part {
	x: number
	m: number
	a: number
	s: number
}

const parseInput = (rawInput: string) => {
	const [wfRaw, partsRaw] = rawInput.split('\n\n')
	const wf: Record<string, Rule[]> = wfRaw.split('\n').reduce((acc, v) => {
		const [name, rulesRaw] = v.replace('}', '').split('{')
		const rules = rulesRaw.split(',').map(rule => {
			const key = rule.split(/[><]/)[0]
			const condition = rule.match(/[<>]/)?.[0]
			const amount = rule.match(/(\d+)/)?.[0]
			const nb = amount ? Number(amount) : undefined
			const next = rule.split(':')?.[1]
			if (!condition) return { next: key }
			return { key, condition, nb, next }
		})

		return { ...acc, [name]: rules }
	}, {})
	const parts: Part[] = partsRaw.split('\n').map(p => {
		return p.replace(/[\}\{}]/g, '').split(',').reduce((acc, v) => {
			const [key, val] = v.split('=')
			return { ...acc, [key]: Number(val) }
		}, {} as Part)
	})
	return { wf, parts }
}



const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0
	const processPart = (part: Part, wf: string): boolean => {
		if (wf === 'A') return true
		if (wf === 'R') return false
		const rules = input.wf[wf]
		for (const rule of rules) {
			if (rule.condition === '<') {
				if (part[rule.key] < rule.nb) {
					return processPart(part, rule.next)
				}
			} else if (rule.condition === '>') {
				if (part[rule.key] > rule.nb) {
					return processPart(part, rule.next)
				}
			} else {
				return processPart(part, rule.next)
			}
		}
		return false
	}

	for (const part of input.parts) {
		if (processPart(part, 'in')) {
			total += part.x + part.a + part.m + part.s
		}

	}


	return total
}

interface MultiPart {
	x: { max: number, min: number }
	m: { max: number, min: number }
	a: { max: number, min: number }
	s: { max: number, min: number }
}
const clonePart = (part: MultiPart) => ({
	x: { ...part.x },
	m: { ...part.m },
	a: { ...part.a },
	s: { ...part.s },
})
const getPossibilities = (part: MultiPart) => {
	let total = 1
	for (const key of ['x', 'm', 'a', 's'] as const) {
		total *= (part[key].max - part[key].min)
	}
	return total
}
const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0
	const t: Record<string, MultiPart> = {}
	const processPart = (part: MultiPart, wf: string, prev: string): void => {

		if (wf === 'A') {
			total += getPossibilities(part)
			return
		}
		if (wf === 'R') return
		const rules = input.wf[wf]
		for (const rule of rules) {
			const newKey = prev + '-' + rule.next
			const xmas = part[rule.key]
			if (rule.condition === '<') {
				if (xmas.max <= rule.nb) {
					processPart(part, rule.next, newKey)
				} else if (xmas.min < rule.nb) {
					const newPart = { ...part, [rule.key]: { ...xmas, max: rule.nb } }
					processPart(newPart, rule.next, newKey)
					part = { ...part, [rule.key]: { max: xmas.max, min: rule.nb, } }
					continue
				}

			} if (rule.condition === '>') {
				if (xmas.min > rule.nb) {
					processPart(part, rule.next, newKey)
				} else if (xmas.max > rule.nb + 1) {
					const newPart = { ...part, [rule.key]: { ...xmas, min: rule.nb + 1 } }
					processPart(newPart, rule.next, newKey)
					part = { ...part, [rule.key]: { ...xmas, max: rule.nb + 1, } }
					continue
				}
			} else {
				processPart(part, rule.next, newKey)
			}
		}
	}
	processPart({
		x: { min: 1, max: 4001 },
		m: { min: 1, max: 4001 },
		a: { min: 1, max: 4001 },
		s: { min: 1, max: 4001 }
	}, 'in', 'in')
	return total
}

run({
	part1: {
		tests: [
			{
				input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}`,
				expected: 19114,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}`,
				expected: 167409079868000,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
