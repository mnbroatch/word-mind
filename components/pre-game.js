import React from 'react'
import PropTypes from 'prop-types'

export default function PreGame ({
  startGame
}) {
  return (
    <div className='pre-game'>
      <div className='pre-game__description'>
        Here is the description!
      </div>
      <button
        className='pr-egame__start-button'
        onClick={startGame}
      >
        Start!
      </button>
    </div>
  )
}

PreGame.propTypes = {
  startGame: PropTypes.func
}
