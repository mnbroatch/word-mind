export default function getPointsEarned (options, endState) {
  if (!endState.won) return 0

  if (!endState.answers.every(answer => endState.guesses.includes(answer))) {
    return 0
  } else {
    const basePoints = 1
    return Object.values(options).reduce((acc, { multiplierCurve, value }) => {
      return acc + basePoints * multiplierCurve(value, options) - 1
    }, basePoints)
  }
}
