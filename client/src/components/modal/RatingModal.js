import React, { useState } from "react";
import { useSelector } from "react-redux";

const RatingModal = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div onClick={() => setModalVisible(true)}>
        {user ? "Leave rating" : "Login to leave rating"}
      </div>
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
    </>
  );
};

export default RatingModal;
