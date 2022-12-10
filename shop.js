import React from 'react'
import PropTypes from 'prop-types'
import OptionSetting from './option-setting.js'
import calculateXpEarned from './calculate-xp-earned.js'

export default function Shop ({
  options,
  xp,
  lastXpEarned,
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
        Leave Shop
      </button>
      <div className='options'>
        {Object.entries(options).map(([key, {
          value,
          possibleValues,
          unlockedValues,
          unlockable,
          min,
          max,
          step,
          description,
          type
        }]) => (
          <OptionSetting
            key={key}
            id={key}
            description={description}
            type={type}
            possibleValues={possibleValues}
            unlockedValues={unlockedValues}
            value={value}
            handleUnlockOption={handleUnlockOption}
            handleSetOption={handleSetOption}
          />
        ))}
        {Object.keys(options).slice(1).map((key) => <div key={key} className="option-spacer" />)}
      </div>
      <div>Next Round is worth {calculateXpEarned(options)} xp</div>
    </div>
  )
}

Shop.propTypes = {
  options: PropTypes.object,
  xp: PropTypes.number,
  lastXpEarned: PropTypes.number,
  handleSetOption: PropTypes.func,
  handleUnlockOption: PropTypes.func,
  handleClose: PropTypes.func,
  wonLastGame: PropTypes.bool
}
