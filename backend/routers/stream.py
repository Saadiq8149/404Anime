from fastapi import APIRouter, Query
from services.download import start_download_task, download_status
import threading, asyncio

router = APIRouter()

@router.get("/stream/torrent")
async def stream_torrent(url: str = Query(...), filename: str = Query(None)):
    save_path = "/workspaces/404Anime/public/torrents"
    thread = threading.Thread(target=run_download_task, args=(url, save_path, filename))
    thread.start()
    return {"key": hash(url)}

@router.get("/stream/progress")
async def get_progress(key: int = Query(...)):
    return download_status.get(key, {"status": "not found"})

def run_download_task(torrent_url: str, save_path: str, filename: str = None):
    asyncio.run(start_download_task(torrent_url, save_path, filename))
