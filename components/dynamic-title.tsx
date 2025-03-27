"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const homeTitles = ["issei!", "that's me!", "behind u.", "hii!!", "i love you :)"]

export function DynamicTitle() {
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Só ativar na página inicial
    setIsActive(pathname === "/")
  }, [pathname])

  useEffect(() => {
    if (!isActive) return

    let currentIndex = 0

    // Função para alternar o título
    const changeTitle = () => {
      document.title = homeTitles[currentIndex]
      currentIndex = (currentIndex + 1) % homeTitles.length
    }

    // Definir o título inicial
    changeTitle()

    // Configurar o intervalo para alternar o título a cada 2.3 segundos
    const intervalId = setInterval(changeTitle, 2300)

    // Limpar o intervalo quando o componente for desmontado ou desativado
    return () => clearInterval(intervalId)
  }, [isActive])

  // Este componente não renderiza nada visível
  return null
}

