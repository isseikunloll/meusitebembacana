import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DynamicTitle } from "@/components/dynamic-title"
import { FriendsTitle } from "@/components/friends-title"
import { TetoTitle } from "@/components/teto-title"
import { AudioControls } from "@/components/audio-controls"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C00L WEBSITE!!!!!",
  description: "issei?? wait, isn't that me?",
  icons: {
    icon: [
      {
        url: "/favicon.png?v=2",
        href: "/favicon.png?v=2",
      },
    ],
    apple: [
      {
        url: "/favicon.png?v=2",
        href: "/favicon.png?v=2",
      },
    ],
    shortcut: [
      {
        url: "/favicon.png?v=2",
        href: "/favicon.png?v=2",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        {/* Favicon com múltiplas definições para garantir compatibilidade */}
        <link rel="icon" href="/favicon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <DynamicTitle />
          <FriendsTitle />
          <TetoTitle />
          <AudioControls />
          <Link
            href="/friends"
            className="fixed top-2 right-2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-gray-600"
            aria-label="View friends"
          >
            <div className="w-8 h-8 animate-spin-slow">
              <img src="/favicon.png?v=2" alt="Friends" className="w-full h-full" />
            </div>
          </Link>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'