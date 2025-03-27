"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const tetoTitles = ["KASANE TETO", "かさねテト", "重音テト", "UTAU QUEEN", "0401"]

export function TetoTitle() {
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Só ativar na página da Teto
    setIsActive(pathname === "/teto")
  }, [pathname])

  useEffect(() => {
    if (!isActive) return

    let currentIndex = 0

    // Função para alternar o título
    const changeTitle = () => {
      document.title = tetoTitles[currentIndex]
      currentIndex = (currentIndex + 1) % tetoTitles.length
    }

    // Definir o título inicial
    changeTitle()

    // Configurar o intervalo para alternar o título a cada 2 segundos
    const intervalId = setInterval(changeTitle, 2000)

    // Limpar o intervalo quando o componente for desmontado ou desativado
    return () => clearInterval(intervalId)
  }, [isActive])

  // Este componente não renderiza nada visível
  return null
}

