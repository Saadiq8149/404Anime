import requests, re
import xml.etree.ElementTree as ET
from rapidfuzz import fuzz

def get_torrents_by_search(title: str, romaji: str, episode: int, season: str = ""):
    
    TRUSTED_GROUPS = ["subsplease", "erai-raws", "judas", "horriblesubs", "ember"]

    def extract_base_title(torrent_name: str) -> str:
        # Remove [Group]
        name = re.sub(r"^\[[^\]]+\]\s*", "", torrent_name)
        
        # Remove episode or batch indicators like "- 01" or "- 01 ~ 12"
        name = re.sub(r"-\s*\d+(\s*~\s*\d+)?", "", name)

        # Remove all metadata in brackets or parentheses: [ ... ] or ( ... )
        name = re.sub(r"[\[\(].*?[\]\)]", "", name)

        # Remove season indicators like "S2" or "Season 2"
        name = re.sub(r"(S\d+|Season\s*\d+)", "", name, flags=re.IGNORECASE)

        return name.strip()

    def parse_size(size_str: str) -> float:
        num, unit = size_str.split()
        num = float(num)
        if unit.lower().startswith("gi"):
            return num * 1024
        elif unit.lower().startswith("mi"):
            return num
        elif unit.lower().startswith("ki"):
            return num / 1024
        return 0

    def detect_season_from_title(title: str) -> int | None:
        match = re.search(r"(?:s|season)[\s\-]?(\d+)", title.lower())
        if match:
            return int(match.group(1))
        for i in range(2, 8):
            if f"s{i}" in title.lower(): return i
        return None

    def is_batch_by_size(size_mb: float) -> bool:
        return size_mb > 2000  # >2 GiB is likely a batch

    def get_resolution_score(title: str) -> int:
        title = title.lower()
        if "1080p" in title:
            return 3
        elif "720p" in title:
            return 2
        elif "480p" in title:
            return 1
        elif "360p" in title:
            return 0.5
        return 2

    torrents = []

    title = re.sub(r"[^a-zA-Z0-9]", " ", title)
    romaji = re.sub(r"[^a-zA-Z0-9]", " ", romaji)

    title = "+".join([x.lower().strip() for x in title.split()])
    romaji = "+".join([x.lower().strip() for x in romaji.split()])

    def rank_torrent(
        torrent_name: str,
        seeders: int,
        romaji: str,
        episode: int,
        season: str,
        title: str,
        size: str
    ) -> float:
        score = 0
        if parse_size(size) < 1:  # less than 1 MiB (likely .ass/.srt)
            return -999
        cleaned_title = extract_base_title(torrent_name).lower()
        romaji = romaji.lower()
        title = title.lower()
        size_mb = parse_size(size)

        # Season logic
        if season.isdigit():
            user_season = int(season)
            detected_season = detect_season_from_title(torrent_name)
            if detected_season and detected_season != user_season:
                return -999

        # Penalize batch-sized torrents
        if season != "MOVIE":
            if is_batch_by_size(size_mb):
                score -= 3
            else:
                score += 2  # boost for likely single ep

        # Resolution score
        score += get_resolution_score(torrent_name)

        # 🔍 Title similarity
        score += fuzz.token_sort_ratio(cleaned_title, romaji) / 10
        score += 0.8 * (fuzz.token_sort_ratio(cleaned_title, title) / 10)

        # Exact match
        if cleaned_title == romaji:
            score += 2
        if cleaned_title == title:
            score += 2

        # Episode check
        if not is_batch_by_size(size_mb) and season != "MOVIE":
            if re.search(rf"\b0?{episode}\b", torrent_name):
                score += 4
            else:
                score -= 3  # ❌ Wrong episode

        # Trusted group
        if any(group in torrent_name.lower() for group in TRUSTED_GROUPS):
            score += 2

        # Seeder bonus
        score += min(seeders / 50, 4)

        return round(score, 2)


    if season.isdigit():
        query = f"{title}+S{season}+{str(episode).zfill(2)}"

        get_torrents_for_query(query, torrents)

        if len(torrents) == 0:       
            query = f"{romaji}+S{season}+{str(episode).zfill(2)}"

            get_torrents_for_query(query, torrents)
            if season == "1":
                query = f"{romaji}+{str(episode).zfill(2)}"
                get_torrents_for_query(query, torrents)

        if len(torrents) == 0:
            title_array = title.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+S{season}+{str(episode).zfill(2)}" 
                if season == "1":
                    query = f"{t}+{str(episode).zfill(2)}"
                    if get_torrents_for_query(query, torrents):
                        break
                if get_torrents_for_query(query, torrents):       
                    break

            title_array = romaji.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+S{season}+{str(episode).zfill(2)}"
                if season == "1":
                    query = f"{t}+{str(episode).zfill(2)}"
                    if get_torrents_for_query(query, torrents):
                        break
                if get_torrents_for_query(query, torrents):          
                    break       

        if len(torrents) == 0:
            title_array = title.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+{str(episode).zfill(2)}" 
                if get_torrents_for_query(query, torrents):       
                    break

            title_array = romaji.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+{str(episode).zfill(2)}" 
                if get_torrents_for_query(query, torrents):          
                    break 
    elif season == "MOVIE":
        get_torrents_for_query(title, torrents)
        get_torrents_for_query(romaji, torrents)   
    else:
        query = f"{title}+{str(episode).zfill(2)}"

        get_torrents_for_query(query, torrents)
        if len(torrents) == 0:       
            query = f"{romaji}+{str(episode).zfill(2)}"
            get_torrents_for_query(query, torrents)

        if len(torrents) == 0:
            title_array = title.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+{str(episode).zfill(2)}" 
                if get_torrents_for_query(query, torrents):       
                    break

            title_array = romaji.split("+")
            for i in range(len(title_array)):
                t = "+".join(title_array[:len(title_array)-i])
                query = f"{t}+{str(episode).zfill(2)}" 
                if get_torrents_for_query(query, torrents):          
                    break        
                    
    # print(f"Torrents Found: {len(torrents)}")
    torrents = sorted(torrents, key=lambda t: rank_torrent(t["title"], t["seeders"], romaji, episode, season, title, t["size"]), reverse=True)

    for index, torrent in enumerate(torrents):
        title = torrent["title"].lower()
        if "1080p" in title:
            torrent["quality"] = "1080p"
        elif "720p" in title:
            torrent["quality"] = "720p"
        elif "480p" in title:
            torrent["quality"] = "480p"
        elif "360p" in title:
            torrent["quality"] = "360p"
        else:
            torrent["quality"] = "Unknown"
        torrent["trusted"] = True 
        torrent["id"] = index
        # trackers = "&tr=" + "&tr=".join([
        #     "udp://tracker.opentrackr.org:1337/announce",
        #     "udp://tracker.openbittorrent.com:6969/announce",
        #     "udp://tracker.openbittorrent.com:80/announce",
        #     "udp://tracker.leechers-paradise.org:6969/announce",
        #     "udp://9.rarbg.to:2710/announce",
        #     "udp://tracker.internetwarriors.net:1337/announce",
        #     "udp://exodus.desync.com:6969/announce",
        #     "udp://tracker.torrent.eu.org:451/announce"
        # ])

        # torrent["magnet"] = f"magnet:?xt=urn:btih:{torrent['info_hash']}&dn={torrent['title']}{trackers}"

        # print(f"✅ {torrent["title"]}\n🔗 {torrent["magnet"]}\n Seeders: {torrent["seeders"]}\n Size: {torrent["size"]}\n")

    return torrents

def get_torrents_for_query(query: str, torrents):
    torrent_found = False

    # print(f"Searching: {query}\n")

    url = f"https://nyaa.si/?page=rss&q={query}&c=1_0&f=2"
    response = requests.get(url)

    if response.status_code == 200:
        root = ET.fromstring(response.text)
        items = root.findall(".//item")
        ns = {"nyaa": "https://nyaa.si/xmlns/nyaa"}
        if len(items) > 0:
            torrent_found = True
        for item in items:
            title = item.find("title").text
            magnet = item.find("link").text
            seeders = int(item.find("nyaa:seeders", ns).text)
            size = item.find("nyaa:size", ns).text
            info_hash = item.find("nyaa:infoHash", ns).text
            torrents.append({"title": title, "magnet": magnet, "seeders": seeders, "size": size, "info_hash": info_hash})
            # print(f"✅ {title}\n🔗 {magnet}\n Seeders: {seeders}\n Size: {size}\n")
    else:
        print("Error Occurred")
        print(response.text)

    return torrent_found

# print(get_torrents_by_search(title="Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen OVA", romaji="Kaguya-sama wa Kokurasetai: Tensaitachi no Renai Zunousen OVA", episode=1, season="OVA"))



