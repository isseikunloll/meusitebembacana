"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Anime {
  id: number
  title: {
    romaji: string
    english: string
  }
  coverImage: {
    large: string
  }
  episodes: number
  nextAiringEpisode: {
    episode: number
  } | null
  progress: number
}

interface AniListData {
  currentlyWatching: Anime[]
  planToWatch: Anime[]
  loading: boolean
  error: string | null
}

export function AniListProfile({ username }: { username: string }) {
  const [data, setData] = useState<AniListData>({
    currentlyWatching: [],
    planToWatch: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchAniListData() {
      try {
        const query = `
          query ($username: String) {
            MediaListCollection(userName: $username, type: ANIME) {
              lists {
                name
                entries {
                  id
                  media {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      large
                    }
                    episodes
                    nextAiringEpisode {
                      episode
                    }
                  }
                  progress
                }
              }
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

        const lists = result.data.MediaListCollection.lists
        const currentlyWatching = lists.find((list: any) => list.name === "Watching")?.entries || []
        const planToWatch = lists.find((list: any) => list.name === "Planning")?.entries || []

        setData({
          currentlyWatching: currentlyWatching.map((entry: any) => ({
            id: entry.media.id,
            title: entry.media.title,
            coverImage: entry.media.coverImage,
            episodes: entry.media.episodes,
            nextAiringEpisode: entry.media.nextAiringEpisode,
            progress: entry.progress,
          })),
          planToWatch: planToWatch.map((entry: any) => ({
            id: entry.media.id,
            title: entry.media.title,
            coverImage: entry.media.coverImage,
            episodes: entry.media.episodes,
            nextAiringEpisode: entry.media.nextAiringEpisode,
            progress: entry.progress,
          })),
          loading: false,
          error: null,
        })
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch AniList data",
        }))
      }
    }

    fetchAniListData()
  }, [username])

  if (data.loading) {
    return <AnimeListSkeleton />
  }

  if (data.error) {
    return <div className="text-red-500">Error loading AniList data: {data.error}</div>
  }

  return (
    <Tabs defaultValue="watching" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="watching">Currently Watching</TabsTrigger>
        <TabsTrigger value="planning">Plan to Watch</TabsTrigger>
      </TabsList>
      <TabsContent value="watching">
        <AnimeGrid animeList={data.currentlyWatching} />
      </TabsContent>
      <TabsContent value="planning">
        <AnimeGrid animeList={data.planToWatch} />
      </TabsContent>
    </Tabs>
  )
}

function AnimeGrid({ animeList }: { animeList: Anime[] }) {
  if (animeList.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No anime found in this list</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
      {animeList.map((anime) => (
        <Link
          key={anime.id}
          href={`https://anilist.co/anime/${anime.id}`}
          target="_blank"
          className="transition-transform hover:scale-105"
        >
          <Card className="overflow-hidden h-full">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={anime.coverImage.large || "/placeholder.svg"}
                alt={anime.title.english || anime.title.romaji}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-1">{anime.title.english || anime.title.romaji}</h3>
              <div className="text-xs text-muted-foreground mt-1">
                {anime.progress > 0 && (
                  <span>
                    Progress: {anime.progress}/{anime.episodes || "?"}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function AnimeListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-[3/4] w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

