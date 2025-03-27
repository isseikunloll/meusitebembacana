"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, SkipForward, Pause, Play, List, X, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomSlider } from "@/components/ui/custom-slider"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define the audio tracks
const HOME_TRACKS = [
  // Original tracks
  { path: "/music/home/midnight-trip.mp3", title: "Midnight Trip" },
  { path: "/music/home/chilling-out.mp3", title: "Chilling Out" },
  { path: "/music/home/moment.mp3", title: "Moment" },
  { path: "/music/home/walkthrough.mp3", title: "Walkthrough" },
  { path: "/music/home/someday-sometime.mp3", title: "Someday, Sometime" },
  { path: "/music/home/aira.mp3", title: "Aira" },
  { path: "/music/home/morose-dreamer.mp3", title: "Morose Dreamer" },
  { path: "/music/home/alkaline-tears.mp3", title: "Alkaline Tears" },
  { path: "/music/home/dolce-biblioteca.mp3", title: "Dolce Biblioteca" },

  // New external tracks
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877463/musicas%20para%20o%20site/aba%20principal/Welcome%20School.mp3",
    title: "Welcome School",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877482/musicas%20para%20o%20site/aba%20principal/Chilling%20Out.mp3",
    title: "Chilling Out (Extended)",
  },
]

const FRIENDS_TRACKS = [
  // Original tracks
  { path: "/music/friends/pixel-time.mp3", title: "Pixel Time" },
  { path: "/music/friends/hello-to-halo.mp3", title: "Hello to Halo" },
  { path: "/music/friends/mx-adventure.mp3", title: "MX Adventure" },
  { path: "/music/friends/sakura-punch.mp3", title: "SAKURA PUNCH" },
  { path: "/music/friends/colorful-mess.mp3", title: "Colorful Mess" },
  { path: "/music/friends/future-bossa.mp3", title: "Future Bossa" },
  { path: "/music/friends/guruguru-usagi.mp3", title: "Guruguru Usagi" },

  // New external tracks
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877597/musicas%20para%20o%20site/aba%20friends/Up%20to%2021%C2%B0C.mp3",
    title: "Up to 21°C",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877607/musicas%20para%20o%20site/aba%20friends/Usagi%20Flap.mp3",
    title: "Usagi Flap",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877625/musicas%20para%20o%20site/aba%20friends/Coffee%20Cats.mp3",
    title: "Coffee Cats",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877644/musicas%20para%20o%20site/aba%20friends/Lemonade%20Diary.mp3",
    title: "Lemonade Diary",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877672/musicas%20para%20o%20site/aba%20friends/Mischievous%20Step.mp3",
    title: "Mischievous Step",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877519/musicas%20para%20o%20site/aba%20friends/Romantic%20Smile.mp3",
    title: "Romantic Smile",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877534/musicas%20para%20o%20site/aba%20friends/Summer%20Bounce.mp3",
    title: "Summer Bounce",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877546/musicas%20para%20o%20site/aba%20friends/Shady%20Girls.mp3",
    title: "Shady Girls",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877562/musicas%20para%20o%20site/aba%20friends/Unwelcome%20School.mp3",
    title: "Unwelcome School",
  },
  {
    path: "https://res.cloudinary.com/dnr9puun8/video/upload/v1742877577/musicas%20para%20o%20site/aba%20friends/Cotton%20Candy%20Island.mp3",
    title: "Cotton Candy Island",
  },
]

