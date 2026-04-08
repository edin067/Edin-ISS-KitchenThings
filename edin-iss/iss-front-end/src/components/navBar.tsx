// src/components/NavBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">KitchenThings</Link>
      </div>
      <div className="navbar-links">
        <Link to="/auth/signin">Login</Link>
        <Link to="/auth/signup">Register</Link>
      </div>
    </nav>
  );
};

export default NavBar;
