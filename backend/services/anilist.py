from dotenv import load_dotenv
import os, requests

load_dotenv()

ANILIST_SECRET = os.getenv("ANILIST_SECRET")
URL = "https://graphql.anilist.co"

ANILIST_SEARCH_QUERY = """
    query ($search: String!, $page: Int = 1) {
        Page (page: $page) {
            media(search: $search, type: ANIME) {
                id
                title {
                    romaji
                    english
                    native
                }
                episodes
                nextAiringEpisode {
                    episode
                }
                seasonYear
                coverImage {
                    large
                }
                format
                relations {
                    edges {
                        relationType
                        node {
                            id
                            type
                            format
                        }
                    }
                }
            }
        }
    }
"""

ANILIST_ANIME_DETAIL_QUERY = """
    query ($id: Int) {
        Media (id: $id) {
            id
            format
            relations {
                edges {
                    relationType
                    node {
                        id
                        type
                        format
                    }
                }
            }
        }
    }
"""

def get_animes_by_search(search_query: str, page: int = 1):
    try:
        headers = {
            'Content-Type': 'application/json',
			'Accept': 'application/json',
        }
        variables = {
            "search": search_query,
            "page": page
        }
        json = {
            "query": ANILIST_SEARCH_QUERY,
            "variables": variables
        }
        response = requests.post(URL, headers=headers, json=json)
        if response.status_code == 200:
            data = response.json()
            anime_list = data["data"]["Page"]["media"]
            anime_list =  [{
                "id": x["id"],
                "title": (x.get("title") or {}).get("english") or (x.get("title") or {}).get("romaji"),
                "romaji": x.get("title").get("romaji"),
                "native": x.get("title").get("native"),
                "episodes": x.get("episodes") or (x.get("nextAiringEpisode") or {}).get("episode", 2) - 1,
                "year": x.get("seasonYear", "Unknown"),
                "image": (x.get("coverImage") or {}).get("large"),
                "relations": x.get("relations"),
                "season": get_anime_season(x.get("relations").get("edges")) if x.get("format") in ["TV", "TV_SHORT"] else x.get("format"),
                "format": x.get("format")
            } for x in anime_list]

            return [{
                "id": anime["id"],
                "title": anime["title"],
                "episodes": anime["episodes"],
                "season": anime["season"],
                "image": anime["image"],
                "year": anime["year"],
                "romaji": anime["romaji"]
            } for anime in anime_list]
        else:
            print(response.status_code)
    except Exception as e:
        print({"Error Occured": e})
        return []

def get_anime_season(relations, season=1,):
    id = None
    for relation in relations:
        if relation["relationType"] == "PREQUEL" or relation["relationType"] == "PARENT":
            if relation["node"]["format"] in ["TV", "TV_SHORT"]:
                id = relation["node"]["id"]
                season += 1
                break
    if not id:
        return season
    try:
        headers = {
            'Content-Type': 'application/json',
			'Accept': 'application/json',
        }
        variables = {
            "id": id
        }
        json = {
            "query": ANILIST_ANIME_DETAIL_QUERY,
            "variables": variables
        }
        response = requests.post(URL, headers=headers, json=json)
        if response.status_code == 200:
            data = response.json()
            return get_anime_season(data["data"]["Media"]["relations"]["edges"], season)
            
        else:
            print(response.status_code)
    except Exception as e:
        print({"Error Occured": e})
        return 1

