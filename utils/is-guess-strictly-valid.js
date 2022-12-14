import getLetterStates from './get-letter-states'

export default function isGuessStrictlyValid (guess, previousGuesses, answers) {
  const unsolvedAnswers = answers.filter(answer => !previousGuesses.includes(answer))
  return unsolvedAnswers.some((answer) => {
    if (guess.length !== answer.length) return false

    const possibilityRules = {
      letterCounts: {},
      slots: Array.from({ length: answer.length }).map(() => ({
        correct: null,
        incorrect: new Set()
      }))
    }

    previousGuesses.forEach((prevGuess) => {
      const letterStates = getLetterStates(answer, prevGuess)
      letterStates.forEach((letterState, i) => {
        const letter = prevGuess[i]
        if (letterState === 'correct') {
          possibilityRules.slots[i].correct = letter
        } else {
          possibilityRules.slots[i].incorrect.add(letter)
        }
      })

      const uniqueLetters = Array.from(new Set(prevGuess.split('')))

      uniqueLetters.forEach((letter) => {
        const numOccurrances = prevGuess.split('').filter(l => l === letter).length
        const numPresentOccurrances = prevGuess.split('').filter((l, i) => l === letter && letterStates[i] !== 'absent').length

        if (!possibilityRules.letterCounts[letter]) {
          possibilityRules.letterCounts[letter] = {
            min: 0,
            max: null
          }
        }

        if (numOccurrances > numPresentOccurrances) {
          possibilityRules.letterCounts[letter].min = numPresentOccurrances
          possibilityRules.letterCounts[letter].max = numPresentOccurrances
        } else {
          possibilityRules.letterCounts[letter].min = Math.max(numPresentOccurrances, possibilityRules.letterCounts[letter].min)
        }
      })
    })

    const letterCountsArePossible = Object.entries(possibilityRules.letterCounts).every(([letter, { min, max }]) => {
      const numOccurrances = guess.split('').filter(l => l === letter).length
      return numOccurrances >= min
        && (max === null || numOccurrances <= max)
    })

    const letterPositionsArePossible = possibilityRules.slots.every(({ correct, incorrect }, index) => {
      const letter = guess[index]
      return correct
        ? letter === correct
        : !incorrect.has(letter)
    })

    return letterCountsArePossible && letterPositionsArePossible
  })
}
