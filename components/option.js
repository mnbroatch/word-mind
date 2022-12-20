import React from 'react'
import PropTypes from 'prop-types'

export default function Option ({
  selectedValue,
  value: optionValue,
  skillId,
  unlockedValues,
  handleSetOption,
  handleUnlockOption,
  random,
  optionCost
}) {
  let status
  if (optionValue === selectedValue && !random) {
    status = 'selected'
  } else if (unlockedValues.includes(optionValue)) {
    status = 'unlocked'
  } else {
    status = 'locked'
  }

  const clickHandler = {
    unlocked: () => { handleSetOption(skillId, optionValue) },
    locked: () => { handleUnlockOption(skillId, optionValue) }
  }[status]

  let displayValue
  if (typeof optionValue === 'boolean') {
    displayValue = optionValue ? 'On' : 'Off'
  } else if (optionValue === Infinity) {
    displayValue = <span style={{ fontSize: '2em' }}>∞</span>
  } else {
    displayValue = optionValue.toString()
  }

  return (
    <button
      className={ `option option--${status}` }
      key={optionValue}
      onClick={() => { clickHandler && clickHandler(optionValue) }}
    >
      <div className='option-inner'>
        {displayValue}
      </div>
    </button>
  )
}

const value = PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string])
Option.propTypes = {
  selectedValue: value,
  value,
  skillId: PropTypes.string,
  unlockedValues: PropTypes.arrayOf(value),
  optionCost: PropTypes.number,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleUnlockSkill: PropTypes.func,
  skillCost: PropTypes.number,
  random: PropTypes.bool
}
