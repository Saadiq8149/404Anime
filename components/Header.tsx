import { ChevronLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Header({ searchQuery, setSearchQuery, onBack }: any) {
  return (
    <header className="relative z-10 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Back button and title section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">
              <span className="text-white">404</span>
              <span className="text-[#8c52ff]">アニメ</span>
            </h1>
          </div>

          {/* Search bar section */}
          <div className="relative flex-1 max-w-sm sm:max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 bg-black/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#8c52ff] rounded-2xl text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
