export default {
  maxWrongGuesses: {
    description: 'Max Wrong Guesses',
    options: [
      {
        value: Infinity,
        mastery: 0

      },
      {
        value: 3,
        mastery: 0
      },
      {
        value: 4,
        mastery: 0
      },
      {
        value: 6,
        mastery: 0
      },
      {
        value: 8,
        mastery: 0
      }
    ],
    value: Infinity,
    unlockedValues: [Infinity, 6],
    unlocked: false
  },
  boardsCount: {
    description: 'Number of Boards',
    options: [
      {
        value: 1,
        mastery: 0
      },
      {
        value: 2,
        mastery: 0
      },
      {
        value: 4,
        mastery: 0
      },
      {
        value: 6,
        mastery: 0
      },
      {
        value: 8,
        mastery: 0
      }
    ],
    value: 100,
    unlockedValues: [1, 2],
    unlocked: false
  },
  wordLength: {
    description: 'Word Length',
    options: [
      {
        value: 2,
        mastery: 0
      },
      {
        value: 3,
        mastery: 0
      },
      {
        value: 5,
        mastery: 0
      },
      {
        value: 6,
        mastery: 0
      },
      {
        value: 8,
        mastery: 0
      }
    ],
    value: 5,
    unlockedValues: [5, 6],
    unlocked: false
  },
  gameTimeLimit: {
    description: 'Game Time Limit',
    options: [
      {
        value: Infinity,
        mastery: 0
      },
      {
        value: 30,
        mastery: 0
      },
      {
        value: 120,
        mastery: 0
      },
      {
        value: 300,
        mastery: 0
      },
      {
        value: 600,
        mastery: 0
      }
    ],
    value: Infinity,
    unlockedValues: [Infinity, 600],
    unlocked: false
  },
  roundTimeLimit: {
    description: 'Guess Time Limit',
    options: [
      {
        value: Infinity,
        mastery: 0
      },
      {
        value: 10,
        mastery: 0
      },
      {
        value: 30,
        mastery: 0
      },
      {
        value: 60,
        mastery: 0
      },
      {
        value: 300,
        mastery: 0
      }
    ],
    value: Infinity,
    unlockedValues: [Infinity, 60],
    unlocked: false
  },
  callShot: {
    description: 'Call Shot XP Wager',
    options: [
      {
        value: 0,
        mastery: 0
      },
      {
        value: 1,
        mastery: 0
      },
      {
        value: 2,
        mastery: 0
      },
      {
        value: 3,
        mastery: 0
      },
      {
        value: 4,
        mastery: 0
      }
    ],
    value: 0,
    unlockedValues: [0, 1],
    unlocked: false
  }
}
