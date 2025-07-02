from fastapi import APIRouter
from services.nyaa import get_torrents_by_search

router = APIRouter(prefix="/torrent", tags=["Anime"])

@router.get("/search")
async def search(title: str, romaji: str, episode: int, season: str = ""):
    return get_torrents_by_search(title, romaji, episode, season)