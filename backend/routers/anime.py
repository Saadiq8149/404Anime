from fastapi import APIRouter
from services.anilist import get_animes_by_search

router = APIRouter(prefix="/anime", tags=["Anime"])

@router.get("/search")
async def search(search_query: str, page: int = 1):
    return get_animes_by_search(search_query, page)