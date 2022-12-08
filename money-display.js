import React from 'react'
import useRollingNumber from './use-rolling-number'

export default function MoneyDisplay ({ amount }) {
  const numberToDisplay = useRollingNumber(amount)
  console.log('numberToDisplay', numberToDisplay)
  const moneyToDisplay = `$${numberToDisplay.toFixed(2)}`

  return (
    <div className='points'>
      <div className='points__inner'>
        <div className='points__label'>
          {moneyToDisplay.split('').map((digit, i) => (
            <span key={i} className="points__digit">{digit}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
