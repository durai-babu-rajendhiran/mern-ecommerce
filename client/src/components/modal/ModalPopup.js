import React from 'react'

const ModalPopup = ({children}) => {
    return (
        <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
           {children}
          </div>
        </div>
      </div>
    )
}

export default ModalPopup
