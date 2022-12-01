export default {
  timeLimit: {
    name: 'Time Limit',
    type: 'numeric',
    value: Infinity,
    min: 0,
    max: 1000,
    unlockedValues: [Infinity],
    unlockable: [300],
    step: 30,
    multiplierCurve: (value) => {
      if (value >= 300) {
        return 1
      } else if (value < 300 && value > 120) {
        return 2
      } else if (value < 120 && value > 30) {
        return 4
      } else if (value < 30) {
        return 8
      }
    }
  },
  boardsCount: {
    name: 'Number of Boards',
    type: 'numeric',
    value: 1,
    min: 1,
    max: 10,
    unlockedValues: [1],
    multiplierCurve: (value) => {
      return value
    },
    unlocked: false
  },
  reverse: {
    name: 'All Words are Backwards',
    type: 'boolean',
    value: false,
    unlockedValues: [false],
    multiplierCurve: (value) => {
      return value ? 1.5 : 1
    }
  },
  maxGuesses: {
    name: 'Number of Guesses',
    type: 'numeric',
    value: Infinity,
    unlockable: [6],
    min: 1,
    max: 6,
    unlockedValues: [Infinity],
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
      } else {
        return 1
      }
    }
  },
  wordLength: {
    name: 'Word Length',
    type: 'numeric',
    value: 5,
    min: 1,
    max: 8,
    unlockedValues: [5],
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
    }
  }
}
