import React from 'react'
import PropTypes from 'prop-types'
import Item from './item.js'

export default function Shop ({
  items,
  handleBuyItem,
  handleClose
}) {
  return (
    <div className='shop'>
      <button
        className='shop__close-button'
        onClick={handleClose}
      >
        Leave Shop
      </button>
      <div className='items-list'>
        {Object.entries(items).map(([key, {
          description,
          ownedCount,
          cost
        }]) => (
          <Item
            key={key}
            id={key}
            description={description}
            ownedCount={ownedCount}
            cost={cost}
            handleBuyItem={() => handleBuyItem(key)}
          />
        ))}
        {Object.keys(items).slice(1).map((key) => <div key={key} className="skill-spacer" />)}
      </div>
    </div>
  )
}

Shop.propTypes = {
  items: PropTypes.object,
  handleBuyItem: PropTypes.func,
  handleClose: PropTypes.func
}
