"use client"

import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

export default function EpisodesView({ anime, episodes, onEpisodeSelect }: any) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [focusedEpisode, setFocusedEpisode] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(30); // show 30 episodes initially

  // Reset when anime changes
  useEffect(() => {
    setSelectedNumber(null);
    setFocusedEpisode(null);
  }, [anime]);

  const handleGetEpisode = () => {
    const ep = episodes.find((e: any) => e.number === selectedNumber);
    setFocusedEpisode(ep ?? null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Anime Info */}
      <div className="flex items-start gap-6 flex-wrap">
        <Image
          src={anime.image || "/placeholder.svg"}
          alt={anime.title}
          width={200}
          height={300}
          className="w-32 h-48 object-cover rounded-xl"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2">{anime.title}</h2>
          <p className="text-gray-400 mb-2">
            {anime.episodes} Episodes •{" "}
            {typeof anime.season === "number"
              ? `Season: ${anime.season}`
              : anime.season}
          </p>
        </div>
      </div>

      {/* Episode Picker */}
      <div className="space-y-2">
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="number"
              min={1}
              max={anime.episodes}
              value={selectedNumber ?? ""}
              onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
              placeholder={`1 to ${anime.episodes}`}
              style={{ backgroundColor: "#1f2937", color: "white" }} // force bg-gray-800 and white text
              className="placeholder-gray-400 border border-gray-700 rounded px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#8c52ff]/50"
            />
            <Button
              onClick={handleGetEpisode}
              className="bg-[#8c52ff] hover:bg-[#8c52ff]/90 text-white"
            >
              Get Episode
            </Button>
          </div>

          {focusedEpisode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="pt-2"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-[#8c52ff]/50 transition-colors backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">
                        Episode {focusedEpisode.number}
                      </h4>
                      <p className="text-sm text-gray-400">{focusedEpisode.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEpisodeSelect(focusedEpisode, true)}
                        className="bg-[#8c52ff] hover:bg-[#8c52ff]/90"
                      >
                        Auto Stream
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onEpisodeSelect(focusedEpisode, false)}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        Manual Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>


      {/* Episode List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Episodes</h3>
        <div className="grid gap-3">
          {episodes.slice(0, visibleCount).map((episode: any, index: number) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-[#8c52ff]/50 transition-colors backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Episode {episode.number}</h4>
                      <p className="text-sm text-gray-400">{episode.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEpisodeSelect(episode, true)}
                        className="bg-[#8c52ff] hover:bg-[#8c52ff]/90"
                      >
                        Auto Stream
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onEpisodeSelect(episode, false)}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        Manual Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {visibleCount < episodes.length && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 30)}
              className="bg-[#8c52ff] hover:bg-[#8c52ff]/90 text-white"
            >
              Load More Episodes
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
