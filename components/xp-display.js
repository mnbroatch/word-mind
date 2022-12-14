import React from 'react'
import { PropTypes } from 'prop-types'
import useRollingNumber from '../hooks/use-rolling-number'

export default function XpDisplay ({ amount }) {
  const numberToDisplay = useRollingNumber(amount)
  const xpToDisplay = Math.floor(numberToDisplay).toString()

  return (
    <div className='xp'>
      <div className='xp__label'>
        {xpToDisplay.split('').map((digit, i) => (
          <span key={i} className="xp__digit">{digit}</span>
        ))}
      </div>
      <div className='xp__background-squiggle'>∿</div>
      <div className='xp__background-squiggle'>∿</div>
    </div>
  )
}

XpDisplay.propTypes = {
  amount: PropTypes.number
}
