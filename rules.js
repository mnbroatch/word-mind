import React from 'react'
import PropTypes from 'prop-types'

export default function Rules ({ options }) {
  const modifiedOptionEntries = Object.entries(options).filter(([_, { value, initialValue }]) => value !== initialValue)
  return (
    <div className='rules'>
      {!modifiedOptionEntries.length && (
        <div>
          No special rules unlocked.
        </div>
      )}
      {modifiedOptionEntries.map(([key, option]) => (
        <div
          className='option'
          key={key}
        >
          {key}: {option.value}
        </div>
      ))}
    </div>
  )
}

Rules.propTypes = {
  options: PropTypes.object
}
