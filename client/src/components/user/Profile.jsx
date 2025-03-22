import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import "../../styles/Profile.css";
const Profile = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <Button text="Xóa tài khoản" onClick={() => setShowModal(true)} className="danger-btn" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Bạn có chắc muốn xóa tài khoản không?</h3>
        <Button text="Hủy" onClick={() => setShowModal(false)} className="secondary-btn" />
        <Button text="Xác nhận" onClick={() => alert("Tài khoản đã bị xóa!")} className="danger-btn" />
      </Modal>
    </div>
  );
};

export default Profile;
