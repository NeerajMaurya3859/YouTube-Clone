from functools import lru_cache
from sentence_transformers import SentenceTransformer

from app.config import AI_MODEL


@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer(AI_MODEL)


def generate_embedding(text: str) -> list[float]:
    model = get_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()