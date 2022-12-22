import React from 'react'
import PropTypes from 'prop-types'

export default function Equipment ({
  equipment,
  handleBuyEquipment,
  handleClose
}) {
  return (
    <div className='equipment'>
      <button
        className='equipment__close-button'
        onClick={handleClose}
      >
        Leave Shop
      </button>
      <div className='equipment-list'>
        {Object.entries(equipment).map(([key, {
          description,
          owned,
          cost
        }]) => (
          <button
            key={key}
            onClick={() => { handleBuyEquipment(key) }}
          >
            <div>
              {description}
            </div>
            <div>
              {owned ? 'Sold Out' : `Cost: $${cost}`}
            </div>
          </button>
        ))}
        {Object.keys(equipment).slice(1).map(key => <div key={key} className="skill-spacer" />)}
      </div>
    </div>
  )
}

Equipment.propTypes = {
  equipment: PropTypes.object,
  handleBuyEquipment: PropTypes.func,
  handleClose: PropTypes.func
}
