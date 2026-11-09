from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.config import (
    MONGODB_URI,
    MONGODB_DATABASE,
    MONGODB_COLLECTION,
    VECTOR_INDEX_NAME
)

from app.services.embedding_service import generate_embedding

router = APIRouter(prefix="/ai", tags=["AI Search"])


class SearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=300)
    limit: int = Field(default=10, ge=1, le=50)


def get_collection():
    if not MONGODB_URI:
        raise RuntimeError("MONGODB_URI is not configured")

    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000
    )

    return (
        client,
        client[MONGODB_DATABASE][MONGODB_COLLECTION]
    )


@router.post("/search")
def semantic_search(request: SearchRequest):
    client = None

    try:
        query_embedding = generate_embedding(request.query)

        client, collection = get_collection()

        pipeline = [
            {
                "$vectorSearch": {
                    "index": VECTOR_INDEX_NAME,
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": max(request.limit * 10, 100),
                    "limit": request.limit
                }
            },
            {
                "$project": {
                    "title": 1,
                    "description": 1,
                    "thumbnail": 1,
                    "category": 1,
                    "channel": 1,
                    "score": {
                        "$meta": "vectorSearchScore"
                    }
                }
            }
        ]

        results = list(collection.aggregate(pipeline))

        for video in results:
            video["_id"] = str(video["_id"])

        return {
            "success": True,
            "query": request.query,
            "count": len(results),
            "videos": results
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    except PyMongoError as error:
        raise HTTPException(
            status_code=500,
            detail="MongoDB search failed"
        )

    finally:
        if client:
            client.close()