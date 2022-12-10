export default {
  maxGuesses: {
    description: 'Number of Guesses',
    value: Infinity,
    possibleValues: [Infinity, 1, 4, 6, 8],
    unlockedValues: [Infinity, 6]
  },
  boardsCount: {
    description: 'Number of Boards',
    value: 1,
    possibleValues: [1, 2, 4, 8],
    unlockedValues: [1, 2]
  },
  wordLength: {
    description: 'Word Length',
    value: 5,
    possibleValues: [2, 3, 5, 6, 8],
    unlockedValues: [5, 6]
  },
  gameTimeLimit: {
    description: 'Game Time Limit',
    value: Infinity,
    possibleValues: [Infinity, 30, 120, 300, 600],
    unlockedValues: [Infinity, 600]
  },
  roundTimeLimit: {
    description: 'Round Time Limit',
    value: Infinity,
    possibleValues: [Infinity, 10, 30, 60, 300],
    unlockedValues: [Infinity, 60]
  },
  strictMode: {
    description: 'Strict Mode',
    value: false,
    possibleValues: [false, true],
    unlockedValues: [false, true]
  },
  reverse: {
    description: 'All Words are Backwards',
    value: false,
    possibleValues: [false, true],
    unlockedValues: [false, true]
  },
  showPossibleWords: {
    description: 'Show Possible Words',
    value: false,
    possibleValues: [false, true],
    unlockedValues: [false, true]
  },
  revealAnswers: {
    description: 'Reveal Answers',
    value: false,
    possibleValues: [false, true],
    unlockedValues: [false, true]
  }
}
