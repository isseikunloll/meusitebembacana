"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

interface AniListUser {
  id: number
  name: string
  avatar: {
    large: string
  }
  bannerImage: string | null
  about: string | null
  statistics: {
    anime: {
      count: number
      episodesWatched: number
      minutesWatched: number
      meanScore: number
    }
  }
  siteUrl: string
}

export function AniListProfileCard({ username }: { username: string }) {
  const [user, setUser] = useState<AniListUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullAbout, setShowFullAbout] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const query = `
          query ($username: String) {
            User(name: $username) {
              id
              name
              avatar {
                large
              }
              bannerImage
              about
              statistics {
                anime {
                  count
                  episodesWatched
                  minutesWatched
                  meanScore
                }
              }
              siteUrl
            }
          }
        `

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { username },
          }),
        })

        const result = await response.json()

        if (result.errors) {
          throw new Error(result.errors[0].message)
        }

        setUser(result.data.User)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch AniList user data")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error || !user) {
    return <div className="text-red-500">Error loading AniList profile: {error}</div>
  }

  // Format minutes to days, hours
  const formatWatchTime = (minutes: number) => {
    const days = Math.floor(minutes / (60 * 24))
    const hours = Math.floor((minutes % (60 * 24)) / 60)

    return `${days}d ${hours}h`
  }

  // Processar o HTML do texto about para melhorar a formatação
  const cleanAndFormatAbout = (html: string | null) => {
    if (!html) return { __html: "" }

    // Primeiro, vamos preservar algumas tags específicas do AniList
    // Substituindo-as temporariamente por marcadores especiais
    let processedHtml = html
      // Preservar tags de imagem
      .replace(/<img\s+([^>]*)src="([^"]*)"([^>]*)>/gi, "###IMG###$1$2$3###")
      // Preservar tags de link
      .replace(/<a\s+([^>]*)href="([^"]*)"([^>]*)>(.*?)<\/a>/gi, "###LINK###$1$2$3$4###")
      // Preservar tags de formatação
      .replace(/<(b|i|u|s|strong|em|del|strike)>(.*?)<\/\1>/gi, "###$1###$2###/$1###")
      // Preservar tags de bloco
      .replace(/<(div|p|blockquote|h[1-6])([^>]*)>(.*?)<\/\1>/gi, "###$1$2###$3###/$1###")
      // Preservar quebras de linha
      .replace(/<br\s*\/?>/gi, "###BR###")
      // Preservar listas
      .replace(/<(ul|ol)>(.*?)<\/\1>/gi, "###$1###$2###/$1###")
      .replace(/<li>(.*?)<\/li>/gi, "###LI###$1###/LI###")

      // Remover todas as outras tags HTML
      .replace(/<[^>]*>/g, "")

      // Restaurar as tags preservadas
      // Imagens
      .replace(
        /###IMG###([^#]*)([^#]*)([^#]*)###/g,
        '<img src="$2" class="max-w-full h-auto rounded my-2 mx-auto" loading="lazy" alt="User content" />',
      )
      // Links
      .replace(
        /###LINK###([^#]*)([^#]*)([^#]*)([^#]*)###/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 no-underline hover:underline">$4</a>',
      )
      // Formatação
      .replace(/###b###(.*?)###\/b###/g, "<b>$1</b>")
      .replace(/###strong###(.*?)###\/strong###/g, "<strong>$1</strong>")
      .replace(/###i###(.*?)###\/i###/g, "<i>$1</i>")
      .replace(/###em###(.*?)###\/em###/g, "<em>$1</em>")
      .replace(/###u###(.*?)###\/u###/g, "<u>$1</u>")
      .replace(/###s###(.*?)###\/s###/g, "<s>$1</s>")
      .replace(/###del###(.*?)###\/del###/g, "<del>$1</del>")
      .replace(/###strike###(.*?)###\/strike###/g, "<strike>$1</strike>")
      // Blocos
      .replace(/###div([^#]*)###(.*?)###\/div###/g, "<div$1>$2</div>")
      .replace(/###p([^#]*)###(.*?)###\/p###/g, "<p$1>$2</p>")
      .replace(
        /###blockquote([^#]*)###(.*?)###\/blockquote###/g,
        '<blockquote$1 class="bg-gray-800/50 p-3 my-2 border-l-4 border-gray-600 rounded">$2</blockquote>',
      )
      .replace(/###h([1-6])([^#]*)###(.*?)###\/h\1###/g, '<h$1$2 class="font-bold my-2">$3</h$1>')
      // Quebras de linha
      .replace(/###BR###/g, "<br />")
      // Listas
      .replace(/###ul###(.*?)###\/ul###/g, '<ul class="list-disc pl-5 my-2">$1</ul>')
      .replace(/###ol###(.*?)###\/ol###/g, '<ol class="list-decimal pl-5 my-2">$1</ol>')
      .replace(/###LI###(.*?)###\/LI###/g, "<li>$1</li>")

      // Tratar formatação Markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/__(.*?)__/g, "<u>$1</u>")

      // Tratar hashtags e menções
      .replace(/#([a-zA-Z0-9_]+)/g, '<span class="text-blue-400">#$1</span>')
      .replace(
        /@([a-zA-Z0-9_]+)/g,
        '<a href="https://anilist.co/user/$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">@$1</a>',
      )

      // Tratar citações
      .replace(
        /^>\s*(.*?)$/gm,
        '<blockquote class="bg-gray-800/50 p-3 my-2 border-l-4 border-gray-600 rounded">$1</blockquote>',
      )

      // Garantir que parágrafos estejam bem formatados
      .replace(/\n\n/g, '</p><p class="my-2">')

      // Tratar quebras de linha simples
      .replace(/\n/g, "<br />")

    // Envolver em parágrafos se necessário
    if (
      !processedHtml.startsWith("<p") &&
      !processedHtml.startsWith("<blockquote") &&
      !processedHtml.startsWith("<div")
    ) {
      processedHtml = `<p class="my-2">${processedHtml}</p>`
    }

    return { __html: processedHtml }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-gray-800 bg-black/30">
        <div className="relative h-24 bg-gradient-to-r from-gray-900 to-black">
          {user.bannerImage && (
            <Image
              src={user.bannerImage || "/placeholder.svg"}
              alt="Profile banner"
              fill
              className="object-cover opacity-40"
            />
          )}
          <div className="absolute -bottom-12 left-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={user.avatar.large || "/placeholder.svg?height=96&width=96"}
                alt={user.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-14 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Link
                    href={user.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                {user.about && (
                  <div className="mt-2">
                    <div
                      className={`text-sm text-muted-foreground anilist-content ${
                        !showFullAbout ? "line-clamp-2 overflow-hidden" : "max-h-60 overflow-y-auto pr-2"
                      }`}
                      dangerouslySetInnerHTML={cleanAndFormatAbout(user.about)}
                    />
                    {user.about.length > 100 && (
                      <button
                        onClick={() => setShowFullAbout(!showFullAbout)}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                      >
                        {showFullAbout ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm mt-2 bg-gray-900/30 p-3 rounded-md">
              <div>
                <p className="text-muted-foreground">Anime</p>
                <p className="font-medium">{user.statistics.anime.count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Episodes</p>
                <p className="font-medium">{user.statistics.anime.episodesWatched}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Watch Time</p>
                <p className="font-medium">{formatWatchTime(user.statistics.anime.minutesWatched)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mean Score</p>
                <p className="font-medium">{user.statistics.anime.meanScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProfileSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-24 bg-gray-900">
        <div className="absolute -bottom-12 left-4">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      </div>

      <CardContent className="pt-14 pb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full max-w-[250px]" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-10 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

