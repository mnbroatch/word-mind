import React from 'react'
import PropTypes from 'prop-types'

import XpDisplay from './xp-display.js'

export default function Results ({
  options,
  xp,
  lastXpEarned,
  handleClose,
  wonLastGame
}) {
  return (
    <div className='results'>
      {wonLastGame && (
        <div className="results-title results-title--won">
          + {lastXpEarned} XP
        </div>
      )}
      {!wonLastGame && (
        <div className="results-title results-title--lost">
          FAILED
        </div>
      )}
      <div>
        <XpDisplay amount={xp} />
      </div>
      <button
        className='results__close-button'
        onClick={handleClose}
      >
        <span className="results__close-button-inner">
          Continue
        </span>
      </button>
    </div>
  )
}

Results.propTypes = {
  options: PropTypes.object,
  xp: PropTypes.number,
  lastXpEarned: PropTypes.number,
  handleClose: PropTypes.func,
  wonLastGame: PropTypes.bool
}
