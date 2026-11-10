
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/content";

function CreatePlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [videoIds, setVideoIds] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Read authentication token.
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  // Fetch the logged-in user's playlists.
  const fetchPlaylists = async () => {
    try {
      setError("");

      const response = await axios.get(`${API_URL}/playlists`, {
        headers: getHeaders(),
        withCredentials: true,
      });

      setPlaylists(
        Array.isArray(response.data)
          ? response.data
          : response.data.playlists || []
      );
    } catch (err) {
      console.error("Fetch playlists error:", err);
      setError(
        err.response?.data?.message ||
          "Could not load playlists. Check authentication and the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Create a new playlist.

const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
        setError("Please enter a playlist title.");
        return;
    }

    try {
        setCreating(true);
        setError("");
        setMessage("");

        await axios.post(
            `${API_URL}/playlists`,
            {
                title: title.trim(),
                description: description.trim()
            },
            {
                headers: getHeaders(),
                withCredentials: true
            }
        );

        setTitle("");
        setDescription("");
        setShowForm(false);
        setMessage("Playlist created successfully!");

        await fetchPlaylists();

    } catch (err) {
        console.error("Create playlist error:", err);

        setError(
            err.response?.data?.message ||
            "Could not create playlist."
        );
    } finally {
        setCreating(false);
    }
};



  // Add a video to a playlist.
  const handleAddVideo = async (playlistId) => {
    const videoId = videoIds[playlistId]?.trim();

    if (!videoId) {
      setError("Enter a video ID first.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.post(
        `${API_URL}/playlists/${playlistId}/videos`,
        { videoId },
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );

      setVideoIds((prev) => ({ ...prev, [playlistId]: "" }));
      setMessage("Video added to playlist.");
      await fetchPlaylists();
    } catch (err) {
      console.error("Add video error:", err);
      setError(
        err.response?.data?.message || "Could not add video to playlist."
      );
    }
  };

  // Remove a video from a playlist.
  const handleRemoveVideo = async (playlistId, videoId) => {
    try {
      setError("");
      setMessage("");

      await axios.delete(
        `${API_URL}/playlists/${playlistId}/videos/${videoId}`,
        {
          headers: getHeaders(),
          withCredentials: true,
        }
      );

      setMessage("Video removed from playlist.");
      await fetchPlaylists();
    } catch (err) {
      console.error("Remove video error:", err);
      setError(
        err.response?.data?.message || "Could not remove video."
      );
    }
  };

  // Delete a playlist.
  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_URL}/playlists/${playlistId}`, {
        headers: getHeaders(),
        withCredentials: true,
      });

      setMessage("Playlist deleted successfully.");
      await fetchPlaylists();
    } catch (err) {
      console.error("Delete playlist error:", err);
      setError(
        err.response?.data?.message || "Could not delete playlist."
      );
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Your Playlists</h1>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
            setMessage("");
          }}
        >
          {showForm ? "Cancel" : "+ Create Playlist"}
        </button>
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {showForm && (
        <form onSubmit={handleCreatePlaylist} style={styles.form}>
          <h2>Create a Playlist</h2>

          <label style={styles.label} htmlFor="playlist-title">
            Playlist title
          </label>
          <input
            id="playlist-title"
            style={styles.input}
            type="text"
            placeholder="Enter playlist title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label style={styles.label} htmlFor="playlist-description">
            Description
          </label>
          <textarea
            id="playlist-description"
            style={styles.input}
            placeholder="Enter description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <button
            type="submit"
            style={styles.primaryButton}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p style={styles.empty}>No playlists found. Create your first playlist!</p>
      ) : (
        <section style={styles.grid}>
          {playlists.map((playlist) => (
            <article key={playlist._id} style={styles.card}>
              <h2>{playlist.title}</h2>
              <p>{playlist.description || "No description"}</p>
              <p style={styles.muted}>
                Channel: {playlist.channel?.name || "Your channel"}
              </p>

              <h3>Videos ({playlist.videos?.length || 0})</h3>

              {playlist.videos?.length > 0 ? (
                playlist.videos.map((video) => (
                  <div key={video._id} style={styles.videoRow}>
                    <span>{video.title || "Untitled video"}</span>
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() =>
                        handleRemoveVideo(playlist._id, video._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p style={styles.muted}>No videos in this playlist yet.</p>
              )}

              <div style={styles.addVideo}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter video ID"
                  value={videoIds[playlist._id] || ""}
                  onChange={(e) =>
                    setVideoIds((prev) => ({
                      ...prev,
                      [playlist._id]: e.target.value,
                    }))
                  }
                />

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => handleAddVideo(playlist._id)}
                >
                  Add Video
                </button>
              </div>

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => handleDeletePlaylist(playlist._id)}
              >
                Delete Playlist
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px",
    color: "inherit",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },
  heading: {
    fontSize: "28px",
    margin: 0,
  },
  form: {
    maxWidth: "550px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    marginBottom: "28px",
  },
  label: {
    fontWeight: "600",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #aaa",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "8px",
  },
  primaryButton: {
    background: "#cc0000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "11px 16px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    cursor: "pointer",
  },
  removeButton: {
    padding: "6px 9px",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop: "14px",
    padding: "10px",
    background: "#b00020",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "18px",
    minWidth: 0,
  },
  videoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  addVideo: {
    marginTop: "14px",
  },
  muted: {
    opacity: 0.7,
    fontSize: "13px",
  },
  empty: {
    padding: "20px 0",
  },
  success: {
    color: "green",
    marginBottom: "12px",
  },
  error: {
    color: "#d00000",
    marginBottom: "12px",
  },
};

export default CreatePlaylist;