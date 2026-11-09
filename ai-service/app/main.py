from fastapi import FastAPI
from app.route.search import router as search_router

app = FastAPI(
    title="YouTube Clone AI Service",
    description="AI-powered semantic video search",
    version="1.0.0"
)

app.include_router(search_router)


@app.get("/health")
def health_check():
    return {
        "success": True,
        "service": "AI Service",
        "status": "running"
    }