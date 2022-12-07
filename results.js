import React from 'react'
import PropTypes from 'prop-types'

export default function Results ({
  options,
  points,
  lastPointsEarned,
  handleClose,
  wonLastGame
}) {
  return (
    <div className='results'>
      {wonLastGame && (
        <div className="results-title results-title--won">
          Won!
        </div>
      )}
      {!wonLastGame && (
        <div className="results-title results-title--lost">
          Lost!
        </div>
      )}
      <button
        className='results__close-button'
        onClick={handleClose}
      >
        To the shop...
      </button>
    </div>
  )
}

Results.propTypes = {
  options: PropTypes.object,
  points: PropTypes.number,
  lastPointsEarned: PropTypes.number,
  handleClose: PropTypes.func,
  wonLastGame: PropTypes.bool
}
