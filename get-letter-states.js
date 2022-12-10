export default function getLetterStates (answer, guess) {
  return guess.split('').reduce((acc, letter, i) => {
    if (answer[i] === letter) {
      return [...acc, 'correct']
    } else if (answer.includes(letter)) {
      const instancesInAnswerCount = answer.split('')
        .filter(l => l === letter).length
      const instancesSoFarInGuessCount = guess.split('').slice(0, i + 1)
        .filter(l => l === letter).length
      const laterCorrectInstancesCount = guess.split('').slice(i + 1)
        .filter((l, j) => l === letter && l === answer.split('').slice(i + 1)[j]).length

      return [
        ...acc,
        instancesSoFarInGuessCount <= instancesInAnswerCount - laterCorrectInstancesCount
          ? 'present'
          : 'absent'
      ]
    } else {
      return [...acc, 'absent']
    }
  }, [])
}
