"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

// import HeroSection from "@/components/HeroSection"
import Header from "@/components/Header"
import HomeView from "@/components/HomeView"
import SearchView from "@/components/SearchView"
import EpisodesView from "@/components/EpisodesView"
import TorrentModal from "@/components/TorrentModal"
import StreamingView from "@/components/StreamingView"

// Mock data
const currentlyWatching = [
  {
    id: 1,
    title: "Attack on Titan",
    episode: 4,
    totalEpisodes: 12,
    progress: 33,
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Demon Slayer",
    episode: 8,
    totalEpisodes: 24,
    progress: 67,
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "One Piece",
    episode: 1045,
    totalEpisodes: 1200,
    progress: 87,
    image: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    episode: 15,
    totalEpisodes: 24,
    progress: 62,
    image: "/placeholder.svg?height=200&width=150",
  },
]

const mockSearchResults = [
  { id: 1, title: "Chainsaw Man", episodes: 12, image: "/placeholder.svg?height=300&width=200", year: 2022 },
  { id: 2, title: "Spy x Family", episodes: 25, image: "/placeholder.svg?height=300&width=200", year: 2022 },
  { id: 3, title: "Mob Psycho 100", episodes: 37, image: "/placeholder.svg?height=300&width=200", year: 2016 },
  { id: 4, title: "Your Name", episodes: 1, image: "/placeholder.svg?height=300&width=200", year: 2016 },
  { id: 5, title: "Spirited Away", episodes: 1, image: "/placeholder.svg?height=300&width=200", year: 2001 },
  { id: 6, title: "Princess Mononoke", episodes: 1, image: "/placeholder.svg?height=300&width=200", year: 1997 },
]

var mockEpisodes = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  title: `Episode ${i + 1}`,
}))

const mockTorrents = [
  {
    id: 1,
    filename: "[SubsPlease] Chainsaw Man - 01 [1080p].mkv",
    size: "1.2 GB",
    seeders: 245,
    quality: "1080p",
    trusted: true,
  },
  {
    id: 2,
    filename: "[Erai-raws] Chainsaw Man - 01 [720p].mkv",
    size: "720 MB",
    seeders: 156,
    quality: "720p",
    trusted: true,
  },
  {
    id: 3,
    filename: "Chainsaw Man S01E01 1080p WEB-DL.mkv",
    size: "2.1 GB",
    seeders: 89,
    quality: "1080p",
    trusted: false,
  },
  {
    id: 4,
    filename: "[HorribleSubs] Chainsaw Man - 01 [480p].mkv",
    size: "350 MB",
    seeders: 67,
    quality: "480p",
    trusted: false,
  },
]

const currentlyAiring = [
  {
    id: 1,
    title: "Blue Lock Season 2",
    episodes: 14,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Episode 8 in 2 days",
  },
  {
    id: 2,
    title: "Dandadan",
    episodes: 12,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Episode 9 in 4 days",
  },
  {
    id: 3,
    title: "Re:Zero Season 3",
    episodes: 16,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Episode 6 in 1 day",
  },
  {
    id: 4,
    title: "Dragon Ball Daima",
    episodes: 20,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Episode 7 in 3 days",
  },
  {
    id: 5,
    title: "Bleach: Thousand Year Blood War",
    episodes: 13,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Episode 10 in 5 days",
  },
  {
    id: 6,
    title: "Overlord Movie",
    episodes: 1,
    image: "/placeholder.svg?height=300&width=200",
    year: 2024,
    status: "Airing",
    nextEpisode: "Available now",
  },
]

const BASE_BACKEND_URL = "https://fictional-space-couscous-xg4p7w4w4qjcpx5v-8000.app.github.dev/"

type AppState = "home" | "search" | "episodes" | "streaming"

