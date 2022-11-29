import React from 'react'
import PropTypes from 'prop-types'

export default function OptionSetting ({
  id,
  value,
  unlockedValues,
  min,
  max,
  points,
  name,
  unlocked,
  type,
  handleSetOption,
  handleUnlockOption
}) {
  const possibleValues = type === 'numeric'
    ? Array.from(new Array(max - min + 1), (_, i) => i + min)
    : [false, true]

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
          } else if (possibleValues.some((v, i) => unlockedValues.includes(v) && Math.abs(i - index) === 1)) {
            status = 'unlockable'
          } else {
            status = 'locked'
          }

          const clickHandler = {
            unlocked: (val) => { handleSetOption(id, val) },
            unlockable: (val) => { handleUnlockOption(id, val) }
          }[status]

          return (
            <button
              className={ `option__value option__value--${status}` }
              key={val}
              onClick={() => { clickHandler && clickHandler(val) }}
            >
              <div className='option__value-inner'>
                {type === 'numeric' ? val : (val && 'On') || 'Off' }
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
  min: PropTypes.number,
  max: PropTypes.number,
  points: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  unlocked: PropTypes.bool,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func
}
