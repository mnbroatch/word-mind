export default function getLetterStates (answer, guess) {
  return guess.split('').reduce((acc, letter, i) => {
    if (answer[i] === letter) {
      return [...acc, 'correct']
    } else if (answer.includes(letter)) {
      // Only color first n instances,
      // where n === number of unguessed instances in answer
      const instancesSoFarCount = guess.split('').slice(0, i)
        .filter(l => l === letter).length
      const instancesInWordNotGuessedCount = answer.split('')
        .filter((l, j) => l === letter && guess[j] !== letter)
        .length
      return [
        ...acc,
        instancesSoFarCount < instancesInWordNotGuessedCount
          ? 'present'
          : 'absent'
      ]
    } else {
      return [...acc, 'absent']
    }
  }, [])
}
