export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const discordData = await fetchDiscordStatus()

    return NextResponse.json(discordData)
  } catch (error) {
    console.error("Erro ao buscar status do Discord:", error)
    return new NextResponse(JSON.stringify({ error: "Falha ao buscar status do Discord" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

async function fetchDiscordStatus() {
  const DISCORD_ID = "728076716219695148" // Seu ID do Discord
  const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)

  if (!response.ok) {
    throw new Error("Falha ao buscar dados do Lanyard")
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error("Lanyard retornou erro: " + data.error?.message || "Erro desconhecido")
  }

  return data.data // Lanyard retorna os dados dentro de um objeto "data"
}

