import React from 'react'
import PropTypes from 'prop-types'

export default function Option ({
  selectedValue,
  mastery,
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

  const percentDone = (mastery / optionCost) * 100

  return (
    <div className="option">
      <div>
        <div className="option__meter">
          <div
            style={{ height: `${percentDone}%` }}
            className={[
              'option__meter__inner',
              percentDone >= 100 && 'option__meter__inner--complete'
            ].filter(Boolean).join(' ')}
          />
        </div>
      </div>
      <button
        className={ `option-button option-button--${status}` }
        key={optionValue}
        onClick={() => { clickHandler && clickHandler(optionValue) }}
      >
        <div className='option-button__inner'>
          {displayValue}
        </div>
      </button>
    </div>
  )
}

const value = PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string])
Option.propTypes = {
  selectedValue: value,
  value,
  mastery: PropTypes.number,
  skillId: PropTypes.string,
  unlockedValues: PropTypes.arrayOf(value),
  optionCost: PropTypes.number,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleUnlockSkill: PropTypes.func,
  skillCost: PropTypes.number,
  random: PropTypes.bool
}
