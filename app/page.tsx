"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { AniListProfile } from "@/components/anilist-profile"
import { AniListProfileCard } from "@/components/anilist-profile-card"
import { AnimeStats } from "@/components/anime-stats"
import { DiscordStatus } from "@/components/discord-status"
import { InteractiveBackground } from "@/components/interactive-background"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  // Função para garantir que o scroll funcione em dispositivos móveis
  useEffect(() => {
    // Verificar se estamos em um dispositivo móvel
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // Garantir que o scroll funcione corretamente em dispositivos móveis
      const handleTouchStart = () => {
        // Apenas para garantir que o evento de toque seja registrado
      }

      document.addEventListener("touchstart", handleTouchStart, { passive: true })

      return () => {
        document.removeEventListener("touchstart", handleTouchStart)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <InteractiveBackground />

      {/* Hero Section */}
      <motion.div
        ref={targetRef}
        className="relative z-10 h-screen flex flex-col items-center justify-center"
        style={{ opacity, scale, y }}
      >
        <motion.div
          className="text-center space-y-6 max-w-3xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-gray-700 p-1 mx-auto">
              <div className="w-full h-full relative">
                <Image
                  src="/profile.jpeg"
                  alt="Profile"
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="rounded-full object-cover object-center"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tighter mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Issei Vollereil
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Enthusiast of Something!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <SocialLinks />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full animate-bounce"
              onClick={scrollToContent}
              aria-label="Scroll down"
            >
              <ChevronDown className="h-6 w-6" />
              <span className="sr-only">Scroll down</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content Sections */}
      <div className="relative z-10 bg-black/90">
        <main className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="space-y-24">
            {/* About Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                About Me
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome to my personal space on the web! I'm a idiot adolescent who likes a lot games and animes! this
                site is just a diversion I decided to make because I have nothing to do!!! When I'm not playing, I enjoy
                reading manga, watching sum animes, and discovering new musics!!!! Feel free to explore my collection
                and reach out if you want to discuss anime or share recommendations!!! YAYAYAY!!
              </motion.p>
            </section>

            {/* Discord Status Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                My Discord
              </motion.h2>
              <DiscordStatus />
            </section>

            {/* Interests Section */}
            <SkillsSection />

            {/* Favorite Anime Section */}
            <ProjectsSection />

            {/* AniList Profile Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                My AniList Profile!!!
              </motion.h2>
              <AniListProfileCard username="isseivollereil" />
            </section>

            {/* Anime Stats Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                My Anime Stats 👀
              </motion.h2>
              <AnimeStats username="isseivollereil" />
            </section>

            {/* Anime List Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                My Anime List!!!!
              </motion.h2>
              <AniListProfile username="isseivollereil" />
            </section>

            {/* Contact Section */}
            <section className="space-y-8">
              <motion.h2
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Get In Touch!
              </motion.h2>
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-muted-foreground mb-6">
                  want to get in touch to talk about an infinite variety of things??????? get in touch!
                </p>
                <Button size="lg" asChild className="bg-gray-800 hover:bg-gray-700 text-white">
                  <a href="mailto:example@example.com">Contact Me!</a>
                </Button>
              </motion.div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 text-center text-muted-foreground">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Issei Vollereil. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

