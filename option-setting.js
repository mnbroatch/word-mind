import React from 'react'
import PropTypes from 'prop-types'
import chunk from 'lodash/chunk'

export default function OptionSetting ({
  id,
  value,
  unlockedValues,
  unlockable = [],
  min,
  max,
  step = 1,
  points,
  name,
  unlocked,
  type,
  handleSetOption,
  handleUnlockOption
}) {
  const possibleValues = type === 'numeric'
    ? chunk(Array.from(new Array(max - min + 1)), step).map((_, i) => (i + 1) * step)
    : [false, true]

  if (unlockedValues.includes(Infinity)) {
    possibleValues.unshift(Infinity)
  }

  return (
    <div className='option'>
      <div className='option__name'>
        {name}
      </div>
      <div className='option__values'>
        {possibleValues.map((val, index) => {
          let status
          if (val === value) {
            status = 'selected'
          } else if (unlockedValues.includes(val)) {
            status = 'unlocked'
          } else if (unlockable.includes(val) || possibleValues.some((v, i) => v !== Infinity && unlockedValues.includes(v) && Math.abs(i - index) === 1)) {
            status = 'unlockable'
          } else {
            status = 'locked'
          }

          const clickHandler = {
            unlocked: (val) => { handleSetOption(id, val) },
            unlockable: (val) => { handleUnlockOption(id, val) }
          }[status]

          let label
          if (type === 'numeric') {
            label = val === Infinity ? '∞' : val
          } else {
            label = val ? 'On' : 'Off'
          }

          return (
            <button
              className={ `option__value option__value--${status}` }
              key={val}
              onClick={() => { clickHandler && clickHandler(val) }}
            >
              <div className='option__value-inner'>
                {label}
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
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  points: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  unlocked: PropTypes.bool,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func
}
