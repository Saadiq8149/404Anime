import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { HardDrive, Play, Users, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export default function TorrentModal({ torrents, onSelect, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Select Torrent</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {torrents.map((torrent: any) => (
            <Card
              key={torrent.id}
              className="bg-gray-800/50 border-gray-700 hover:border-[#8c52ff]/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm truncate">{torrent.title}</p>
                      {torrent.trusted && <Badge className="bg-green-600 text-xs">Trusted</Badge>}
                      <Badge variant="outline" className="text-xs">
                        {torrent.quality}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {torrent.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {torrent.seeders} seeders
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => onSelect(torrent)} className="bg-[#8c52ff] hover:bg-[#8c52ff]/90 ml-4">
                    <Play className="h-4 w-4 mr-2" />
                    Stream
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
