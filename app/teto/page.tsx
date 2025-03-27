"use client" // Adicione isso no TOPO do arquivo

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Music, Headphones, Mic, Star, Heart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TetoPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Título dinâmico para a página da Teto
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const titles = ["KASANE TETO", "かさねテト", "重音テト", "UTAU QUEEN", "0401"]
    let currentIndex = 0

    const changeTitle = () => {
      document.title = titles[currentIndex]
      currentIndex = (currentIndex + 1) % titles.length
    }

    changeTitle()
    const intervalId = setInterval(changeTitle, 2000)

    return () => clearInterval(intervalId)
  }, [])

  // Restante do seu código permanece o mesmo, exceto pelos usos de window...

  // Modifique o backgroundPosition para usar windowSize
  const backgroundStyle = {
    backgroundImage: "radial-gradient(circle at center, rgba(255, 51, 102, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
    backgroundSize: "200% 200%",
    backgroundPosition: windowSize.width > 0 
      ? `${(mousePosition.x / windowSize.width) * 100}% ${(mousePosition.y / windowSize.height) * 100}%`
      : 'center'
  }

  // Modifique as partículas flutuantes para usar windowSize
  const floatingParticles = Array.from({ length: 20 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 rounded-full bg-pink-500"
      initial={{
        x: windowSize.width > 0 ? Math.random() * windowSize.width : 0,
        y: windowSize.height > 0 ? Math.random() * windowSize.height : 0,
        opacity: Math.random() * 0.5 + 0.3,
      }}
      animate={{
        x: windowSize.width > 0 ? Math.random() * windowSize.width : 0,
        y: windowSize.height > 0 ? Math.random() * windowSize.height : 0,
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  ))

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-hidden"
      style={backgroundStyle}
    >
      {/* Neon grid background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ff3366 1px, transparent 1px), linear-gradient(to bottom, #ff3366 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {floatingParticles}
      </div>

      {/* Restante do seu JSX permanece o mesmo... */}
      {/* ... */}

      {/* No botão de scroll, modifique para verificar window */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-pink-500 animate-bounce"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
          }}
          aria-label="Scroll down"
        >
          {/* Ícone SVG permanece o mesmo */}
        </Button>
      </motion.div>

      {/* Restante do seu código JSX... */}
    </div>
  )
}
