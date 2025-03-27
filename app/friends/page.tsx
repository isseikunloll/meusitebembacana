"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FriendCard } from "@/components/friend-card"
import { FriendsTitle } from "@/components/friends-title"
import { InteractiveBackground } from "@/components/interactive-background"

// Atualizar os dados dos amigos para usar os novos tipos de botões sociais
const friendsData = [
  {
    name: "MaiMai",
    image: "/images/friends/maimai.png",
    description: "maimai!!!! my BEST friend ever!111 love you!!",
    discordUrl: "https://discord.com/users/927370335144263690",
    socialType: "twitter" as const,
    socialUrl: "https://twitter.com/mai_maikk",
  },
  {
    name: "SnoowAce",
    image: "/images/friends/gabriel.png",
    description: "Cool friend tryharder in everything!! bro is the best in all games!!11",
    discordUrl: "https://discord.com/users/406908280863195140",
    socialType: "globe" as const,
    socialUrl: "https://twitter.com/SnoowAce",
  },
  {
    name: "cocoABIN",
    image: "/images/friends/diego.png",
    description: "The cool one!!! really good with conversations and is very kind!! get in touch!1",
    discordUrl: "https://discord.com/users/896851280947970120",
    socialType: "roblox" as const,
    socialUrl: "https://roblox.com/users/441218056/profile",
  },
  {
    name: "Overchade",
    image: "/images/friends/rui.png",
    description: "Always There to play cool games!!! funny as hell tho!!",
    discordUrl: "https://discord.com/users/792191282562334740",
    socialType: "instagram" as const,
    socialUrl: "https://instagram.com/ruimnel/",
  },
  {
    name: "Fabrizio",
    image: "/images/friends/fabrizio.jpeg",
    description: "the bro with the godly aim :skull:",
    discordUrl: "https://discord.com/users/884574785890291722",
    socialType: "roblox" as const,
    socialUrl: "https://roblox.com/users/231097432/profile",
  },
  {
    name: "Felpee (Felpudo)",
    image: "/images/friends/felpee.jpg",
    description: "The fluffy one!! he does cool arts, pls check it out!!",
    discordUrl: "https://discord.com/users/419971131517435914",
    socialType: "none" as const,
  },
  {
    name: "Laly",
    image: "/images/friends/laly.jpg",
    description: "Cutie girl who wants to be a gothic (one day...)",
    discordUrl: "https://discord.com/users/741814026841096255",
    socialType: "none" as const,
  },
  {
    name: "_kkjkj (bernadao)",
    image: "/images/friends/bernardo.jpg",
    description: "the HEAD of deepwoken, bro is good in everything about this game, and it is a FIRE person!!1",
    discordUrl: "https://discord.com/users/656671619548315679",
    socialType: "instagram" as const,
    socialUrl: "https://instagram.com/bernardo.lacerd/",
  },
  {
    name: "F1Enjoyer",
    image: "/images/friends/enzo.jpeg",
    description: "The sigma!!!! all hails F1! all hails F1!!!!",
    discordUrl: "https://discord.com/users/759848597738618941",
    socialType: "roblox" as const,
    socialUrl: "https://roblox.com/users/2067676731/profile",
  },
  {
    name: "GrasyBk",
    image: "/images/friends/grasy.jpg",
    description: "FIRE girl who just paly valorant (grr) but is kinda funny!!!",
    discordUrl: "https://discord.com/users/693653929518694420",
    socialType: "instagram" as const,
    socialUrl: "https://instagram.com/grasy.lol/",
  },
  {
    name: "TankEnjoyer",
    image: "/images/friends/tiago.jpg",
    description: "SOLEEI! jokes apart, bro is fire, knows alot about tanks and stuff, bro prob have hyperfocus.",
    discordUrl: "https://discord.com/users/315500594431524864",
    socialType: "roblox" as const,
    socialUrl: "https://roblox.com/users/1146410088/profile",
  },
  {
    name: "TomTheBig",
    image: "/images/friends/tonio.webp",
    description: "Tonhão!! it's always fun to play with him when we can",
    discordUrl: "https://discord.com/users/1077325951953809448",
    socialType: "twitter" as const,
    socialUrl: "https://twitter.com/",
  },
]

export default function FriendsPage() {
  // Efeito para rolar para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <FriendsTitle />
      <InteractiveBackground />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            My Friends
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            These are the amazing people I'm lucky to call my friends. They make my life better every day!
          </motion.p>

          {/* Atualizar o mapeamento dos cards para usar as novas propriedades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friendsData.map((friend, index) => (
              <FriendCard
                key={index}
                name={friend.name}
                image={friend.image}
                description={friend.description}
                discordUrl={friend.discordUrl}
                socialType={friend.socialType}
                socialUrl={friend.socialUrl}
                socialLabel={friend.socialType === "roblox" ? "Roblox" : undefined}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 text-center text-muted-foreground mt-16">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Issei Vollereil. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

