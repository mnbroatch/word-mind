import cloneDeep from 'lodash/cloneDeep'
import defaultSkills from './default-skills'
import defaultItems from './default-items'
import defaultEquipment from './default-equipment'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

const defaultState = {
  initialSkills: defaultSkills,
  initialItems: defaultItems,
  initialEquipment: defaultEquipment,
  initialXp: 0,
  initialMoney: 0,
  initialCompletedLevelIds: []
}

function loadState () {
  const state = localStorage.getItem('word-mind_state')

  if (!state) {
    return defaultState
  }

  const { skills, xp, money, completedLevelIds, items, equipment } = JSON.parse(state)

  let initialSkills = skills
  if (initialSkills) {
    Object.values(initialSkills).forEach(skill => {
      if (skill.value === INFINITY_REPLACEMENT) {
        skill.value = Infinity
      }

      skill.unlockedValues.forEach((value, i) => {
        if (value === INFINITY_REPLACEMENT) {
          skill.unlockedValues[i] = Infinity
        }
      })

      skill.options.forEach((option, i) => {
        if (option.value === INFINITY_REPLACEMENT) {
          option.value = Infinity
        }
      })
    })
  } else {
    initialSkills = defaultSkills
  }

  const initialXp = xp || 0
  const initialMoney = money || 0
  const initialCompletedLevelIds = completedLevelIds || []
  const initialItems = items || defaultItems
  const initialEquipment = equipment || defaultEquipment

  // todo: don't mutate
  Object.entries(defaultSkills).forEach(([key, skill]) => {
    if (!initialSkills[key]) { initialSkills[key] = skill }
  })
  Object.entries(defaultItems).forEach(([key, item]) => {
    if (!initialItems[key]) { initialItems[key] = item }
  })
  Object.entries(defaultEquipment).forEach(([key, equipment]) => {
    if (!initialEquipment[key]) { initialEquipment[key] = equipment }
  })

  return { initialSkills, initialItems, initialXp, initialMoney, initialEquipment, initialCompletedLevelIds }
}

function saveState ({ skills, xp, money, completedLevelIds, items, equipment }) {
  const skillsClone = cloneDeep(skills)
  if (skillsClone) {
    Object.values(skillsClone).forEach(skill => {
      if (skill.value === Infinity) {
        skill.value = INFINITY_REPLACEMENT
      }

      skill.unlockedValues.forEach((value, i) => {
        if (value === Infinity) {
          skill.unlockedValues[i] = INFINITY_REPLACEMENT
        }
      })

      skill.options.forEach((option, i) => {
        if (option.value === Infinity) {
          option.value = INFINITY_REPLACEMENT
        }
      })
    })
  }

  const state = {
    skills: skillsClone,
    xp,
    money,
    completedLevelIds,
    items,
    equipment
  }
  localStorage.setItem('word-mind_state', JSON.stringify(state))
}

export { loadState, saveState }
