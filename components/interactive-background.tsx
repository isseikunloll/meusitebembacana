"use client"

import { useEffect, useRef } from "react"

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Estrelas com diferentes estilos
    const starElements = [
      // Estrela clássica de 5 pontas
      (x: number, y: number, size: number, angle: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.beginPath()

        for (let i = 0; i < 5; i++) {
          const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2
          const innerAngle = outerAngle + Math.PI / 5

          const outerX = Math.cos(outerAngle) * size
          const outerY = Math.sin(outerAngle) * size

          const innerX = Math.cos(innerAngle) * (size * 0.4)
          const innerY = Math.sin(innerAngle) * (size * 0.4)

          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }

          ctx.lineTo(innerX, innerY)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      },

      // Estrela brilhante (com raios)
      (x: number, y: number, size: number, angle: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)

        // Raios principais
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const rotation = (Math.PI / 2) * i
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(rotation) * size, Math.sin(rotation) * size)
        }
        ctx.stroke()

        // Raios secundários
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const rotation = (Math.PI / 2) * i + Math.PI / 4
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(rotation) * (size * 0.7), Math.sin(rotation) * (size * 0.7))
        }
        ctx.stroke()

        // Centro da estrela
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      },

      // Estrela de 4 pontas
      (x: number, y: number, size: number, angle: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.beginPath()

        for (let i = 0; i < 4; i++) {
          const outerAngle = (Math.PI * 2 * i) / 4
          const innerAngle = outerAngle + Math.PI / 4

          const outerX = Math.cos(outerAngle) * size
          const outerY = Math.sin(outerAngle) * size

          const innerX = Math.cos(innerAngle) * (size * 0.4)
          const innerY = Math.sin(innerAngle) * (size * 0.4)

          ctx.lineTo(outerX, outerY)
          ctx.lineTo(innerX, innerY)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      },

      // Estrela com brilho (sparkle)
      (x: number, y: number, size: number, angle: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)

        // Estrela central
        ctx.beginPath()
        for (let i = 0; i < 8; i++) {
          const longRay = i % 2 === 0
          const rayLength = longRay ? size : size * 0.5
          const rayAngle = (i * Math.PI) / 4

          const rayX = Math.cos(rayAngle) * rayLength
          const rayY = Math.sin(rayAngle) * rayLength

          if (i === 0) {
            ctx.moveTo(rayX, rayY)
          } else {
            ctx.lineTo(rayX, rayY)
          }
        }
        ctx.closePath()
        ctx.fill()

        // Pequenos círculos ao redor
        for (let i = 0; i < 4; i++) {
          const dotAngle = (i * Math.PI) / 2 + Math.PI / 4
          const dotDistance = size * 1.2
          const dotX = Math.cos(dotAngle) * dotDistance
          const dotY = Math.sin(dotAngle) * dotDistance

          ctx.beginPath()
          ctx.arc(dotX, dotY, size * 0.1, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      },

      // Estrela de 6 pontas (Estrela de Davi)
      (x: number, y: number, size: number, angle: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)

        // Primeiro triângulo
        ctx.beginPath()
        for (let i = 0; i < 3; i++) {
          const pointAngle = (i * Math.PI * 2) / 3
          const pointX = Math.cos(pointAngle) * size
          const pointY = Math.sin(pointAngle) * size

          if (i === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        }
        ctx.closePath()
        ctx.fill()

        // Segundo triângulo (invertido)
        ctx.beginPath()
        for (let i = 0; i < 3; i++) {
          const pointAngle = (i * Math.PI * 2) / 3 + Math.PI
          const pointX = Math.cos(pointAngle) * size
          const pointY = Math.sin(pointAngle) * size

          if (i === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        }
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      },
    ]

    // Create star particles
    class StarParticle {
      x: number
      y: number
      size: number
      baseSize: number
      drawFunction: (x: number, y: number, size: number, angle: number) => void
      angle: number
      rotationSpeed: number
      opacity: number
      targetOpacity: number
      vx: number
      vy: number
      friction: number
      mouseForce: number
      mouseRadius: number
      respawning: boolean
      twinkleSpeed: number
      twinkleDirection: number
      isHintStar: boolean

      constructor(isHintStar = false) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseSize = Math.random() * 15 + 5
        this.size = this.baseSize
        this.drawFunction = starElements[Math.floor(Math.random() * starElements.length)]
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.opacity = Math.random() * 0.3 + 0.1
        this.targetOpacity = this.opacity
        this.vx = 0
        this.vy = 0
        this.friction = 0.95
        this.mouseForce = Math.random() * 0.2 + 0.1
        this.mouseRadius = Math.random() * 150 + 50
        this.respawning = false
        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1
        this.isHintStar = isHintStar

        // Se for a estrela de dica, garantir que seja maior
        if (this.isHintStar) {
          this.baseSize = Math.max(this.baseSize, 15)
          this.size = this.baseSize
          this.opacity = Math.min(0.8, this.opacity * 1.5)
          this.targetOpacity = this.opacity
        }
      }

      update(mouseX: number | undefined, mouseY: number | undefined) {
        // Rotate element
        this.angle += this.rotationSpeed

        // Efeito de brilho (twinkle)
        this.targetOpacity += this.twinkleSpeed * this.twinkleDirection
        if (this.targetOpacity > 0.7) {
          this.targetOpacity = 0.7
          this.twinkleDirection = -1
        } else if (this.targetOpacity < 0.1) {
          this.targetOpacity = 0.1
          this.twinkleDirection = 1
        }

        // Apply friction to slow down movement
        this.vx *= this.friction
        this.vy *= this.friction

        // Mouse interaction
        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < this.mouseRadius) {
            // Calculate force based on distance (closer = stronger)
            const force = (1 - distance / this.mouseRadius) * this.mouseForce

            // Move away from mouse
            const angle = Math.atan2(dy, dx)
            this.vx -= Math.cos(angle) * force
            this.vy -= Math.sin(angle) * force

            // Increase size and opacity when near mouse
            this.size = this.baseSize + this.baseSize * force * 2
            this.targetOpacity = Math.min(0.9, this.opacity + force * 0.5)
          } else {
            // Return to original size
            if (this.size > this.baseSize) {
              this.size = Math.max(this.baseSize, this.size - 0.2)
            }
          }
        }

        // Smoothly adjust opacity
        this.opacity += (this.targetOpacity - this.opacity) * 0.1

        // Update position
        this.x += this.vx
        this.y += this.vy

        // Check if particle is off-screen
        const buffer = this.size * 2
        const offScreen =
          this.x < -buffer || this.x > canvas.width + buffer || this.y < -buffer || this.y > canvas.height + buffer

        // Handle respawning with animation
        if (offScreen) {
          if (!this.respawning) {
            this.respawning = true
            this.targetOpacity = 0

            // After fading out, reposition the particle
            setTimeout(() => {
              // Choose a random edge to spawn from
              const edge = Math.floor(Math.random() * 4)

              if (edge === 0) {
                // Top
                this.x = Math.random() * canvas.width
                this.y = -buffer
                this.vy = Math.random() * 0.5 + 0.1
              } else if (edge === 1) {
                // Right
                this.x = canvas.width + buffer
                this.y = Math.random() * canvas.height
                this.vx = -(Math.random() * 0.5 + 0.1)
              } else if (edge === 2) {
                // Bottom
                this.x = Math.random() * canvas.width
                this.y = canvas.height + buffer
                this.vy = -(Math.random() * 0.5 + 0.1)
              } else {
                // Left
                this.x = -buffer
                this.y = Math.random() * canvas.height
                this.vx = Math.random() * 0.5 + 0.1
              }

              this.targetOpacity = Math.random() * 0.3 + 0.1
              this.respawning = false
            }, 500)
          }
        }
      }

      draw() {
        ctx.save()

        // Set styles
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.lineWidth = 1.5

        // Draw the element
        this.drawFunction(this.x, this.y, this.size, this.angle)

        // Se for a estrela de dica, desenhar o número "0401"
        if (this.isHintStar) {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.2})`
          ctx.font = `${this.size * 0.4}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("0401", this.x, this.y)
        }

        ctx.restore()
      }
    }

    // Create particles
    const particles: StarParticle[] = []
    const particleCount = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 25000))

    // Criar partículas normais
    for (let i = 0; i < particleCount - 1; i++) {
      particles.push(new StarParticle(false))
    }

    // Adicionar uma estrela com a dica
    particles.push(new StarParticle(true))

    // Mouse tracking
    let mouseX: number | undefined = undefined
    let mouseY: number | undefined = undefined
    let isMouseActive = false

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isMouseActive = true

      // Reset the fade timer
      clearTimeout(mouseInactiveTimeout)
      mouseInactiveTimeout = setTimeout(() => {
        isMouseActive = false
      }, 100) // Short timeout to detect when mouse stops moving
    }

    const handleMouseLeave = () => {
      mouseX = undefined
      mouseY = undefined
      isMouseActive = false
    }

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      // Não prevenir o comportamento padrão para permitir scroll
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
        isMouseActive = true

        // Reset the fade timer
        clearTimeout(mouseInactiveTimeout)
        mouseInactiveTimeout = setTimeout(() => {
          isMouseActive = false
        }, 100)
      }
    }

    const handleTouchEnd = () => {
      mouseX = undefined
      mouseY = undefined
      isMouseActive = false
    }

    // Timer for mouse inactivity
    let mouseInactiveTimeout: NodeJS.Timeout

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    // Animation loop
    let animationFrameId: number

    function animate() {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update(mouseX, mouseY)
        particle.draw()
      }

      // Draw mouse glow effect when mouse is active
      if (isMouseActive && mouseX !== undefined && mouseY !== undefined) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 100)
        gradient.addColorStop(0, "rgba(200, 200, 255, 0.3)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
      clearTimeout(mouseInactiveTimeout)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black z-0" />
}

