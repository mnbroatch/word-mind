import React from 'react'
import PropTypes from 'prop-types'

export default function InventoryItem ({
  name,
  description,
  ownedCount,
  handleUseItem
}) {
  return (
    <button
      onClick={handleUseItem}
      className='item'
    >
      <div className='item__name'>
        {name}
      </div>
      <div className='item__owned-count'>
        Owned: {ownedCount}
      </div>
    </button>
  )
}

InventoryItem.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  ownedCount: PropTypes.number,
  handleUseItem: PropTypes.func
}
