"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { debounce } from "lodash"

interface DiscordActivity {
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
}

interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  global_name?: string
}

interface LanyardResponse {
  success: boolean
  data: {
    discord_user: DiscordUser
    discord_status: "online" | "idle" | "dnd" | "offline"
    activities: DiscordActivity[]
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
  error?: {
    message: string
  }
}

export function DiscordStatus() {
  const [data, setData] = useState<LanyardResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)
  const [retryAfter, setRetryAfter] = useState(60)

  const DISCORD_ID = "728076716219695148" // Substitua pelo seu ID do Discord

  const fetchDiscordStatus = debounce(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.status === 429) {
        const retry = response.headers.get('Retry-After') || '60'
        setRetryAfter(parseInt(retry))
        setRateLimited(true)
        throw new Error(`Limite de requisições excedido. Tente novamente em ${retry} segundos.`)
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result: LanyardResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Resposta inválida da API")
      }

      setData(result.data)
      setLoading(false)
      setRateLimited(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      setLoading(false)
      
      if (!rateLimited) {
        setTimeout(fetchDiscordStatus, 30000)
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }, 1000)

  useEffect(() => {
    fetchDiscordStatus()
    
    const interval = setInterval(() => {
      if (!rateLimited) {
        fetchDiscordStatus()
      }
    }, 60000)
    
    return () => {
      clearInterval(interval)
      fetchDiscordStatus.cancel()
    }
  }, [rateLimited])

  // Funções auxiliares (mantidas do seu código original)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "idle": return "bg-yellow-500"
      case "dnd": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const formatActivityTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
  }

  const getAvatarUrl = (userId: string, avatarId: string) => 
    `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=128`

  const getAssetUrl = (appId: string | undefined, assetId: string | undefined) => {
    if (!appId || !assetId) return ""
    if (assetId.startsWith("spotify:")) return data?.spotify?.album_art_url || ""
    if (assetId.startsWith("external/")) {
      return `https://media.discordapp.net/external/${assetId.replace("external/", "")}`
    }
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`
  }

  if (loading) return <DiscordStatusSkeleton />

  if (error || !data) {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardContent className="p-4 text-center">
          <p className="text-red-500">
            {rateLimited 
              ? `API limitada. Tente novamente em ${retryAfter}s` 
              : `Erro: ${error}`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-500 hover:text-red-400"
            onClick={() => {
              setLoading(true)
              setError(null)
              fetchDiscordStatus()
            }}
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Renderização do componente (igual ao seu original)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-gray-800 bg-black/30">
        <CardContent className="p-4">
          {/* Seu JSX de renderização permanece EXATAMENTE IGUAL aqui */}
          {/* (Mantenha toda a parte visual do seu componente original) */}
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
      </CardContent>
    </Card>
  )
}
