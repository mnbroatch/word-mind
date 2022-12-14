import React from 'react'
import PropTypes from 'prop-types'
import Skill from './skill.js'
import calculateXpEarned from '../utils/calculate-xp-earned.js'

export default function Skills ({
  skills,
  xp,
  handleSetOption,
  handleUnlockOption,
  handleClose
}) {
  return (
    <div className='skills'>
      <button
        className='skills__close-button'
        onClick={handleClose}
      >
        Leave Shop
      </button>
      <div className='skills-list'>
        {Object.entries(skills).map(([key, {
          value,
          options,
          unlockedOptions,
          description
        }]) => (
          <Skill
            key={key}
            id={key}
            description={description}
            options={options}
            unlockedOptions={unlockedOptions}
            value={value}
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
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleClose: PropTypes.func
}
