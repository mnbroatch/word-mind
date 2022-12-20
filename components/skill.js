import React from 'react'
import PropTypes from 'prop-types'
import Option from './option'

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
  skillCost,
  random,
  optionCost
}) {
  const totalMastery = options.reduce((acc, opt) => acc + opt.mastery, 0)
  const spentMastery = (unlockedValues.length - 2) * optionCost
  const isFullyUpgraded = totalMastery >= optionCost * options.length
  const allOptionsAreUnlocked = unlockedValues.length >= options.length
  let remainingMastery
  let selectedOptionMastery
  if (!isFullyUpgraded) {
    remainingMastery = totalMastery - spentMastery
    selectedOptionMastery = options.find(opt => opt.value === value).mastery
  }
  return (
    <div className='skill'>
      <div className='skill__description'>
        {description}
      </div>
      {unlocked
        ? <>
            {!allOptionsAreUnlocked && <div className='skill__mastery'>
              <div className='skill__available-mastery'>
                Available Mastery: {remainingMastery}
              </div>
            </div>}
            {!isFullyUpgraded && <div className='skill__option-mastery'>
              Option Mastery: {selectedOptionMastery}
            </div>}
            <div className='skill__options'>
              {options.map((option, index) => (
                <Option
                  key={option.value}
                  optionCost={optionCost}
                  random={random}
                  skillId={id}
                  selectedValue={value}
                  unlockedValues={unlockedValues}
                  handleSetOption={handleSetOption}
                  handleUnlockOption={handleUnlockOption}
                  {...option}
                />
              ))}
            </div>
            {(() => {
              if (!isFullyUpgraded) return null

              let status
              if (random) {
                status = 'selected'
              } else {
                status = 'unlocked'
              }

              return (
                <button
                  className={ `skill__option skill__option--random skill__option--${status}` }
                  onClick={() => { handleSetOption(id, 'random') }}
                >
                  <div className='skill__option-inner'>
                    Random
                  </div>
                </button>
              )
            })()}
          </>
        : <>
            <button onClick={ () => handleUnlockSkill(id) }>Unlock ({skillCost} XP)</button>
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
  handleUnlockSkill: PropTypes.func,
  skillCost: PropTypes.number,
  random: PropTypes.bool
}
