import React from 'react'
import PropTypes from 'prop-types'
import DialogueTree from 'react-dialogue-tree/src/index'

import XpDisplay from './xp-display.js'

export default function Results ({
  options,
  answers,
  xp,
  lastXpEarned,
  handleClose,
  wonLastGame,
  runner
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
      {!wonLastGame && (
        <div className="results-answers">
          {answers}
        </div>
      )}
      <div>
        <XpDisplay amount={xp} />
      </div>
      <DialogueTree runner={runner} />
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
  answers: PropTypes.arrayOf(PropTypes.string),
  xp: PropTypes.number,
  lastXpEarned: PropTypes.number,
  handleClose: PropTypes.func,
  wonLastGame: PropTypes.bool,
  runner: PropTypes.object
}
