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
    <div className='game-end'>
      <div className='results'>
        <div>
          { points } Points
        </div>
        {wonLastGame && (
          <div className="result-title result-title--won">
            Won! { lastPointsEarned } point{ lastPointsEarned !== 1 ? 's' : ''} gained this round
          </div>
        )}
        {!wonLastGame && (
          <div className="result-title result-title--lost">
            Lost! No Points!
          </div>
        )}
      </div>
      <div className='options'>
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
        {Object.keys(options).map((key) => <div key={key} className="option-spacer" />)}
      </div>
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
