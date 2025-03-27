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
  const [rateLimited, setRateLimited] = useState(false)
  const [retryAfter, setRetryAfter] = useState(60)

  const fetchStatus = debounce(async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // Timeout de 8 segundos

    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/728076716219695148`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Tratamento para rate limiting
      if (response.status === 429) {
        const retry = response.headers.get('Retry-After') || '60'
        setRetryAfter(parseInt(retry))
        setRateLimited(true)
        throw new Error(`Rate limited. Tente novamente em ${retry} segundos.`)
      }

      if (!response.ok) {
        throw new Error("Falha ao buscar status do Discord")
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error?.message || "Erro na API Lanyard")
      }

      setStatus(data.data)
      setLoading(false)
      setRateLimited(false)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido")
      setLoading(false)
      
      if (!rateLimited) {
        // Se não for rate limit, tenta novamente em 30 segundos
        setTimeout(fetchStatus, 30000)
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }, 1000) // Debounce de 1 segundo

  useEffect(() => {
    fetchStatus()
    
    // Atualizar a cada minuto, exceto se estiver rate limited
    const interval = setInterval(() => {
      if (!rateLimited) {
        fetchStatus()
      }
    }, 60000)
    
    return () => {
      clearInterval(interval)
      fetchStatus.cancel() // Cancela qualquer debounce pendente
    }
  }, [rateLimited])

  if (loading) {
    return <DiscordStatusSkeleton />
  }

  if (error || !status) {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardContent className="p-4">
          <div className="text-red-500 text-center">
            {rateLimited ? (
              <p>API limitada. Tente novamente em {retryAfter} segundos.</p>
            ) : (
              <p>Erro ao carregar status: {error}</p>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-red-500 hover:text-red-400"
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchStatus()
              }}
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ... (O restante do seu código original permanece EXATAMENTE igual) ...
  // Funções getStatusColor, formatActivityTime, getAvatarUrl, getAssetUrl
  // Renderização do status, atividades, etc.

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Seu JSX existente permanece igual aqui */}
    </motion.div>
  )
}

function DiscordStatusSkeleton() {
  // Seu skeleton existente permanece igual
}
