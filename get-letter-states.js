export default function getLetterStates (answer, guess) {
  return guess.split('').reduce((acc, letter, i) => {
    if (answer[i] === letter) {
      return [...acc, 'correct']
    } else if (answer.includes(letter)) {
      const instancesInAnswerCount = answer.split('')
        .filter(l => l === letter).length
      const instancesSoFarInGuessCount = guess.split('').slice(0, i)
        .filter(l => l === letter).length
      return [
        ...acc,
        instancesSoFarInGuessCount < instancesInAnswerCount
          ? 'present'
          : 'absent'
      ]
    } else {
      return [...acc, 'absent']
    }
  }, [])
}
