import React from 'react'
import PropTypes from 'prop-types'

export default function Rules ({ options }) {
  const unlockedOptionEntries = Object.entries(options).filter(([, { unlocked }]) => unlocked)
  return (
    <div className='rules'>
      {!unlockedOptionEntries.length && (
        <div>
          No special rules unlocked. 6 guesses.
        </div>
      )}
      {unlockedOptionEntries.map(([key, option]) => (
        <div
          className='option'
          key={key}
        >
          {key}{option.value}
        </div>
      ))}
    </div>
  )
}

Rules.propTypes = {
  options: PropTypes.object
}
