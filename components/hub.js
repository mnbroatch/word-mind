import React from 'react'
import PropTypes from 'prop-types'

export default function Hub ({
  handleGoToGame
}) {
  return (
    <div className='hub'>
      <button
        className='hub__continue-button'
        onClick={handleGoToGame}
      >
        <span className="hub__continue-button">
          Start
        </span>
      </button>
    </div>
  )
}

Hub.propTypes = {
  handleGoToGame: PropTypes.func
}
