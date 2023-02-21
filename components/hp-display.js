import React from 'react'
import { PropTypes } from 'prop-types'
import useRollingNumber from '../hooks/use-rolling-number'

export default function HpDisplay ({ amount, max }) {
  const numberToDisplay = useRollingNumber(amount)
  const hpToDisplay = Math.floor(numberToDisplay).toString()

  const percentDone = (amount / max) * 100

  return (
    <div className='hp'>
      <div className="hp__meter">
        <div
          style={{ width: `${percentDone}%` }}
          className={[
            'hp__meter__inner',
            percentDone < 25 && 'hp__meter__inner--low'
          ].filter(Boolean).join(' ')}
        />
        <div className='hp__label'>
          {hpToDisplay} HP
        </div>
      </div>
    </div>
  )
}

HpDisplay.propTypes = {
  amount: PropTypes.number,
  max: PropTypes.number
}
