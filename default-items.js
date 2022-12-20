// const later = Date.now() * 2

export default {
  strictMode: {
    description: 'Strict Mode',
    ownedCount: 0,
    activeUntil: 0,
    duration: 1000 * 60,
    cost: 1
  },
  useFullDictionary: {
    description: 'Use Full Dictionary',
    ownedCount: 0,
    activeUntil: 0,
    duration: 1000 * 60 * 60,
    cost: 1
  },
  reverse: {
    description: 'All Words are Backwards',
    ownedCount: 0,
    activeUntil: 0,
    duration: 1000 * 60,
    cost: 1
  },
  showPossibleWords: {
    description: 'Show Possible Words',
    ownedCount: 0,
    activeUntil: 0,
    duration: 1000 * 60,
    cost: 10
  },
  revealAnswers: {
    description: 'Reveal Answers',
    ownedCount: Infinity,
    activeUntil: 0,
    duration: 1000 * 60,
    cost: 10
  }
}
