import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { toast } from 'react-toastify';
import "../../styles/Profile.css";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    bio: user?.profile?.bio || "",
    avatar: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      avatar: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('bio', formData.bio);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      await authService.updateProfile(formDataToSend);
      await updateUser();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return "/default-avatar.png";
    if (avatarPath.startsWith('http')) return avatarPath;

    return `http://localhost:5000${avatarPath}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={getAvatarUrl(user?.profile?.avatar)} 
          alt="Profile" 
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
        <h2>{user?.username}</h2>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="button-group">
            <Button text="Save" type="submit" className="primary-btn" />
            <Button text="Cancel" onClick={() => setIsEditing(false)} className="secondary-btn" />
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>First Name:</strong> {user?.profile?.firstName || "Not set"}</p>
          <p><strong>Last Name:</strong> {user?.profile?.lastName || "Not set"}</p>
          <p><strong>Bio:</strong> {user?.profile?.bio || "No bio yet"}</p>
          <Button text="Edit Profile" onClick={() => setIsEditing(true)} className="primary-btn" />
          <Button text="Delete Account" onClick={() => setShowModal(true)} className="danger-btn" />
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Are you sure you want to delete your account?</h3>
        <p>This action cannot be undone.</p>
        <div className="button-group">
          <Button text="Cancel" onClick={() => setShowModal(false)} className="secondary-btn" />
          <Button text="Delete" onClick={() => alert("Account deleted!")} className="danger-btn" />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
