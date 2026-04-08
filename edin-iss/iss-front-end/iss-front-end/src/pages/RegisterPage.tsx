import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login-page.css";

const RegisterPage: React.FC = () => {
  const [passwordVisible] = useState(false);
  const [repeatPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simple validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    // Ensure repeatPassword is sent to backend
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        repeatPassword: confirmPassword, // Adding repeatPassword to the payload
      });

      console.log("Success:", response.data);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/auth/signin");
    } catch (error: any) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Registration failed. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Register</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form className="login-form-flex" onSubmit={handleSubmit}>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="first-name">First Name:</label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={handleFirstNameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name:</label>
              <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={handleLastNameChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <div className="password-input-container">
              <input
                type={repeatPasswordVisible ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
        <p className="register-login-invite">
          Already have an account? <Link to="/auth/signin">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
