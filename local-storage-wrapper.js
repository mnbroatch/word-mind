import cloneDeep from 'lodash/cloneDeep'
import defaultSkills from './default-skills'
import defaultItems from './default-items'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

const defaultState = {
  initialSkills: defaultSkills,
  initialItems: defaultItems,
  initialXp: 0,
  initialMoney: 0
}

function loadState () {
  const state = localStorage.getItem('word-mind_state')

  if (!state) {
    return defaultState
  }

  const { skills, xp, money, items } = JSON.parse(state)

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

    // deprecated
    Object.values(initialSkills).forEach(skill => {
      if (skill.value === null) {
        skill.value = Infinity
      }

      skill.unlockedValues.forEach((value, i) => {
        if (value === null) {
          skill.unlockedValues[i] = Infinity
        }
      })

      skill.options.forEach((option, i) => {
        if (option.value === null) {
          option.value = Infinity
        }
      })
    })
  } else {
    initialSkills = defaultSkills
  }

  const initialXp = xp ? JSON.parse(xp) : 0
  const initialMoney = money ? JSON.parse(money) : 0
  const initialItems = items ? JSON.parse(items) : defaultItems
  return { initialSkills, initialItems, initialXp, initialMoney }
}

function saveState ({ skills, xp, money }) {
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
    skills,
    xp,
    money
  }
  localStorage.setItem('word-mind_state', JSON.stringify(state))
}

export { loadState, saveState }
