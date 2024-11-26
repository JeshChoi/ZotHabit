import React, { useState } from "react";
import "./LoginSignup.css"; // Importing the CSS file

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true); 
  // State to toggle between login and signup
  // Default is Login
 
  const toggleForm = () => setIsLogin(!isLogin); // Function to switch forms

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(`${isLogin ? "Login" : "Signup"} Data:`, data);
    // Add API calls or validation logic here
  };

  return (
    <div className="container">
        <h2 underline> {isLogin ? "Login" : "Signup"} </h2>
        <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password" >Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        <button type="submit" className="submit-btn">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>
      <button onClick={toggleForm} className="toggle-btn">
        {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default LoginSignup;

// htmlFor makes it so that the label will link to that text field
// input type adds some validation as seen with email and apssword
