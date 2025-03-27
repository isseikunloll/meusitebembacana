"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Twitter, MessageSquare, Globe, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FriendProps {
  name: string
  image: string
  description: string
  discordUrl?: string
  socialType?: "twitter" | "instagram" | "roblox" | "globe" | "none"
  socialUrl?: string
  socialLabel?: string
}

export function FriendCard({
  name,
  image,
  description,
  discordUrl = "#",
  socialType = "twitter",
  socialUrl = "#",
  socialLabel = "",
}: FriendProps) {
  const renderSocialIcon = () => {
    switch (socialType) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "globe":
        return <Globe className="h-4 w-4" />
      case "roblox":
        // Usamos o Globe como ícone para Roblox
        return <Globe className="h-4 w-4" />
      default:
        return <Twitter className="h-4 w-4" />
    }
  }

  const getSocialLabel = () => {
    if (socialLabel) return socialLabel

    switch (socialType) {
      case "twitter":
        return "Twitter"
      case "instagram":
        return "Instagram"
      case "globe":
        return "Website"
      case "roblox":
        return "Roblox"
      default:
        return "Social"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-gray-800 bg-black/30 hover:border-gray-700 transition-colors duration-300 flex flex-col">
        <div className="relative aspect-square w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground flex-grow">{description}</p>

          <div className={`flex gap-2 mt-4 ${socialType === "none" ? "justify-center" : "justify-between"}`}>
            <Button variant="outline" size="sm" className="gap-1 border-gray-700 hover:bg-gray-800 flex-1" asChild>
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4" />
                <span>Discord</span>
              </a>
            </Button>

            {socialType !== "none" && (
              <Button variant="outline" size="sm" className="gap-1 border-gray-700 hover:bg-gray-800 flex-1" asChild>
                <a href={socialUrl} target="_blank" rel="noopener noreferrer">
                  {renderSocialIcon()}
                  <span>{getSocialLabel()}</span>
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

