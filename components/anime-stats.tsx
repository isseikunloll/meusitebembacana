"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface AnimeStats {
  totalAnime: number
  episodesWatched: number
  minutesWatched: number
  meanScore: number
  genreDistribution: { name: string; value: number }[]
  statusDistribution: { name: string; value: number }[]
  loading: boolean
  error: string | null
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

export function AnimeStats({ username }: { username: string }) {
  const [stats, setStats] = useState<AnimeStats>({
    totalAnime: 0,
    episodesWatched: 0,
    minutesWatched: 0,
    meanScore: 0,
    genreDistribution: [],
    statusDistribution: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchAnimeStats() {
      try {
        const query = `
          query ($username: String) {
            User(name: $username) {
              statistics {
                anime {
                  count
                  episodesWatched
                  minutesWatched
                  meanScore
                  genres {
                    genre
                    count
                  }
                  statuses {
                    status
                    count
                  }
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

        const animeStats = result.data.User.statistics.anime

        // Process genre distribution (top 8)
        const genreDistribution = animeStats.genres
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 8)
          .map((item: any) => ({
            name: item.genre,
            value: item.count,
          }))

        // Process status distribution
        const statusMap: Record<string, string> = {
          CURRENT: "Watching",
          COMPLETED: "Completed",
          PAUSED: "Paused",
          DROPPED: "Dropped",
          PLANNING: "Planning",
        }

        const statusDistribution = animeStats.statuses.map((item: any) => ({
          name: statusMap[item.status] || item.status,
          value: item.count,
        }))

        setStats({
          totalAnime: animeStats.count,
          episodesWatched: animeStats.episodesWatched,
          minutesWatched: animeStats.minutesWatched,
          meanScore: animeStats.meanScore,
          genreDistribution,
          statusDistribution,
          loading: false,
          error: null,
        })
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch AniList stats",
        }))
      }
    }

    fetchAnimeStats()
  }, [username])

  if (stats.loading) {
    return <StatsSkeletons />
  }

  if (stats.error) {
    return <div className="text-red-500">Error loading AniList stats: {stats.error}</div>
  }

  // Format minutes to days, hours, minutes
  const formatWatchTime = (minutes: number) => {
    const days = Math.floor(minutes / (60 * 24))
    const hours = Math.floor((minutes % (60 * 24)) / 60)
    const mins = minutes % 60

    return `${days}d ${hours}h ${mins}m`
  }

  const statCards = [
    { title: "Total Anime", value: stats.totalAnime.toString() },
    { title: "Episodes Watched", value: stats.episodesWatched.toString() },
    { title: "Watch Time", value: formatWatchTime(stats.minutesWatched) },
    { title: "Mean Score", value: `${stats.meanScore.toFixed(1)}/10` },
  ]

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
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {statCards.map((card, index) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-muted-foreground text-sm">{card.title}</h3>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="genres" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="genres">Favorite Genres</TabsTrigger>
          <TabsTrigger value="status">Watch Status</TabsTrigger>
        </TabsList>
        <TabsContent value="genres">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Genre Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-3">
                {stats.genreDistribution.map((genre, index) => (
                  <div key={genre.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{genre.name}</span>
                      <span className="text-sm text-muted-foreground">{genre.value} anime</span>
                    </div>
                    <Progress
                      value={(genre.value / Math.max(...stats.genreDistribution.map((g) => g.value))) * 100}
                      className="h-2"
                      style={
                        {
                          "--progress-foreground": COLORS[index % COLORS.length],
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Watch Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-3">
                {stats.statusDistribution.map((status, index) => (
                  <div key={status.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{status.name}</span>
                      <span className="text-sm text-muted-foreground">{status.value} anime</span>
                    </div>
                    <Progress
                      value={(status.value / Math.max(...stats.statusDistribution.map((s) => s.value))) * 100}
                      className="h-2"
                      style={
                        {
                          "--progress-foreground": COLORS[index % COLORS.length],
                        } as React.CSSProperties
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsSkeletons() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

