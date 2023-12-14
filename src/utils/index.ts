export function memo<T extends any[], R>(func: (...args: T) => R): (...args: T) => R {
	const cache = new Map<string, R>()

	return (...args: T): R => {
		const key = JSON.stringify(args)

		if (cache.has(key)) {
			return cache.get(key)!
		}

		const result = func(...args)
		cache.set(key, result)
		return result
	}
}

export const reverseLine = (l: string[]) => l.reverse()
export const transposeLine = (m: string[][], i: number) => m.map(row => row[i])
export const transposeLineReversed = (m: string[][], i: number) => m.map(row => row[i]).reverse()
export const transpose = (m: string[][]) => [...m[0]].map((_, colIndex) => transposeLine(m, colIndex))
export const transposeReversed = (m: string[][]) => [...m[0]].map((_, colIndex) => transposeLineReversed(m, colIndex))
export const reverse = (m: string[][]) => m.map(l => reverseLine(l))