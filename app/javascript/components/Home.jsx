import React, { useState, useEffect } from "react";
import fetchWithCSRF from "../utils/fetchWithCSRF";
import Header from "./Header";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem("userIsLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");

    if (userIsLoggedIn === "true" && storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithCSRF("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        zip_code: zipCode,
        password,
      }),
    });

    if (response.ok) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userIsLoggedIn", "true");
      window.location.href = "/vote";
    } else {
      const data = await response.json();
      setError(data.errors?.join(", ") || "Login failed");
    }
  };

  const handleEnterWebsite = () => {
    window.location.href = "/vote";
  };

  if (isLoggedIn) {
    return (
      <div className="app-container">
        <Header />

        <main aria-labelledby="welcome-title">
          <h2 id="welcome-title" className="app-title">
            Welcome Back, {userEmail}!
          </h2>
          <div className="app-welcome-message" role="status" aria-live="polite">
            <p>You're already signed in. Ready to cast your vote?</p>
            <button onClick={handleEnterWebsite} className="app-button">
              Enter Website
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <main aria-labelledby="signin-title">
        <h2 id="signin-title" className="app-title">Sign in to vote</h2>

        <form onSubmit={handleSubmit} className="app-form">
          {error && (
            <p className="app-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="app-field-group">
            <label className="app-label" htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="myemail@example.com"
              className="app-input"
              autoComplete="email"
              required
            />
          </div>

          <div className="app-field-group">
            <label className="app-label" htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="app-input"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="app-field-group">
            <label className="app-label" htmlFor="zip-input">Zip code</label>
            <input
              id="zip-input"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="app-input"
              autoComplete="postal-code"
              required
            />
          </div>

          <button type="submit" className="app-button">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Home;
