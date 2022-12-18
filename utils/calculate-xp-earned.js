export default function calculatePointsEarned (skills) {
  const numberOfUnlockedOptions = Object.values(skills).reduce((acc, skill) => acc + (!skill.unlocked ? 0 : skill.unlockedValues.length), 0)
  const numberOfRandomOptionsActivated = Object.values(skills).reduce((acc, skill) => acc + (skill.value === 'random' ? 1 : 0), 0)
  const basePoints = 1
  const multiplierForRandomOptions = 3
  return Math.floor(basePoints * (numberOfUnlockedOptions + (numberOfRandomOptionsActivated * multiplierForRandomOptions) + 1))
}
