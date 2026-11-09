from pymongo import MongoClient
from app.config import (
MONGODB_URI,
MONGODB_DATABASE,
MONGODB_COLLECTION,
)
from app.services.embedding_service import generate_embedding

def main():
    if not MONGODB_URI:
        raise RuntimeError("MONGODB_URI is not configured")
client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000,
)

try:
    collection = client[MONGODB_DATABASE][MONGODB_COLLECTION]

    videos = collection.find(
        {"embedding": {"$exists": False}},
        {"title": 1, "description": 1, "tags": 1},
    )

    updated = 0

    for video in videos:
        title = video.get("title", "")
        description = video.get("description", "")
        tags = video.get("tags", [])

        text = (
            f"Title: {title}\n"
            f"Description: {description}\n"
            f"Tags: {' '.join(tags)}"
        ).strip()

        if not title and not description and not tags:
            print(f"Skipping video {video['_id']}: no searchable text")
            continue

        embedding = generate_embedding(text)

        result = collection.update_one(
            {"_id": video["_id"]},
            {"$set": {"embedding": embedding}},
        )

        if result.modified_count == 1:
            updated += 1
            print(f"Generated embedding for video {video['_id']}")

    print(f"Finished. Videos updated: {updated}")

finally:
    client.close()

if __name__ == "__main__":
    main()
