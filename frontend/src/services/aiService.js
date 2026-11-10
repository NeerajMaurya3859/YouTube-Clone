const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://youtube-clone-nhr4.onrender.com";

export async function semanticVideoSearch(query) {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, limit: 10 })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to search videos"
    );
  }

  return data.videos;
}