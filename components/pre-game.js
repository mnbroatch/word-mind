import React from 'react'
import PropTypes from 'prop-types'
import DialogueTree from 'react-dialogue-tree/src/index'

export default function PreGame ({
  startGame,
  runner
}) {
  return (
    <div className='pre-game'>
      <DialogueTree runner={runner} stopAtCommand />
    </div>
  )
}

PreGame.propTypes = {
  startGame: PropTypes.func,
  runner: PropTypes.object
}
