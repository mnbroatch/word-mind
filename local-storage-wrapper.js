import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge.js'
import defaultOptions from './default-options.js'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

function loadState () {
  const savedOptions = JSON.parse(localStorage.getItem('word-mind_options'))
  if (savedOptions) {
    Object.values(savedOptions).forEach(option => {
      if (option.value === INFINITY_REPLACEMENT) {
        option.value = Infinity
      }

      option.unlockedValues.forEach((value, i) => {
        if (value === INFINITY_REPLACEMENT) {
          option.unlockedValues[i] = Infinity
        }
      })
    })
  }

  const initialOptions = merge({}, defaultOptions, savedOptions)
  Object.keys(initialOptions).forEach((key) => {
    if (!defaultOptions[key]) {
      delete initialOptions[key]
    }
  })

  let initialXp = 0
  const savedXp = localStorage.getItem('word-mind_xp')
  if (savedXp) {
    initialXp = JSON.parse(savedXp)
  }

  let initialMoney = 0
  const savedMoney = localStorage.getItem('word-mind_money')
  if (savedMoney) {
    initialMoney = JSON.parse(savedMoney)
  }

  return { initialOptions, initialXp, initialMoney }
}

function saveState ({ options, xp }) {
  const optionsClone = cloneDeep(options)
  if (optionsClone) {
    Object.values(optionsClone).forEach(option => {
      if (option.value === Infinity) {
        option.value = INFINITY_REPLACEMENT
      }

      option.unlockedValues.forEach((value, i) => {
        if (value === Infinity) {
          option.unlockedValues[i] = INFINITY_REPLACEMENT
        }
      })
    })
  }

  const optionsEntriesToSave = Object.entries(optionsClone).map(([key, { unlockedValues, value }]) => [key, { unlockedValues, value }])

  localStorage.setItem('word-mind_options', JSON.stringify(Object.fromEntries(optionsEntriesToSave)))
  localStorage.setItem('word-mind_xp', JSON.stringify(xp))
}

export { loadState, saveState }
