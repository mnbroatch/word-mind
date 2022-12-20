export default function calculatePointsEarned (skills) {
  const baseCost = 0.5
  const unlockedSkillsCount = Object.values(skills).reduce((acc, skill) => acc + (skill.unlocked ? 1 : 0), 0)
  return 10 * baseCost * (unlockedSkillsCount + 1)
}
