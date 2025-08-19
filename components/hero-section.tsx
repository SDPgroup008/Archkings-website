"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Crown, Sparkles } from "lucide-react"
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
    title: "Royal Architecture Mastery",
    subtitle: "Where Luxury Meets Innovation in Every Structure We Create",
    description: "",
    backgroundImage: "/placeholder.svg?height=1080&width=1920",
    ctaText: "Begin Your Royal Journey",
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden geometric-bg">
        <div className="text-center">
          <Crown className="h-12 w-12 text-primary mx-auto animate-pulse-gold mb-4" />
          <div className="gradient-text text-xl">Loading Royal Experience...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(107, 70, 193, 0.3), rgba(0, 0, 0, 0.9)), url('${heroContent.backgroundImage}')`,
          }}
        />
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/30 rotate-45 animate-float"></div>
        <div
          className="absolute bottom-32 right-16 w-16 h-16 border-2 border-accent/30 rotate-12 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-12 h-12 border-2 border-secondary/30 rotate-45 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <Crown className="h-16 w-16 text-primary animate-pulse-gold mr-4" />
          <Sparkles className="h-8 w-8 text-accent animate-float" />
        </div>

        <h1 className="font-heading text-6xl md:text-8xl font-bold mb-8 leading-tight">
          <span className="gradient-text">{heroContent.title}</span>
        </h1>

        <p className="text-2xl md:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          {heroContent.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary via-secondary to-primary hover:from-secondary hover:via-primary hover:to-secondary text-primary-foreground px-12 py-6 text-xl font-bold animate-glow hover-lift royal-border"
          >
            <Crown className="mr-3 h-6 w-6" />
            {heroContent.ctaText}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="glass-effect border-primary/50 text-primary hover:bg-primary/20 px-12 py-6 text-xl font-semibold hover-lift bg-transparent"
          >
            <Play className="mr-3 h-6 w-6" />
            Royal Portfolio
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up">
          {[
            { number: "500+", label: "Royal Projects", icon: "👑" },
            { number: "15+", label: "Years of Excellence", icon: "⭐" },
            { number: "50+", label: "Master Craftsmen", icon: "🏗️" },
            { number: "100%", label: "Royal Satisfaction", icon: "💎" },
          ].map((stat, index) => (
            <div key={index} className="text-center glass-effect p-6 rounded-xl hover-lift">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-foreground/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-8 h-12 border-2 border-primary rounded-full flex justify-center glass-effect">
          <div className="w-2 h-4 bg-gradient-to-b from-primary to-accent rounded-full mt-2 animate-pulse-gold"></div>
        </div>
      </div>
    </section>
  )
}
