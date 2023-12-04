import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const lines = input.split('\n')
  const numbers: number[] = []
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l]
    for (const match of line.matchAll(/(\d+)/g)) {
      if (match.index !== undefined) {
        let isPart = false
        for (let i = match.index; i < match.index + match[0].length; i++) {
          for (let y = -1; y < 2; y++) {
            for (let x = -1; x < 2; x++) {
              if (lines?.[y + l]?.[x + i]?.match(/[^0-9.]/)) {
                isPart = true
              }
            }
          }
        }
        if (isPart) numbers.push(Number(match[0]))
      }
    }
  }
  return numbers.reduce((acc, v) => acc + v, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const lines = input.split('\n')
  const gears: Array<Record<number, number[]>> = []
  for (let l = 0; l < lines.length; l++) {
    const gearsPerLine: Record<number, []> = {}
    for (const match of lines[l].matchAll(/\*/g)) {
      if (match.index) {
        gearsPerLine[match.index] = []
      }
    }
    gears.push(gearsPerLine)
  }
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l]
    for (const match of line.matchAll(/(\d+)/g)) {
      if (match.index !== undefined) {
        let isPart = false
        for (let i = match.index; i < match.index + match[0].length; i++) {
          for (let y = -1; y < 2; y++) {
            for (let x = -1; x < 2; x++) {
              if (lines?.[y + l]?.[x + i] === '*') {
                if (!isPart) gears[y + l][x + i].push(Number(match[0]))
                isPart = true
              }
            }
          }
        }
      }
    }
  }
  const result = gears.flat()
    .flatMap(g => Object.values(g))
    .filter(g => g.length === 2)
    .reduce((acc, v) => {
      return acc + v.reduce((total, r) => total * r, 1)
    }, 0)
  return result
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
