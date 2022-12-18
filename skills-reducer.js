import defaultSkills from './default-skills'

export default function skillsReducer (prev, { type, skillId, skills, value }) {
  if (type === 'UNLOCK_SKILL') {
    return {
      ...prev,
      [skillId]: {
        ...prev[skillId],
        unlocked: true
      }
    }
  } else if (type === 'UNLOCK_OPTION') {
    console.log('value', value)
    return {
      ...prev,
      [skillId]: {
        ...prev[skillId],
        unlockedValues: Array.from(new Set([...prev[skillId].unlockedValues, value]))
      }
    }
  } else if (type === 'SET_OPTION') {
    return {
      ...prev,
      [skillId]: {
        ...prev[skillId],
        value
      }
    }
  } else if (type === 'LOAD_INITIAL') {
    return defaultSkills
  } else if (type === 'GAIN_MASTERY') {
    const masteryIncreasePerGame = 1
    const maxMasteryPerOption = 10

    return Object.fromEntries(Object.entries(skills).map(([skillId, skill]) => [
      skillId,
      {
        ...skill,
        options: skill.options.map(option => {
          return !(skill.unlocked && skill.value === option.value)
            ? option
            : {
                ...option,
                mastery: option.mastery + masteryIncreasePerGame >= maxMasteryPerOption
                  ? maxMasteryPerOption
                  : option.mastery + masteryIncreasePerGame
              }
        })
      }
    ]))
  } else if (type === 'UNLOCK_ALL') {
    return Object.entries(prev).reduce((acc, [key, skill]) => ({
      ...acc,
      [key]: {
        ...skill,
        unlocked: skill.unlocked,
        unlockedValues: [...skill.options.map(o => o.value), 'random']
      }
    }), {})
  } else {
    return prev
  }
}
