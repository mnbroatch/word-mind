import defaultSkills from './default-skills'

// todo: make this an external constant
const optionCost = 2

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
        random: value === 'random',
        value
      }
    }
  } else if (type === 'LOAD_INITIAL') {
    return defaultSkills
  } else if (type === 'GAIN_MASTERY') {
    return Object.fromEntries(Object.entries(skills).map(([skillId, skill]) => [
      skillId,
      {
        ...skill,
        options: skill.options.map(option => {
          return !(skill.unlocked && skill.value === option.value)
            ? option
            : {
                ...option,
                mastery: option.mastery + 1 >= optionCost
                  ? optionCost
                  : option.mastery + 1
              }
        })
      }
    ]))
  } else if (type === 'UNLOCK_ALL') {
    return Object.entries(prev).reduce((acc, [key, skill]) => ({
      ...acc,
      [key]: {
        ...skill,
        options: skill.options.map(o => ({ ...o, mastery: optionCost })),
        unlocked: true,
        unlockedValues: skill.options.map(o => o.value)
      }
    }), {})
  } else {
    return prev
  }
}
