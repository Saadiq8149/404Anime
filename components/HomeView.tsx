import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Image from "next/image"
import { Badge } from "./ui/badge";

export default function HomeView({ currentlyWatching, currentlyAiring, onAnimeSelect }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Continue Watching Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 text-[#8c52ff]" />
          Continue Watching
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {currentlyWatching.map((anime: any) => (
            <motion.div
              key={anime.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Card className="w-48 bg-gray-900/50 border-gray-800 hover:border-[#8c52ff]/50 transition-colors cursor-pointer backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="relative mb-3">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      width={150}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 bg-[#8c52ff] hover:bg-[#8c52ff]/90 rounded-full p-2"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{anime.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Episode {anime.episode} of {anime.totalEpisodes}
                  </p>
                  <Progress value={anime.progress} className="h-1" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Currently Airing Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <div className="h-5 w-5 bg-red-500 rounded-full animate-pulse"></div>
          Currently Airing
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {currentlyAiring.map((anime: any) => (
            <motion.div
              key={anime.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Card className="w-48 bg-gray-900/50 border-gray-800 hover:border-[#8c52ff]/50 transition-colors cursor-pointer backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="relative mb-3">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      width={150}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 bg-[#8c52ff] hover:bg-[#8c52ff]/90 rounded-full p-2"
                      onClick={() => onAnimeSelect(anime)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{anime.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{anime.nextEpisode}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-600 text-xs">{anime.status}</Badge>
                    <span className="text-xs text-gray-400">{anime.year}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}