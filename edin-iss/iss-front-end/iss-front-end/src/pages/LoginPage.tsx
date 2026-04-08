import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login-page.css"; // Add your CSS file for styling

const LoginPage: React.FC = () => {
  const [passwordVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simple validation
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    // Perform login logic
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/signin", // Replace with your backend endpoint
        { email, password },
        { withCredentials: true } // Ensures cookies are sent with the request
      );
      setErrorMessage(""); // Clear any previous errors
      navigate("/dashboard"); // Redirect to the desired page after login
    } catch (err) {
      setErrorMessage(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form-flex" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Your email"
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
                placeholder="Your password"
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="register-login-invite">
          Don't have an account? <Link to="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
