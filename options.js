import React from 'react'
import PropTypes from 'prop-types'

export default function Options ({ handleClose, options }) {
  const unlockedOptionEntries = Object.entries(options).filter(([, { unlocked }]) => unlocked)
  return (
    <div className='options'>
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

Options.propTypes = {
  handleClose: PropTypes.func,
  options: PropTypes.object
}
