import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "youtube")
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "videos")

AI_MODEL = os.getenv(
    "AI_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

VECTOR_INDEX_NAME = os.getenv(
    "VECTOR_INDEX_NAME",
    "video_embedding_index"
)

BACKEND_API_URL = os.getenv(
    "BACKEND_API_URL",
    "http://localhost:8000"
)