import merge from 'lodash/merge.js'

export default function optionsReducer (prev, { type, optionName, value, savedOptions }) {
  if (type === 'SET_OPTION') {
    return {
      ...prev,
      [optionName]: { ...prev[optionName], value }
    }
  } else if (type === 'UNLOCK_OPTION') {
    return {
      ...prev,
      [optionName]: { ...prev[optionName], unlocked: true }
    }
  } else if (type === 'LOAD_INITIAL') {
    console.log('savedOptions', savedOptions)
    console.log('merge(prev, savedOptions)', merge(prev, savedOptions))
    return merge({}, prev, savedOptions)
  }
}
