// src/pages/LandingPage.tsx
import React from "react";
import NavBar from "../components/navBar"; // Adjust path as needed
import "../styles/landing-page.css"; // Import any specific styles for the landing page

const LandingPage: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="landing-page">
        <div className="landing-page-content">
          <h1>Welcome to Our Recipe Hub!</h1>
          <p>
            Share your favorite recipes and discover new delights from food
            lovers around the world. Let's cook, share, and enjoy together!
          </p>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
