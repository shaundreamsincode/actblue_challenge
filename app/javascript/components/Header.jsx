import React, { useState, useEffect } from "react";
import fetchWithCSRF from "../utils/fetchWithCSRF";

const Header = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get user email and login state from localStorage
    const email = localStorage.getItem("userEmail") || "";
    const loggedIn = localStorage.getItem("userIsLoggedIn") === "true";
    setUserEmail(email);
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetchWithCSRF("/api/logout", {
        method: "DELETE",
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userIsLoggedIn");

        // Redirect to home page
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="app-header">
      <a className="app-logo" href="/" aria-label="Home">
        VOTE.WEBSITE
      </a>

      <div className="app-header-right">
        {isLoggedIn && userEmail && (
          <>
            <p
              className="app-user-info"
              aria-live="polite"
            >
              signed in as {userEmail}
            </p>
            <button
              onClick={handleLogout}
              className="app-logout-button"
              aria-label="Log out"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