export default function AnimeStreamingApp() {
  const [appState, setAppState] = useState<AppState>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAnime, setSelectedAnime] = useState<any>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null)
  const [showTorrentModal, setShowTorrentModal] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([80])
  const [progress, setProgress] = useState([0])
  const [searchResults, setSearchResults] = useState<{ id: number; title: string; episodes: number; year: string; image: string; season: string}[]>([])
  const [episodes, setEpisodes] = useState<{ id: number; number: number; title: string }[]>([])
  const [torrents, setTorrents] = useState<{ id: number; filename: string; size: string; quality: string; trusted: string; magnet: string}[]>([])
  const [streamUrl, setStreamUrl] = useState<string>("")
  const [downloadProgress, setDownloadProgress] = useState(0)

  useEffect(() => {
    if (searchQuery.length > 0) {
      setAppState("search")
    } else if (appState === "search") {
      setAppState("home")
    }
  }, [searchQuery])

  const handleAnimeSelect = (anime: any) => {
    setSelectedAnime(anime)
    const episodesArray = Array.from({ length: anime.episodes }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      title: `Episode ${i + 1}`,
    }))
    setEpisodes(episodesArray)
    setAppState("episodes")

  }

  const handleEpisodeSelect = (episode: any, isAuto: boolean) => {
    setSelectedEpisode(episode)
    fetchTorrentResults(episode, isAuto)
    if (isAuto) {
      // Auto stream - simulate finding best torrent
      setAppState("streaming")
      setIsPlaying(true)
    } else {
      setShowTorrentModal(true)
    }
  }

  const handleTorrentSelect = async (torrent: any) => {
    const filename = `${selectedAnime.id}-${selectedEpisode.number}`
    const url = BASE_BACKEND_URL + "stream/torrent?url=" + encodeURIComponent(torrent.magnet) + `&filename=${filename}`

    const res = await axios.get(url)
    const key = res.data.key

    setAppState("streaming")

    // Poll for progress
    const interval = setInterval(async () => {
      const progRes = await axios.get(BASE_BACKEND_URL + "stream/progress", {
        params: { key }
      })

      const status = progRes.data

      if (status.status === "done") {
        clearInterval(interval)
        setStreamUrl(BASE_BACKEND_URL + status.file)
        setIsPlaying(true)
      } else if (status.status === "downloading") {
        setDownloadProgress(Math.floor(status.progress || 0))
      } else if (status.status === "error") {
        clearInterval(interval)
        alert("Download failed: " + status.detail)
        setAppState("home")
      }
    }, 1000)
  }


  const handleBackToHome = () => {
    setAppState("home")
    setSearchQuery("")
    setSelectedAnime(null)
    setSelectedEpisode(null)
  }

  const handleBackToEpisodes = () => {
    setAppState("episodes")
  }

  const fetchTorrentResults = (episode: { id: number; number: number; title: string}, isAuto: boolean) => {
    const url = BASE_BACKEND_URL + "torrent/search"
    axios.get(url, {
      params: {
        title: selectedAnime.title,
        romaji: selectedAnime.romaji,
        episode: episode["number"],
        season: selectedAnime.season
      }
    }).then(response => {
      if (isAuto) {
        handleTorrentSelect(response.data[0])
      } else {
        setTorrents(response.data)
      }
    })
  }
  
  const fetchSearchResults = () => {
    const url = BASE_BACKEND_URL + "anime/search"
    axios.get(url, {
      params: {
        search_query: searchQuery,
        page: 1
      }
    }).then(response => {
      setSearchResults(response.data)
    })
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8c52ff]/20 via-transparent to-[#8c52ff]/20" />
        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.08'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {appState === "streaming" ? (
        <StreamingView
          anime={selectedAnime}
          episode={selectedEpisode}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
          progress={progress}
          setProgress={setProgress}
          onBack={() => {
            setAppState("home")
            setStreamUrl("")
          }}
          streamUrl={streamUrl}
          downloadProgress={downloadProgress}
        />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Header Section */}
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onBack={appState !== "home" ? handleBackToHome : undefined}
            />

            {/* Hero Section */}
            {/* {appState === "home" && <HeroSection />} */}

            {/* Main Content Section */}
            <MainContent
              appState={appState}
              searchQuery={searchQuery}
              currentlyWatching={currentlyWatching}
              currentlyAiring={currentlyAiring}
              searchResults={searchResults}
              selectedAnime={selectedAnime}
              episodes={episodes}
              onAnimeSelect={handleAnimeSelect}
              onEpisodeSelect={handleEpisodeSelect}
              fetchSearchResults={fetchSearchResults}
            />

            {/* Torrent Modal */}
            <AnimatePresence>
              {showTorrentModal && (
                <TorrentModal
                  torrents={torrents}
                  onSelect={handleTorrentSelect}
                  onClose={() => setShowTorrentModal(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MainContent({
  appState,
  searchQuery,
  currentlyWatching,
  currentlyAiring,
  searchResults,
  selectedAnime,
  episodes,
  onAnimeSelect,
  onEpisodeSelect,
  fetchSearchResults
}: any) {
  return (
    <main className="relative z-10 bg-[#0f0f0f] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {appState === "home" && (
            <HomeView
              key="home"
              currentlyWatching={currentlyWatching}
              currentlyAiring={currentlyAiring}
              onAnimeSelect={onAnimeSelect}
            />
          )}

          {appState === "search" && (
            <SearchView key="search" results={searchResults} query={searchQuery} onAnimeSelect={onAnimeSelect} searchAnime={fetchSearchResults}/>
          )}

          {appState === "episodes" && selectedAnime && (
            <EpisodesView key="episodes" anime={selectedAnime} episodes={episodes} onEpisodeSelect={onEpisodeSelect} />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
