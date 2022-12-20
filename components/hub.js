import React from 'react'
import PropTypes from 'prop-types'

export default function Hub ({
  handleGoToShop,
  handleGoToSkills,
  handleGoToGame
}) {
  return (
    <div className='hub'>
      <button
        className='hub__close-button'
        onClick={handleGoToSkills}
      >
        <span className="hub__close-button-inner">
          SKILLS
        </span>
      </button>
      <button
        className='hub__close-button'
        onClick={handleGoToShop}
      >
        <span className="hub__close-button-inner">
          SHOP
        </span>
      </button>
      <button
        className='hub__shop-button'
        onClick={handleGoToGame}
      >
        <span className="hub__continue-button">
          Continue
        </span>
      </button>
    </div>
  )
}

Hub.propTypes = {
  handleGoToShop: PropTypes.func,
  handleGoToSkills: PropTypes.func,
  handleGoToGame: PropTypes.func
}
