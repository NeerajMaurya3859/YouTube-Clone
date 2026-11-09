import { useState } from "react";
import { semanticVideoSearch } from "../services/aiService";

export default function AISearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (query.trim().length < 2) {
      setError("Enter at least 2 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const videos = await semanticVideoSearch(query);

      onResults(videos);
    } catch (err) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Describe the video you want to find..."
          aria-label="AI video search"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "AI Search"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}