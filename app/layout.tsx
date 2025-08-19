import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "ArchKings Construction - Building the Future with Precision & Innovation",
  description:
    "Professional construction services including architectural drawings, structural & M&E drawings, consultation, BOQ generation, and full construction. Precision in every structure.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
