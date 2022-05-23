export default {
  boardsCount: {
    value: 1,
    range: [1, 10],
    multiplierCurve: (value) => {
      return value
    },
    unlocked: false,
    cost: 1
  },
  reverse: {
    value: 0,
    range: [0, 1],
    multiplierCurve: (value) => {
      return value ? 1.5 : 1
    },
    unlocked: false,
    cost: 1
  },
  maxGuesses: {
    value: 10,
    range: [1, 10],
    multiplierCurve: (value, options) => {
      const effectiveValue = value - options.boardsCount.value + 1
      if (effectiveValue === 1) {
        return 200
      } else if (effectiveValue === 2) {
        return 50
      } else if (effectiveValue === 3) {
        return 5
      } else if (effectiveValue === 4) {
        return 2
      } else if (effectiveValue === 5) {
        return 1.3
      } else if (effectiveValue === 6) {
        return 1.1
      } else if (effectiveValue > 6) {
        return 1
      }
    },
    unlocked: false,
    cost: 1
  },
  wordLength: {
    value: 5,
    range: [1, 10],
    multiplierCurve: (value) => {
      if (value < 4) {
        return -1
      } else if (value === 4) {
        return -0.5
      } else if (value === 5) {
        return 1
      } else if (value > 5) {
        return 3
      }
    },
    unlocked: false,
    cost: 1
  }
}
