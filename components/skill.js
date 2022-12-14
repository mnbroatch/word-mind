import React from 'react'
import PropTypes from 'prop-types'

export default function Skill ({
  id,
  options,
  value,
  description,
  unlockedOptions,
  handleSetOption,
  handleUnlockOption
}) {
  return (
    <div className='skill'>
      <div className='skill__description'>
        {description}
      </div>
      <div className='skill__options'>
        {options.map((val, index) => {
          let status
          if (val === value) {
            status = 'selected'
          } else if (unlockedOptions.includes(val)) {
            status = 'unlocked'
          } else if (options.some((v, i) => v !== Infinity && unlockedOptions.includes(v) && Math.abs(i - index) === 1)) {
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
              className={ `skill__option skill__option--${status}` }
              key={val}
              onClick={() => { clickHandler && clickHandler(val) }}
            >
              <div className='skill__option-inner'>
                {displayValue}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

Skill.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  unlockedOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
  description: PropTypes.string,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func
}
