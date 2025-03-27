"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Favorite {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  url?: string
}

const favorites: Favorite[] = [
  {
    id: 1,
    title: "Re:ZERO",
    description:
      "Transported to a fantasy world, Subaru discovers that every time he dies, he returns to the past, forcing him to unravel mysteries and face endless challenges.",
    image: "/images/anime/rezero.jpg",
    tags: ["Action", "Fantasy", "Drama"],
    url: "https://anilist.co/anime/21355/ReZERO-Starting-Life-in-Another-World/",
  },
  {
    id: 2,
    title: "Konosuba!",
    description:
      "After dying, Kazuma is reborn in a fantasy world with a quirky team of companions, leading to chaotic and hilarious adventures.",
    image: "/images/anime/konosuba.png",
    tags: ["Adventure", "Comedy", "Fantasy"],
    url: "https://anilist.co/anime/21202/KONOSUBA-Gods-blessing-on-this-wonderful-world/",
  },
  {
    id: 3,
    title: "Nichijou",
    description:
      "In Nichijou, everyday life is anything but ordinary, as it follows the absurd and hilarious adventures of three high school girls and their eccentric encounters.",
    image: "/images/anime/nichijou.png",
    tags: ["Comedy", "School Comedy", "Slice of Life"],
    url: "https://anilist.co/anime/10165/Nichijou--My-Ordinary-Life/",
  },
]

export function ProjectsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="space-y-8">
      <motion.h2
        className="text-2xl font-semibold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Favorite Anime
      </motion.h2>

      <motion.div
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {favorites.map((favorite) => (
          <motion.div
            key={favorite.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(favorite.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="h-full"
          >
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-gray-700 border-gray-800 bg-black/30">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={favorite.image || "/placeholder.svg"}
                  alt={favorite.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out"
                  style={{
                    transform: hoveredId === favorite.id ? "scale(1.05)" : "scale(1)",
                  }}
                />
              </div>
              <CardContent className="flex-grow p-5">
                <h3 className="text-xl font-medium mb-2">{favorite.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{favorite.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {favorite.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-normal bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {favorite.url && (
                <CardFooter className="p-5 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-gray-700 hover:bg-gray-800 w-full sm:w-auto"
                    asChild
                  >
                    <a href={favorite.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View on AniList
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

