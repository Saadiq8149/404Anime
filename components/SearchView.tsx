import { motion } from "framer-motion"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

export default function SearchView({
  results,
  query,
  onAnimeSelect,
  searchAnime, // ✅ New prop
}: {
  results: any[]
  query: string
  onAnimeSelect: (anime: any) => void
  searchAnime: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Search results for "{query}"</h3>
        <Button
          onClick={searchAnime}
          className="bg-[#8c52ff] hover:bg-[#8c52ff]/90 text-white"
        >
          Search
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {results.map((anime: any, index: number) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnimeSelect(anime)}
            className="cursor-pointer"
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-[#8c52ff]/50 transition-colors backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="relative mb-3">
                  <Image
                    src={anime.image || "/placeholder.svg"}
                    alt={anime.title}
                    width={225}
                    height={300}
                    className="w-full h-[300px] object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-[#8c52ff] text-xs">
                    {anime.episodes} EP
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-1 line-clamp-2">{anime.title}</h4>
                <p className="text-xs text-gray-400">
                  {typeof anime.season === "number"
                    ? `Season: ${anime.season}`
                    : anime.season}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
