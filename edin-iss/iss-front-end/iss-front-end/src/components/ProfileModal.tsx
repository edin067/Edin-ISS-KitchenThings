import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile-modal.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success messages

  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open. Fetching user data...");
      axios
        .get("http://localhost:3000/me", { withCredentials: true })
        .then((response) => {
          console.log("Fetched user data:", response.data);
          const userData = response.data;
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [isOpen]);

  // Function to handle profile information update (excluding password)
  const handleSaveProfile = async () => {
    setSuccessMessage(""); // Clear success message
    setErrorMessage(""); // Clear error message

    const updatedUserData = {
      firstName,
      lastName,
      email,
    };

    try {
      console.log("Sending updated user profile data:", updatedUserData);

      const response = await axios.patch(
        "http://localhost:3000/me/update-user",
        updatedUserData,
        { withCredentials: true }
      );

      console.log("Profile update response from server:", response);

      if (response.status === 200) {
        console.log("Profile updated successfully.");
        setSuccessMessage("Profile changes saved successfully."); // Set success message
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      if (error.response) {
        console.log("Error response from server:", error.response.data);
      }
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  // Function to handle password change
  const handleChangePassword = async () => {
    setSuccessMessage(""); // Clear success message
    setErrorMessage(""); // Clear error message

    if (newPassword !== repeatNewPassword) {
      setErrorMessage("New passwords do not match");
      console.log("Password mismatch. New passwords do not match.");
      return;
    }

    const passwordData = {
      currentPassword,
      newPassword,
      repeatNewPassword,
    };

    try {
      console.log("Sending password change data:", passwordData);

      const response = await axios.patch(
        "http://localhost:3000/me/update-password",
        passwordData,
        { withCredentials: true }
      );

      console.log("Password change response from server:", response);

      if (response.status === 200) {
        console.log("Password updated successfully.");
        setSuccessMessage("Your password has been changed successfully."); // Set success message
        setCurrentPassword("");
        setNewPassword("");
        setRepeatNewPassword("");
        setErrorMessage("");
      }
    } catch (error: any) {
      console.error("Failed to update password:", error);
      if (error.response) {
        console.log("Error response from server:", error.response.data);
      }
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>Edit profile</h2>

        {/* Display error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Display success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="edit-profile-form">
          <label>
            First name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Save profile button */}
          <div className="modal-buttons">
            <button type="button" onClick={handleSaveProfile}>
              Save profile
            </button>
          </div>

          <h3>Change password</h3>

          <label>
            Current password:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label>
            New password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label>
            Repeat new password:
            <input
              type="password"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
            />
          </label>

          {/* Change password button */}
          <div className="modal-buttons modal-save-cancel-btn-box">
            <button type="button" onClick={handleChangePassword}>
              Change password
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
