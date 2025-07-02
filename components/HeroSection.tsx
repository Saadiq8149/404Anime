import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative w-full py-8 bg-[#0f0f0f]">
      {/* Hero Background Image */}
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] relative">
          <Image
            src="/anime-banner.png"
            alt="404Anime Hero Banner"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain rounded-2xl shadow-xl"
            priority
          />
        </div>
        {/* Bottom gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
      </div>
    </section>
  )
}