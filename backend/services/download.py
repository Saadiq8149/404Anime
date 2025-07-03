# backend/progress_tracker.py
import threading

download_status = {}

async def start_download_task(torrent_url: str, save_path: str, filename: str = None):
    from torrentp import TorrentDownloader
    import os, shutil

    key = hash(torrent_url)
    download_status[key] = {"progress": 0, "status": "downloading"}

    try:
        torrent = TorrentDownloader(torrent_url, save_path=save_path)
        await torrent.start_download()  # ✅ await the coroutine

        while not await torrent.is_finished:
            download_status[key]["progress"] = torrent.progress  # Assuming `.progress` gives percentage
        torrent.wait_for_finish()

        # Rename logic (like before)
        for root, _, files in os.walk(save_path):
            for file in files:
                if file.endswith((".mp4", ".mkv", ".webm")):
                    if filename:
                        ext = os.path.splitext(file)[1]
                        new_name = filename + ext
                        shutil.move(os.path.join(root, file), os.path.join(save_path, new_name))
                        download_status[key] = {"progress": 100, "status": "done", "file": f"/torrents/{new_name}"}
                        return
                    else:
                        download_status[key] = {"progress": 100, "status": "done", "file": f"/torrents/{file}"}
                        return

        download_status[key] = {"status": "error", "detail": "No media file found"}
    except Exception as e:
        download_status[key] = {"status": "error", "detail": str(e)}
