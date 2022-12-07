import React from 'react'
import PropTypes from 'prop-types'
import OptionSetting from './option-setting.js'
import calculatePointsEarned from './calculate-points-earned.js'

export default function Shop ({
  options,
  points,
  lastPointsEarned,
  handleSetOption,
  handleUnlockOption,
  handleClose,
  wonLastGame
}) {
  return (
    <div className='shop'>
      <button
        className='shop__close-button'
        onClick={handleClose}
      >
        Exit
      </button>
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
        {Object.keys(options).slice(1).map((key) => <div key={key} className="option-spacer" />)}
      </div>
      <div>Next Round is worth {calculatePointsEarned(options)} points</div>
    </div>
  )
}

Shop.propTypes = {
  options: PropTypes.object,
  points: PropTypes.number,
  lastPointsEarned: PropTypes.number,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleClose: PropTypes.func,
  wonLastGame: PropTypes.bool
}
