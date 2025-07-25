import React, { useEffect, useState } from "react";
import Header from "./Header";

const ResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const message = params.get("message");

  useEffect(() => {
    fetch("/api/candidates?sort_by=votes")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading results", err);
        setError("Failed to load voting results. Please try again later.");
        setLoading(false);
      });
  }, []);

  const renderMessage = () => {
    if (message === "success") {
      return (
        <div className="app-success">
          <p>Thanks for voting!</p>
        </div>
      );
    }
    if (message === "already_voted") {
      return (
        <div>
          <p>You already voted. Here are the results:</p>
        </div>
      );
    }
    return null;
  };

  const renderError = () => {
    if (error) {
      return (
        <div className="app-error" role="alert" aria-live="assertive">
          <p>{error}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <main>
          <div>
            <p>Loading results...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <main aria-labelledby="results-main-title">
        <h1 id="results-main-title" className="app-title">Voting Results</h1>

        {renderMessage()}
        {renderError()}

        <section className="app-section">
          {candidates.length > 0 ? (
            <div>
              <ul className="app-results-list">
                {candidates.map((candidate, index) => (
                  <li
                    key={candidate.id}
                    className="app-result-item"
                  >
                    <span className="app-result-rank" aria-hidden="true">
                      #{index + 1}
                    </span>
                    <span className="app-result-name">
                      {candidate.name}
                    </span>
                    <span className="app-result-votes">
                      {candidate.votes} vote{candidate.votes !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                id="results-summary"
                className="app-results-summary"
                role="status"
                aria-live="polite"
              >
                <p>Total votes cast: {candidates.reduce((sum, c) => sum + c.votes, 0)}</p>
                <p>Number of candidates: {candidates.length}</p>
              </div>
            </div>
          ) : (
            <div className="app-no-results">
              <p>No votes have been cast yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ResultsPage;
