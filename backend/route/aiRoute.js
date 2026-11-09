import express from "express";

const router = express.Router();

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8001";

router.post("/search", async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;

    if (
      typeof query !== "string" ||
      query.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a search query containing at least 2 characters."
      });
    }

    const response = await fetch(
      `${AI_SERVICE_URL}/ai/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query.trim(),
          limit
        }),
        signal: AbortSignal.timeout(30000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.detail || "AI search failed"
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("AI search error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to connect to the AI service."
    });
  }
});

export default router;