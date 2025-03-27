if (typeof window !== "undefined") {
  "use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Music, Headphones, Mic, Star, Heart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TetoPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Título dinâmico para a página da Teto
  useEffect(() => {
    const titles = ["KASANE TETO", "かさねテト", "重音テト", "UTAU QUEEN", "0401"]
    let currentIndex = 0

    const changeTitle = () => {
      document.title = titles[currentIndex]
      currentIndex = (currentIndex + 1) % titles.length
    }

    changeTitle()
    const intervalId = setInterval(changeTitle, 2000)

    return () => clearInterval(intervalId)
  }, [])

  const songs = [
    {
      title: "Teto Territory",
      producer: "Kasane Teto",
      year: "2008",
      url: "https://youtu.be/JALbemLw3G4",
    },
    {
      title: "Fukkireta",
      producer: "Kasane Teto",
      year: "2009",
      url: "https://youtu.be/kuNixp-wvWM",
    },
    {
      title: "Triple Baka",
      producer: "LamazeP",
      year: "2009",
      url: "https://youtu.be/Q7o7wz_Q5zY",
    },
    {
      title: "Candy Cookie Chocolate",
      producer: "HALLO CELL",
      year: "2021",
      url: "https://youtu.be/bI3542HJRzY",
    },
    {
      title: "Mesmerizer",
      producer: "サツキ",
      year: "2022",
      url: "https://youtu.be/19y8YTbvri8",
    },
    {
      title: "Tenebre Rosso Sangue",
      producer: "Sandwich",
      year: "2022",
      url: "https://youtu.be/ZZowC8QXshQ",
    },
  ]

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(255, 51, 102, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
        backgroundSize: "200% 200%",
        backgroundPosition: `${(mousePosition.x / window.innerWidth) * 100}% ${(mousePosition.y / window.innerHeight) * 100}%`,
      }}
    >
      {/* Neon grid background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ff3366 1px, transparent 1px), linear-gradient(to bottom, #ff3366 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-pink-500"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header with back button */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-pink-500/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="text-pink-500 hover:text-pink-400 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="text-pink-500 font-bold text-sm">SECRET PAGE: 0401</div>
        </div>
      </header>

      {/* Hero section */}
      <motion.section
        className="relative h-screen flex flex-col items-center justify-center z-10 px-4"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <motion.div
            className="mb-8 relative w-64 h-64 mx-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 rounded-full bg-pink-500 blur-xl opacity-30 animate-pulse" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-pink-500 shadow-[0_0_15px_rgba(255,51,102,0.7)]">
              <Image
                src="/images/teto/teto-profile.png"
                alt="Kasane Teto"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            KASANE TETO
          </motion.h1>

          <motion.p
            className="text-xl text-pink-300 mb-8 max-w-lg mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            UTAU's most iconic voice, bringing your songs to life with her unique chimera energy
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white border border-pink-400 shadow-[0_0_10px_rgba(255,51,102,0.5)]"
              asChild
            >
              <a href="https://kasaneteto.jp/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Meet Kasane!
              </a>
            </Button>
            <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-950" asChild>
              <a href="https://youtu.be/O5MJ8SvUsyk" target="_blank" rel="noopener noreferrer">
                <Mic className="mr-2 h-4 w-4" />
                Try Her Voice
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-pink-500 animate-bounce"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }}
            aria-label="Scroll down"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </Button>
        </motion.div>
      </motion.section>

      {/* Content sections */}
      <div className="relative z-10 bg-black/80 backdrop-blur-md border-t border-pink-500/30">
        <main className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="space-y-24">
            {/* About Teto Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-3xl font-bold text-pink-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                About Kasane Teto
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Kasane Teto is a popular UTAU (singing synthesizer) character created on April 1, 2008. Originally
                    introduced as an April Fool's joke claiming she was a new Vocaloid, Teto quickly gained popularity
                    and became the unofficial mascot of the UTAU community.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Teto is a 31-year-old chimera (part human, part bat) who appears as a 15-year-old girl. Her most
                    distinctive features are her bright pink drill-shaped twin tails and her playful personality.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Her character number "0401" (April 1st) represents her birthday, as she was created on April Fool's
                    Day. This date is significant in her lore as the day she was introduced to the world.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    <strong className="text-pink-400">New in 2023:</strong> Kasane Teto is now available in Synthesizer
                    V Studio! This new voice bank brings Teto's iconic voice to the next generation of vocal synthesis
                    technology, with improved quality and more expressive capabilities.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative h-64 md:h-auto rounded-lg overflow-hidden border border-pink-500/30 shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                >
                  <Image
                    src="/images/teto/teto-full.png"
                    alt="Kasane Teto Full"
                    fill
                    className="object-contain object-center"
                  />
                </motion.div>
              </div>
            </section>

            {/* Synthesizer V Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-3xl font-bold text-pink-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Teto in Synthesizer V
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative h-64 md:h-auto rounded-lg overflow-hidden border border-pink-500/30 shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                >
                  <Image
                    src="/images/teto/teto-synthv.png"
                    alt="Kasane Teto Synthesizer V"
                    fill
                    className="object-contain object-center"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-gray-300 leading-relaxed mb-4">
                    In 2023, Kasane Teto made her debut in Synthesizer V Studio, bringing her iconic voice to a new
                    generation of music producers. This advanced AI voice synthesis technology allows for even more
                    expressive and natural-sounding vocals.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The Synthesizer V version features a redesigned outfit that maintains Teto's classic color scheme
                    and style while giving her a more modern look. The voice bank was developed by TWINDRILL, Teto's
                    official circle.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    With this release, Teto joins the ranks of professional voice synthesis products while maintaining
                    her unique character and charm that fans have loved for over a decade.
                  </p>
                  <div className="mt-6">
                    <Button
                      className="bg-pink-600 hover:bg-pink-700 text-white border border-pink-400 shadow-[0_0_10px_rgba(255,51,102,0.5)]"
                      asChild
                    >
                      <a href="https://www.ah-soft.com/synth-v/kasaneteto/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Learn More About Teto SynthV
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Teto's Music Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-3xl font-bold text-pink-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Teto's Popular Songs
              </motion.h2>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                {songs.map((song, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="overflow-hidden h-full border-pink-500/30 bg-black/50 hover:bg-black/70 transition-colors duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Music className="h-10 w-10 text-pink-500 mr-4" />
                          <div>
                            <h3 className="text-xl font-bold text-white">{song.title}</h3>
                            <p className="text-pink-300 text-sm">{song.producer}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-pink-900 text-pink-200">{song.year}</Badge>
                          <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300" asChild>
                            <a href={song.url} target="_blank" rel="noopener noreferrer">
                              <Headphones className="h-4 w-4 mr-1" />
                              Listen
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Teto Facts Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-3xl font-bold text-pink-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Fun Facts About Teto
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Star className="h-6 w-6" />,
                    title: "Chimera",
                    text: "Teto is a chimera with bat wings and a drill-like tail",
                  },
                  {
                    icon: <Heart className="h-6 w-6" />,
                    title: "Birthday",
                    text: "Her birthday is April 1st, due to her origin as an April Fool's joke",
                  },
                  {
                    icon: <Music className="h-6 w-6" />,
                    title: "Voice",
                    text: "Her voice is based on a human voice sample, modified for UTAU",
                  },
                  {
                    icon: <Headphones className="h-6 w-6" />,
                    title: "Popularity",
                    text: "She's one of the most popular UTAU characters worldwide",
                  },
                  {
                    icon: <Mic className="h-6 w-6" />,
                    title: "Bread Lover",
                    text: "Her favorite food is French bread (baguette)",
                  },
                  {
                    icon: <ExternalLink className="h-6 w-6" />,
                    title: "Evolution",
                    text: "From UTAU to Synthesizer V, Teto continues to evolve with technology",
                  },
                ].map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-pink-500/30 bg-black/50 hover:bg-black/70 transition-colors duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2 rounded-full bg-pink-900/50 text-pink-400">{fact.icon}</div>
                          <h3 className="text-lg font-bold text-white">{fact.title}</h3>
                        </div>
                        <p className="text-gray-300">{fact.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-pink-500/30 py-8 text-center text-gray-400">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Kasane Teto Fan Page. This is a secret page: 0401.</p>
            <p className="text-xs mt-2 text-pink-500/70">
              UTAU and Kasane Teto are property of their respective owners.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
}
