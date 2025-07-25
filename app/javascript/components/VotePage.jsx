import React, { useEffect, useState } from "react";
import fetchWithCSRF from "../utils/fetchWithCSRF";
import Header from "./Header";

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [writeInName, setWriteInName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetch("/api/vote")
      .then((res) => res.json())
      .then((data) => {
        if (data.voted) {
          window.location.href = "/results?message=already_voted";
        } else {
          fetch("/api/candidates")
            .then((res) => res.json())
            .then((candidatesData) => {
              setCandidates(candidatesData);
              setLoading(false);
            });
        }
      });
  }, []);

  const hasReachedLimit = candidates.length >= 10;

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate to vote for.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const res = await fetchWithCSRF("/api/vote", {
      method: "POST",
      body: JSON.stringify({ candidate_id: selectedCandidate }),
    });

    if (res.ok) {
      window.location.href = "/results?message=success";
    } else {
      const data = await res.json();
      setError(data.error || data.errors?.join(", ") || "Vote failed.");
    }

    setSubmitting(false);
  };

  const handleWriteInSubmit = async (e) => {
    e.preventDefault();
    if (!writeInName.trim() || hasReachedLimit) return;

    setSubmitting(true);
    setError(null);

    const res = await fetchWithCSRF("/api/candidates", {
      method: "POST",
      body: JSON.stringify({ name: writeInName }),
    });

    if (res.ok) {
      window.location.href = "/results?message=success";
    } else {
      const data = await res.json();
      setError(data.error || data.errors?.join(", ") || "Submission failed.");
    }

    setSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <Header />

      <main aria-labelledby="vote-title">
        <h2 id="vote-title" className="app-title">Cast your vote today!</h2>

        {error && (
          <p className="app-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {candidates.length > 0 && (
          <div className="app-section">
            <ul
              className="app-candidate-list"
              role="radiogroup"
            >
              {candidates.map((candidate) => (
                <li key={candidate.id} className="app-candidate-item">
                  <input
                    type="radio"
                    id={`candidate-${candidate.id}`}
                    name="candidate"
                    value={candidate.id}
                    onChange={(e) => setSelectedCandidate(Number(e.target.value))}
                    className="app-radio-input"
                  />
                  <label
                    htmlFor={`candidate-${candidate.id}`}
                    className="app-candidate-label"
                    id={`candidate-label-${candidate.id}`}
                  >
                    {candidate.name}
                  </label>
                </li>
              ))}
            </ul>

            <button
              onClick={handleVote}
              disabled={submitting || !selectedCandidate}
              className={`app-button ${(submitting || !selectedCandidate) ? 'app-disabled' : ''}`}
            >
              Vote
            </button>
          </div>
        )}

        {candidates.length > 0 && <div className="app-separator"></div>}

        {!hasReachedLimit && (
          <div className="app-write-in-section">
            <p className="app-write-in-prompt" id="write-in-label">
              {candidates.length > 0 ? "Or, add a new candidate:" : "Add a new candidate:"}
            </p>

            <form
              onSubmit={handleWriteInSubmit}
              className="app-write-in-form"
            >
              <input
                type="text"
                value={writeInName}
                onChange={(e) => setWriteInName(e.target.value)}
                placeholder="Enter name..."
                disabled={submitting}
                className={`app-input-flex ${submitting ? 'app-disabled' : ''}`}
                aria-label="Write-in candidate name"
                required
              />
              <button
                type="submit"
                disabled={submitting || !writeInName.trim()}
                className={`app-button-small ${(submitting || !writeInName.trim()) ? 'app-disabled' : ''}`}
                aria-label="Submit write-in"
              >
                Vote
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default VotePage;
