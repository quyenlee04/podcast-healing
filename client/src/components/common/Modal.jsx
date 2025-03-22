import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default Modal;
