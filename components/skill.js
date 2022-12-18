import React from 'react'
import PropTypes from 'prop-types'

export default function Skill ({
  id,
  options,
  value,
  description,
  unlockedValues,
  unlocked,
  handleSetOption,
  handleUnlockSkill,
  handleUnlockOption,
  optionCost
}) {
  const totalMastery = options.reduce((acc, opt) => acc + opt.mastery, 0)
  const spentMastery = (unlockedValues.length - 2) * optionCost
  const remainingMastery = totalMastery - spentMastery
  const selectedOptionMastery = options.find(opt => opt.value === value).mastery
  return (
    <div className='skill'>
      <div className='skill__description'>
        {description}
      </div>
      {unlocked
        ? <>
            <div className='skill__mastery'>
              Available Mastery: {remainingMastery}
            </div>
            <div className='skill__option-mastery'>
              Mastery from selected option: {selectedOptionMastery}
            </div>
            <div className='skill__options'>
              {options.map(({ value: val }, index) => {
                let status
                if (val === value) {
                  status = 'selected'
                } else if (unlockedValues.includes(val)) {
                  status = 'unlocked'
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
            {(() => {
              let status
              if (value === 'random') {
                status = 'selected'
              } else if (unlockedValues.includes('random')) {
                status = 'unlocked'
              } else {
                status = 'locked'
              }

              const clickHandler = {
                unlocked: (val) => { handleSetOption(id, val) },
                unlockable: (val) => { handleUnlockOption(id, val) }
              }[status]
              return (
                <button
                  className={ `skill__option skill__option--random skill__option--${status}` }
                  onClick={() => { clickHandler && clickHandler('random') }}
                >
                  <div className='skill__option-inner'>
                    Random
                  </div>
                </button>
              )
            })()}
          </>
        : <>
            <button onClick={ () => handleUnlockSkill(id) }>unlock</button>
          </>}
    </div>
  )
}

const value = PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string])
Skill.propTypes = {
  id: PropTypes.string,
  value,
  unlockedValues: PropTypes.arrayOf(value),
  unlocked: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  optionCost: PropTypes.number,
  description: PropTypes.string,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleUnlockSkill: PropTypes.func
}
