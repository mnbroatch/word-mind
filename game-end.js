import React from 'react'
import PropTypes from 'prop-types'

export default function GameEnd ({ options, points, lastPointsEarned, handleSetOption, handleUnlockOption, handleClose }) {
  const optionEntries = Object.entries(options)
  const unlockedOptionEntries = optionEntries.filter(([, { unlocked }]) => unlocked)
  const unlockableOptionEntries = optionEntries.filter(([, { unlocked, cost }]) => !unlocked && points >= cost)
  const lockedOptionEntries = optionEntries.filter(([, { unlocked, cost }]) => !unlocked && points < cost)
  return (
    <div className='options'>
      <div className='results'>
        <button onClick={handleClose}>
          Close
        </button>
        <div>
          { points } Points
        </div>
        <div>
          { lastPointsEarned } gained this round
        </div>
      </div>
      {unlockedOptionEntries.map(([key, option]) => (
        <div
          className='option'
          key={key}
        >
          {key}
          <input
            type="number"
            value={option.value}
            onChange={(e) => { handleSetOption(key, e.target.valueAsNumber || e.target.value) }}
          />
        </div>
      ))}
      {unlockableOptionEntries.map(([key, option]) => (
        <a
          className="option option--unlockable"
          onClick={() => { handleUnlockOption(key) }}
          key={key}
        >
          {key}
          Unlock for { option.cost } points
        </a>
      ))}
      {lockedOptionEntries.map(([key, option]) => (
        <a
          className="option option--locked"
          key={key}
        >
          {key}
        </a>
      ))}
    </div>
  )
}

GameEnd.propTypes = {
  options: PropTypes.object,
  points: PropTypes.number,
  lastPointsEarned: PropTypes.number,
  handleClose: PropTypes.func,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func
}
