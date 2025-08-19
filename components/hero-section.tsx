"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface HeroContent {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
}

export function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Building the Future with Precision & Innovation",
    subtitle:
      "ArchKings Construction delivers world-class architectural solutions, structural engineering, and premium construction services that exceed expectations.",
    description: "",
    backgroundImage: "/placeholder.svg?height=1080&width=1920",
    ctaText: "Explore Our Services",
    ctaLink: "#services",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHeroContent = async () => {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const querySnapshot = await getDocs(collection(db, "archkings", "content", "hero"))
        if (!querySnapshot.empty) {
          const heroData = querySnapshot.docs[0].data() as HeroContent
          setHeroContent(heroData)
        }
      } catch (error) {
        console.error("Error loading hero content:", error)
      }
      setLoading(false)
    }

    loadHeroContent()
  }, [])

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center text-primary">Loading...</div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat parallax-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)), url('${heroContent.backgroundImage}')`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          {heroContent.title}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {heroContent.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold animate-glow hover-lift"
          >
            {heroContent.ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift bg-transparent"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Our Story
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-slide-up">
          {[
            { number: "500+", label: "Projects Completed" },
            { number: "15+", label: "Years Experience" },
            { number: "50+", label: "Expert Team" },
            { number: "100%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
