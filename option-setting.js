import React from 'react'
import PropTypes from 'prop-types'

export default function OptionSetting ({
  id,
  value,
  possibleValues,
  unlockedValues,
  description,
  unlocked,
  type,
  handleSetOption,
  handleUnlockOption
}) {
  return (
    <div className='option'>
      <div className='option__description'>
        {description}
      </div>
      <div className='option__values'>
        {possibleValues.map((val, index) => {
          let status
          if (val === value) {
            status = 'selected'
          } else if (unlockedValues.includes(val)) {
            status = 'unlocked'
          } else if (possibleValues.some((v, i) => v !== Infinity && unlockedValues.includes(v) && Math.abs(i - index) === 1)) {
            status = 'unlockable'
          } else {
            status = 'locked'
          }

          const clickHandler = {
            unlocked: (val) => { handleSetOption(id, val) },
            unlockable: (val) => { handleUnlockOption(id, val) }
          }[status]

          let displayValue
          if (typeof val === 'boolean') {
            displayValue = val ? 'On' : 'Off'
          } else if (val === Infinity) {
            displayValue = <span style={{ fontSize: '2em' }}>∞</span>
          } else {
            displayValue = val.toString()
          }

          return (
            <button
              className={ `option__value option__value--${status}` }
              key={val}
              onClick={() => { clickHandler && clickHandler(val) }}
            >
              <div className='option__value-inner'>
                {displayValue}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

OptionSetting.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  unlockedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
  unlockable: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
  possibleValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  description: PropTypes.string,
  type: PropTypes.string,
  unlocked: PropTypes.bool,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func
}
