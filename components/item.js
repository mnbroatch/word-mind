import React from 'react'
import PropTypes from 'prop-types'

export default function Item ({
  id,
  description,
  cost,
  ownedCount,
  handleBuyItem
}) {
  return (
    <div className='item'>
      <div className='item__description'>
        {description}
      </div>
    </div>
  )
}

Item.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
  cost: PropTypes.number,
  ownedCount: PropTypes.number,
  handleBuyItem: PropTypes.func
}
