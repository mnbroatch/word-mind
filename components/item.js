import React from 'react'
import PropTypes from 'prop-types'

export default function Item ({
  name,
  description,
  cost,
  ownedCount,
  handleBuyItem
}) {
  return (
    <button
      onClick={handleBuyItem}
      className='item'
    >
      <div className='item__name'>
        {name}
      </div>
      <div className='item__cost'>
        ${cost}
      </div>
      <div className='item__description'>
        {description}
      </div>
      <div className='item__owned-count'>
        Owned: {ownedCount}
      </div>
    </button>
  )
}

Item.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  cost: PropTypes.number,
  ownedCount: PropTypes.number,
  handleBuyItem: PropTypes.func
}
