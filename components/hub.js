import React from 'react'
import PropTypes from 'prop-types'

export default function Hub ({
  goToGame,
  goToShop
}) {
  return (
    <div className='hub'>
      <button
        className='hub__continue-button'
        onClick={goToGame}
      >
        <span className="hub__continue-button">
          Start
        </span>
      </button>
      <button
        className='hub__shop-button'
        onClick={goToShop}
      >
        <span className="hub__shop-button">
          Shop
        </span>
      </button>
    </div>
  )
}

Hub.propTypes = {
  goToGame: PropTypes.func,
  goToShop: PropTypes.func
}
