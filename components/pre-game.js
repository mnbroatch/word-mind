import React from 'react'
import PropTypes from 'prop-types'
import DialogueTree from 'react-dialogue-tree/src/index'

export default function PreGame ({
  startGame,
  runner
}) {
  const handleCommand = function (command) {
    if (command.command === 'play') {
      startGame()
    }
  }

  return (
    <div className='pre-game'>
      <DialogueTree runner={runner} handleCommand={handleCommand} stopAtCommand />
    </div>
  )
}

PreGame.propTypes = {
  startGame: PropTypes.func,
  runner: PropTypes.object
}
