import React from 'react'
import PropTypes from 'prop-types'
import Skill from './skill.js'
import calculateXpEarned from '../utils/calculate-xp-earned.js'
import calculateXpCost from '../utils/calculate-xp-cost.js'

export default function Skills ({
  skills,
  xp,
  handleUnlockSkill,
  handleUnlockOption,
  handleSetOption,
  handleClose,
  optionCost
}) {
  return (
    <div className='skills'>
      <button
        className='skills__close-button'
        onClick={handleClose}
      >
        Back to Hub
      </button>
      <div className='skill__cost'>
        Skill Cost: {calculateXpCost(skills)}xp
      </div>
      <div className='skill__option-cost'>
        Cost Per Option: {optionCost} Mastery
      </div>
      <div className='skills-list'>
        {Object.entries(skills).map(([key, {
          value,
          options,
          unlockedValues,
          unlocked,
          description
        }]) => (
          <Skill
            key={key}
            id={key}
            description={description}
            options={options}
            optionCost={optionCost}
            unlockedValues={unlockedValues}
            unlocked={unlocked}
            value={value}
            handleUnlockSkill={handleUnlockSkill}
            handleUnlockOption={handleUnlockOption}
            handleSetOption={handleSetOption}
          />
        ))}
        {Object.keys(skills).slice(1).map((key) => <div key={key} className="skill-spacer" />)}
      </div>
      <div>Next Round is worth {calculateXpEarned(skills)} xp</div>
    </div>
  )
}

Skills.propTypes = {
  skills: PropTypes.object,
  xp: PropTypes.number,
  handleUnlockSkill: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleSetOption: PropTypes.func,
  handleClose: PropTypes.func,
  optionCost: PropTypes.number
}
