import React from 'react'
import PropTypes from 'prop-types'
import useRerender from '../hooks/use-rerender.js'
import useInterval from '../hooks/use-interval.js'

function isItemActive (item) {
  return item.activeUntil > Date.now()
}

export default function Hub ({
  items,
  equipment,
  handleUseItem,
  handleToggleEquipment,
  handleGoToShop,
  handleGoToGame,
  handleGoToSkills,
  handleGoToEquipment
}) {
  const rerender = useRerender()
  useInterval(rerender, 1000)
  return (
    <div className='hub'>
      <button
        className='hub__button'
        onClick={handleGoToSkills}
      >
        <span className="hub__button-inner">
          SKILLS
        </span>
      </button>
      <button
        className='hub__button'
        onClick={handleGoToShop}
      >
        <span className="hub__button-inner">
          SHOP
        </span>
      </button>
      <button
        className='hub__button'
        onClick={handleGoToEquipment}
      >
        <span className="hub__button-inner">
          EQUIPMENT SHOP
        </span>
      </button>
      <button
        className='hub__continue-button'
        onClick={handleGoToGame}
      >
        <span className="hub__continue-button">
          Continue
        </span>
      </button>
      {Object.values(items).some(item => item.ownedCount >= 1) && (
        <div className="inventory">
          {Object.entries(items).filter(([key, item]) => item.ownedCount >= 1).map(([key, item]) => (
            <div
              key={key}
              className="inventory__item"
            >
              <div>
                {item.description}
              </div>
              <div>
                Owned: {item.ownedCount}
              </div>
              <button onClick={() => { handleUseItem(key) }}>Use</button>
              {isItemActive(item) && <div>Active time remaining: {Math.floor((item.activeUntil - Date.now()) / 1000)}s</div>}
            </div>
          ))}
        </div>
      )}
      {Object.values(equipment).some(piece => piece.owned) && (
        <div className="equipment-inventory">
          {Object.entries(equipment).filter(([key, piece]) => piece.owned).map(([key, piece]) => (
            <div
              key={key}
              className="equipment-inventory__piece"
            >
              <div>
                {piece.description}
              </div>
              <button
                className="button"
                onClick={() => { handleToggleEquipment(key) }}
              >
                {piece.active ? 'EQUIPPED' : 'NOT EQUIPPED'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Hub.propTypes = {
  items: PropTypes.object,
  equipment: PropTypes.object,
  handleToggleEquipment: PropTypes.func,
  handleUseItem: PropTypes.func,
  handleGoToShop: PropTypes.func,
  handleGoToSkills: PropTypes.func,
  handleGoToEquipment: PropTypes.func,
  handleGoToGame: PropTypes.func
}
