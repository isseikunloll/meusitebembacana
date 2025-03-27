"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Film, Headphones, BookOpen, Tv, Camera, Palette, Globe } from "lucide-react"

interface Interest {
  name: string
  icon: React.ReactNode
  items: string[]
}

const interests: Interest[] = [
  {
    name: "Anime",
    icon: <Tv className="h-5 w-5" />,
    items: ["Seinen", "Shounen", "Isekai", "Slice of Life", "Fantasy"],
  },
  {
    name: "Manga",
    icon: <BookOpen className="h-5 w-5" />,
    items: ["Action", "Adventure", "Comedy", "Drama", "Horror"],
  },
  {
    name: "Games",
    icon: <Gamepad2 className="h-5 w-5" />,
    items: ["RPG", "JRPG", "Visual Novels", "Sandbox", "Adventure"],
  },
  {
    name: "Movies",
    icon: <Film className="h-5 w-5" />,
    items: ["Anime Films", "Sci-Fi", "Fantasy", "Thriller", "Animation"],
  },
  {
    name: "Music",
    icon: <Headphones className="h-5 w-5" />,
    items: ["J-Pop", "Anime OSTs", "Game OSTs", "VOCALOID", "Classical"],
  },
  {
    name: "Art (Still Learning)",
    icon: <Palette className="h-5 w-5" />,
    items: ["Digital Art", "Anime Art", "Character Design", "Concept Art", "Fan Art"],
  },
  {
    name: "Photography",
    icon: <Camera className="h-5 w-5" />,
    items: ["I want to start, but the equipment is so expensive.... hope one day start as a hobby!!"],
  },
  {
    name: "Languages",
    icon: <Globe className="h-5 w-5" />,
    items: ["Portuguese-BR", "English", "Learning Spanish"],
  },
]

export function SkillsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
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
        Interests & Hobbies
      </motion.h2>

      <motion.div
        className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {interests.map((interest, index) => (
          <motion.div key={interest.name} variants={itemVariants}>
            <Card className="h-full hover:bg-black/20 transition-all duration-300 overflow-hidden group border-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-gray-800 text-gray-300 group-hover:bg-gray-700 transition-colors duration-300">
                    {interest.icon}
                  </div>
                  <h3 className="font-medium">{interest.name}</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {interest.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