// Função para embaralhar um array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function AudioControls() {
  const pathname = usePathname()
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [tracks, setTracks] = useState<typeof HOME_TRACKS>([])
  const [currentTrack, setCurrentTrack] = useState<(typeof HOME_TRACKS)[0] | null>(null)
  const [tracksPopoverOpen, setTracksPopoverOpen] = useState(false)
  const [showMusicReminder, setShowMusicReminder] = useState(false)
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<string>("")
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)
  const trackChangeRef = useRef(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const keySequenceRef = useRef<string[]>([])

  // Initialize audio element on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio()
      audio.volume = volume
      audioRef.current = audio

      // Set up event listeners
      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("playing", handlePlaying)
      audio.addEventListener("error", handleAudioError)

      // Show music reminder after a short delay
      const timer = setTimeout(() => {
        if (!hasPlayedBefore) {
          setShowMusicReminder(true)
        }
      }, 2000)

      // Hide reminder after some time
      const hideTimer = setTimeout(() => {
        setShowMusicReminder(false)
      }, 8000)

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded)
          audioRef.current.removeEventListener("playing", handlePlaying)
          audioRef.current.removeEventListener("error", handleAudioError)
          audioRef.current.pause()
        }
      }
    }
  }, [hasPlayedBefore, volume])

  // Setup keyboard listener for secret code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the sequence
      keySequenceRef.current.push(e.key)

      // Only keep the last 4 keys
      if (keySequenceRef.current.length > 4) {
        keySequenceRef.current.shift()
      }

      // Check if the sequence matches "0401"
      if (keySequenceRef.current.join("") === "0401") {
        // Reset the sequence
        keySequenceRef.current = []

        // Navigate to the secret page
        router.push("/teto")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [router])

  // Handle audio errors
  const handleAudioError = (e: Event) => {
    console.error("Audio error:", e)
    setIsLoading(false)
    setIsPlaying(false)

    // Force enable the play button after error
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }

  // Handle playing event
  const handlePlaying = () => {
    setIsLoading(false)
    setIsPlaying(true)

    // Clear any loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }

  // Handle track ending
  const handleEnded = () => {
    // Go to next track
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
  }

  // Update tracks based on pathname and shuffle them
  useEffect(() => {
    // Check if we've changed pages
    const pageChanged = pathname !== currentPage
    setCurrentPage(pathname)

    const newTracks = pathname === "/friends" ? FRIENDS_TRACKS : HOME_TRACKS

    // Only shuffle tracks when the page changes or on initial load
    if (pageChanged || tracks.length === 0) {
      const shuffledTracks = shuffleArray(newTracks)
      setTracks(shuffledTracks)

      if (shuffledTracks.length > 0) {
        // When changing pages, reset the track index and stop playback
        if (pageChanged) {
          setCurrentTrackIndex(0)
          setCurrentTrack(shuffledTracks[0])

          // Stop any playing audio
          if (audioRef.current && isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
          }
        }
      }
    }
  }, [pathname, currentPage, isPlaying, tracks.length])

  // Update current track when track index changes
  useEffect(() => {
    if (tracks.length > 0 && currentTrackIndex < tracks.length) {
      const track = tracks[currentTrackIndex]
      setCurrentTrack(track)

      if (audioRef.current) {
        // Remember if it was playing
        const wasPlaying = isPlaying

        // Pause current playback
        if (wasPlaying) {
          audioRef.current.pause()
        }

        // Set loading state
        setIsLoading(true)

        // Set a timeout to force enable the play button after 3 seconds
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
        }

        loadingTimeoutRef.current = setTimeout(() => {
          setIsLoading(false)
        }, 3000)

        // Update the source
        audioRef.current.src = track.path

        // Set preload attribute to auto for faster loading
        audioRef.current.preload = "auto"

        // Use lower quality for faster loading
        audioRef.current.mozPreservesPitch = false

        // Keep the playing state if it was playing
        if (wasPlaying) {
          audioRef.current.play().catch((error) => {
            console.error("Error playing after track change:", error)
            setIsPlaying(false)
          })
        }
      }
    }
  }, [currentTrackIndex, tracks, isPlaying])

  // Handle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || isLoading) return

    if (isPlaying) {
      // If playing, pause
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // If not playing, play
      setIsLoading(true)

      // Set a timeout to force enable the play button after 3 seconds
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasPlayedBefore(true)
          setShowMusicReminder(false)
        })
        .catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
          setIsLoading(false)
        })
    }
  }

  // Handle next track
  const nextTrack = () => {
    if (tracks.length > 0 && !isLoading) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  // Handle track selection
  const selectTrack = (index: number) => {
    if (!isLoading && index !== currentTrackIndex) {
      setCurrentTrackIndex(index)
      setTracksPopoverOpen(false)
    } else {
      setTracksPopoverOpen(false)
    }
  }

  // Don't render controls if there are no tracks
  if (tracks.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md rounded-full px-4 py-2 border border-gray-800 shadow-lg flex items-center gap-3 transition-all duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/80 hover:text-white"
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white/80 rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/80 hover:text-white"
          onClick={nextTrack}
          disabled={isLoading}
          aria-label="Next track"
        >
          <SkipForward size={16} />
        </Button>

        <div className="text-xs text-white/80 w-32 truncate">{currentTrack?.title || "No track selected"}</div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>

          <div className="w-20">
            <CustomSlider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="h-1"
              thumbClassName="h-2.5 w-2.5" // Smaller thumb size
            />
          </div>
        </div>

        <Popover open={tracksPopoverOpen} onOpenChange={setTracksPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white"
              aria-label="Show tracks"
            >
              <List size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-black/90 border-gray-800 backdrop-blur-md" align="end" side="top">
            <div className="p-2 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-sm font-medium">Available Tracks</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setTracksPopoverOpen(false)}>
                <X size={14} />
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {tracks.map((track, index) => (
                <button
                  key={track.path}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs hover:bg-gray-800/50 transition-colors",
                    currentTrackIndex === index && "bg-gray-800/80 font-medium",
                  )}
                  onClick={() => selectTrack(index)}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Music reminder toast */}
      {showMusicReminder && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 backdrop-blur-md rounded-lg px-4 py-3 border border-gray-800 shadow-lg flex items-center gap-3 transition-all duration-300 max-w-xs animate-in fade-in slide-in-from-bottom-5">
          <Music size={18} className="text-white/80" />
          <div>
            <p className="text-xs text-white/90">Enjoy some music while browsing!</p>
            <p className="text-xs text-white/60 mt-0.5">Click play to listen to the playlist</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs h-7 px-2"
            onClick={() => setShowMusicReminder(false)}
          >
            Dismiss
          </Button>
        </div>
      )}
    </>
  )
}

