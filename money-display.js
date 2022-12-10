import React from 'react'
import { PropTypes } from 'prop-types'
import useRollingNumber from './use-rolling-number'

export default function MoneyDisplay ({ amount }) {
  const numberToDisplay = useRollingNumber(amount)
  const moneyToDisplay = `$${numberToDisplay.toFixed(2)}`

  return (
    <div className='money'>
      <div className='money__inner'>
        <div className='money__label'>
          {moneyToDisplay.split('').map((digit, i) => (
            <span key={i} className="money__digit">{digit}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

MoneyDisplay.propTypes = {
  amount: PropTypes.number
}
