import run from "aocrunner"
interface Mod {
  type: 'broadcaster' | '&' | '%' | 'button'
  destinations: string[]
  name: string
  state: boolean
  connected: Record<string, boolean>
}
const parseInput = (rawInput: string) => rawInput.split('\n').map(l => {
  const [name, d] = l.split(' -> ')
  const destinations = d.split(', ')
  if (name === 'broadcaster') {
    return { type: 'broadcaster', name, destinations, state: false, connected: {} }
  } else {
    const type = name.slice(0, 1)
    const n = name.slice(1)
    return { name: n, type, destinations, state: false, connected: {} }
  }
}) as Mod[]


type Pulse = ['l' | 'h', Mod, Mod | undefined]
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const signals = { l: 0, h: 0 }
  const getMod = (name: string) => input.find(m => m.name === name)

  const queue: Pulse[] = []

  const sendPulse = (...args: Pulse) => queue.push(args)
  const processPulse = (type: 'l' | 'h', from: Mod, to?: Mod) => {
    signals[type] += 1
    if (to) {
      if (to.type === 'broadcaster') {
        for (const d of to.destinations) {
          sendPulse('l', to, getMod(d))
        }
      }
      if (to.type === '%') {
        if (type === 'l') {
          to.state = !to.state
          for (const d of to.destinations) {
            sendPulse(to.state ? 'h' : 'l', to, getMod(d))
          }
        }
      }
      if (to.type === '&') {
        to.connected[from.name] = type === 'h'
        const isOn = [...Object.values(to.connected)].every(m => m)
        for (const d of to.destinations) {
          sendPulse(isOn ? 'l' : 'h', to, getMod(d))
        }
      }
    }
  }
  const broadcaster = getMod('broadcaster')
  for (const mod of input.filter(m => m.type === '&')) {
    const connected = input.filter(m => m.destinations.includes(mod.name))
    for (const con of connected) {
      mod.connected[con.name] = false
    }
  }

  for (let i = 0; i < 1000; i++) {
    sendPulse('l', { name: 'button', type: 'button', state: false, destinations: ['broadcaster'], connected: {} }, broadcaster)
    while (queue.length) {
      processPulse(...queue[0])
      queue.shift()
    }
  }
  console.log(signals)
  return signals.l * signals.h
}
type Pulse2 = ['l' | 'h', Mod, string]

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const signals = { l: 0, h: 0 }
  const getMod = (name: string) => input.find(m => m.name === name)

  const queue: Pulse2[] = []

  const sendPulse = (...args: Pulse2) => queue.push(args)
  const beforeRX = input.find(m => m.destinations.includes('rx'))!
  const beforeBeforeRx = input.filter(m => m.destinations.includes(beforeRX?.name))
  const recordBeforeBeforeRx: Record<string, null | number> = beforeBeforeRx.reduce((acc, v) => {
    return { ...acc, [v.name]: null }
  }, {})

  const processPulse = (type: 'l' | 'h', from: Mod, toName: string, i: number) => {
    signals[type] += 1

    const to = getMod(toName)
    if (to) {
      if (to.type === 'broadcaster') {
        for (const d of to.destinations) {
          sendPulse('l', to, d)
        }
      }
      if (to.type === '%') {
        if (type === 'l') {
          to.state = !to.state
          for (const d of to.destinations) {
            sendPulse(to.state ? 'h' : 'l', to, d)
          }
        }
      }
      if (to.type === '&') {
        to.connected[from.name] = type === 'h'
        const isOn = [...Object.values(to.connected)].every(m => m)
        if (to.name in recordBeforeBeforeRx && !isOn) {
          recordBeforeBeforeRx[to.name] = i + 1
        }
        for (const d of to.destinations) {
          sendPulse(isOn ? 'l' : 'h', to, d)
        }
      }
    }
  }
  for (const mod of input.filter(m => m.type === '&')) {
    const connected = input.filter(m => m.destinations.includes(mod.name))
    for (const con of connected) {
      mod.connected[con.name] = false
    }
  }
  let i = 0
  while (![...Object.values(recordBeforeBeforeRx)].every(v => v !== null)) {
    sendPulse('l', { name: 'button', type: 'button', state: false, destinations: ['broadcaster'], connected: {} }, 'broadcaster')
    while (queue.length) {
      processPulse(...queue[0], i)
      queue.shift()
    }
    i++
  }
  const cycles = [...Object.values(recordBeforeBeforeRx)] as number[]
  return cycles.reduce(lcm)
}

run({
  part1: {
    tests: [
      {
        input: `
        broadcaster -> a, b, c
        %a -> b
        %b -> c
        %c -> inv
        &inv -> a`,
        expected: 32000000,
      },
      {
        input: `
        broadcaster -> a
        %a -> inv, con
        &inv -> b
        %b -> con
        &con -> output`,
        expected: 11687500,
      },
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
