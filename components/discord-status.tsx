"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LanyardData {
  discord_user: {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    global_name?: string
  }
  discord_status: string
  activities: {
    type: number
    name: string
    state?: string
    details?: string
    timestamps?: {
      start?: number
      end?: number
    }
    assets?: {
      large_image?: string
      large_text?: string
      small_image?: string
      small_text?: string
    }
    application_id?: string
    emoji?: {
      name: string
      id?: string
      animated?: boolean
    }
  }[]
  listening_to_spotify: boolean
  spotify?: {
    track_id: string
    timestamps: {
      start: number
      end: number
    }
    album: string
    album_art_url: string
    artist: string
    song: string
  }
  active_on_discord_desktop: boolean
  active_on_discord_mobile: boolean
  active_on_discord_web: boolean
}

export function DiscordStatus() {
  const [status, setStatus] = useState<LanyardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatus() {
      try {
        // Buscar dados do nosso endpoint
        const response = await fetch("/api/discord-status")

        if (!response.ok) {
          throw new Error("Falha ao buscar status do Discord")
        }

        const data = await response.json()
        setStatus(data)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido")
        setLoading(false)
      }
    }

    fetchStatus()

    // Atualizar a cada minuto
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <DiscordStatusSkeleton />
  }

  if (error || !status) {
    return <div className="text-red-500">Error loading Discord status: {error}</div>
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Format activity time
  const formatActivityTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  // Get Discord avatar URL
  const getAvatarUrl = (userId: string, avatarId: string) => {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=128`
  }

  // Get activity asset image URL
  const getAssetUrl = (applicationId: string | undefined, assetId: string | undefined) => {
    if (!applicationId || !assetId) return "/placeholder.svg?height=128&width=128"

    // Handle Spotify and custom assets
    if (assetId.startsWith("spotify:")) {
      return status.spotify?.album_art_url || "/placeholder.svg?height=128&width=128"
    }

    // Handle Discord CDN assets
    if (assetId.startsWith("external/")) {
      const externalId = assetId.replace("external/", "")
      return `https://media.discordapp.net/external/${externalId}`
    }

    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`
  }

  // Get custom status if available
  const customStatus = status.activities.find((activity) => activity.type === 4)
  const customStatusText = customStatus?.state || null
  const customStatusEmoji = customStatus?.emoji
    ? customStatus.emoji.id
      ? `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}`
      : null
    : null

  // Filter activities to remove duplicates and incomplete entries
  const filteredActivities = status.activities.filter((activity) => {
    // Skip custom status (type 4) as it's handled separately
    if (activity.type === 4) return false

    // Skip Spotify activities without assets (incomplete entries)
    if (activity.name === "Spotify" && (!activity.assets || !activity.assets.large_image)) {
      return false
    }

    return true
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-gray-800 bg-black/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={getAvatarUrl(status.discord_user.id, status.discord_user.avatar) || "/placeholder.svg"}
                  alt={status.discord_user.username}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${getStatusColor(status.discord_status)}`}
              ></div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{status.discord_user.global_name || status.discord_user.username}</h3>
                {status.discord_user.discriminator !== "0" && (
                  <span className="text-xs text-muted-foreground">#{status.discord_user.discriminator}</span>
                )}

                {/* Status personalizado com suporte para dispositivos móveis */}
                {customStatusText && (
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help flex items-center gap-1">
                            {customStatusEmoji ? (
                              <div className="w-5 h-5 relative">
                                <Image
                                  src={customStatusEmoji || "/placeholder.svg"}
                                  alt="Status emoji"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-sm">💬</div>
                            )}

                            {/* Exibir o texto do status diretamente em dispositivos móveis */}
                            <span className="text-xs text-muted-foreground md:hidden">
                              {customStatusText.length > 15
                                ? `${customStatusText.substring(0, 15)}...`
                                : customStatusText}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                          <p>{customStatusText}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {status.discord_status === "online"
                  ? "Online"
                  : status.discord_status === "idle"
                    ? "Idle"
                    : status.discord_status === "dnd"
                      ? "Do Not Disturb"
                      : "Offline"}
              </p>
            </div>

            {/* Botão para conversar no Discord */}
            <Button variant="outline" size="sm" className="gap-1 border-gray-700 hover:bg-gray-800" asChild>
              <a href={`https://discord.com/users/${status.discord_user.id}`} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Conversar</span>
              </a>
            </Button>
          </div>

          {/* Display filtered activities */}
          {filteredActivities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              {filteredActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  {activity.assets?.large_image && (
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <Image
                        src={getAssetUrl(activity.application_id, activity.assets.large_image) || "/placeholder.svg"}
                        alt={activity.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-muted-foreground">
                      {activity.type === 0
                        ? "Playing"
                        : activity.type === 1
                          ? "Streaming"
                          : activity.type === 2
                            ? "Listening to"
                            : activity.type === 3
                              ? "Watching"
                              : "Active in"}
                    </div>
                    <div className="font-medium text-sm">{activity.name}</div>
                    {activity.details && <div className="text-xs text-muted-foreground">{activity.details}</div>}
                    {activity.state && <div className="text-xs text-muted-foreground">{activity.state}</div>}
                    {activity.timestamps?.start && (
                      <div className="text-xs text-muted-foreground">
                        {formatActivityTime(activity.timestamps.start)} elapsed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Display Spotify separately with full details */}
          {status.listening_to_spotify && status.spotify && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded overflow-hidden">
                  <Image
                    src={status.spotify.album_art_url || "/placeholder.svg"}
                    alt={status.spotify.song}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Listening to Spotify</div>
                  <div className="font-medium text-sm">{status.spotify.song}</div>
                  <div className="text-xs text-muted-foreground">by {status.spotify.artist}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DiscordStatusSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />

          <div className="flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20 mt-1" />
          </div>

          <Skeleton className="h-9 w-24" />
        </div>

        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />

            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-32 mt-1" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

