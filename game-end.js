import React from 'react'
import PropTypes from 'prop-types'
import OptionSetting from './option-setting.js'
import calculatePointsEarned from './calculate-points-earned.js'

export default function GameEnd ({
  options,
  points,
  lastPointsEarned,
  handleSetOption,
  handleUnlockOption,
  wonLastGame
}) {
  return (
    <div className='options'>
      <div className='results'>
        <div>
          { points } Points
        </div>
        <div>
          { lastPointsEarned } gained this round
        </div>
      </div>
      {Object.entries(options).map(([key, {
        value,
        unlockedValues,
        unlockable,
        min,
        max,
        step,
        name,
        type
      }]) => (
        <OptionSetting
          key={key}
          id={key}
          name={name}
          type={type}
          unlockedValues={unlockedValues}
          unlockable={unlockable}
          min={min}
          max={max}
          step={step}
          points={points}
          value={value}
          handleUnlockOption={handleUnlockOption}
          handleSetOption={handleSetOption}
        />
      ))}
      <div>Next Round is worth {calculatePointsEarned(options)} points</div>
    </div>
  )
}

GameEnd.propTypes = {
  options: PropTypes.object,
  points: PropTypes.number,
  lastPointsEarned: PropTypes.number,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  wonLastGame: PropTypes.bool
}
