import React from 'react'
import PropTypes from 'prop-types'

export default function Modal ({ handleClose, children, open }) {
  return (
    <div
      className={[
        'modal',
        open && 'modal--open'
      ].filter(Boolean).join(' ')}
    >
      <div className='modal__inner'>
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
