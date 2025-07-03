"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft, Monitor, Pause, Play, SkipBack,
  SkipForward, Subtitles, Volume2
} from "lucide-react"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"

export default function StreamingView({
  anime, episode, isPlaying, setIsPlaying, volume, setVolume,
  progress, setProgress, onBack, streamUrl, downloadProgress
}: any) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState<number>(0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {!streamUrl ? (
          <div className="text-white text-center space-y-2">
            <p>Downloading torrent... {downloadProgress}%</p>
            <div className="w-1/2 mx-auto bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${downloadProgress}%` }} />
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={streamUrl}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const current = (e.target as HTMLVideoElement).currentTime
              setProgress([Math.floor(current)])
            }}
            onVolumeChange={(e) => {
              const vol = (e.target as HTMLVideoElement).volume
              setVolume([Math.floor(vol * 100)])
            }}
            onLoadedMetadata={(e) => {
              const dur = (e.target as HTMLVideoElement).duration
              setDuration(Math.floor(dur))
            }}
          />
        )}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div>
                <h3 className="font-semibold">{anime?.title}</h3>
                <p className="text-sm text-gray-400">
                  Episode {episode?.number}: {episode?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Monitor className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Subtitles className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="space-y-4">
            <Slider value={progress} onValueChange={setProgress} max={duration || 100} step={1} className="w-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const vid = videoRef.current
                    if (!vid) return
                    isPlaying ? vid.pause() : vid.play()
                  }}
                  className="bg-[#8c52ff] hover:bg-[#8c52ff]/90"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={(val) => {
                      setVolume(val)
                      if (videoRef.current) {
                        videoRef.current.volume = val[0] / 100
                      }
                    }}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
                <span className="text-sm text-gray-400">
                  {Math.floor(progress[0] / 60)}:{(progress[0] % 60).toString().padStart(2, "0")} /{" "}
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
