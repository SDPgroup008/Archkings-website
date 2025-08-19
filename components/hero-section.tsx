"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  mediaUrl: string
  mediaType: "image" | "video"
  ctaText: string
  ctaLink: string
}

export function HeroSection() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: "1",
      title: "Royal Architecture Mastery",
      subtitle: "Where Luxury Meets Innovation in Every Structure We Create",
      description: "",
      mediaUrl: "/placeholder.svg?height=1080&width=1920",
      mediaType: "image",
      ctaText: "Begin Your Royal Journey",
      ctaLink: "#services",
    },
    {
      id: "2",
      title: "Crafting Architectural Excellence",
      subtitle: "Transforming Visions into Magnificent Realities",
      description: "",
      mediaUrl: "/placeholder.svg?height=1080&width=1920",
      mediaType: "image",
      ctaText: "Explore Our Mastery",
      ctaLink: "#projects",
    },
    {
      id: "3",
      title: "Building Tomorrow's Landmarks",
      subtitle: "Where Innovation Meets Timeless Design",
      description: "",
      mediaUrl: "/placeholder.svg?height=1080&width=1920",
      mediaType: "image",
      ctaText: "Start Your Project",
      ctaLink: "#contact",
    },
  ])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHeroContent = async () => {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const heroDoc = await getDocs(collection(db, "archkings", "content", "hero"))
        if (!heroDoc.empty) {
          const heroData = heroDoc.docs[0].data()
          const slide: HeroSlide = {
            id: "main",
            title: heroData.title || "Royal Architecture Mastery",
            subtitle: heroData.subtitle || "Where Luxury Meets Innovation in Every Structure We Create",
            description: heroData.description || "",
            mediaUrl:
              heroData.mediaType === "video"
                ? heroData.backgroundVideo
                : heroData.backgroundImage || "/placeholder.svg?height=1080&width=1920",
            mediaType: heroData.mediaType || "image",
            ctaText: heroData.ctaText || "Begin Your Royal Journey",
            ctaLink: heroData.ctaLink || "#services",
          }
          setHeroSlides([slide])
        }
      } catch (error) {
        console.error("Error loading hero content:", error)
      }
      setLoading(false)
    }

    loadHeroContent()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

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

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {currentSlideData.mediaType === "video" ? (
          <video key={currentSlideData.id} autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src={currentSlideData.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{
              backgroundImage: `url('${currentSlideData.mediaUrl}')`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-purple-900/30 to-black/90"></div>

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

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 glass-effect p-3 rounded-full hover:bg-primary/20 transition-all duration-300 hover-lift"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 glass-effect p-3 rounded-full hover:bg-primary/20 transition-all duration-300 hover-lift"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <Crown className="h-16 w-16 text-primary animate-pulse-gold mr-4" />
          <Sparkles className="h-8 w-8 text-accent animate-float" />
        </div>

        <h1 className="font-heading text-6xl md:text-8xl font-bold mb-8 leading-tight">
          <span className="gradient-text">{currentSlideData.title}</span>
        </h1>

        <p className="text-2xl md:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          {currentSlideData.subtitle}
        </p>

        <div className="flex justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary via-secondary to-primary hover:from-secondary hover:via-primary hover:to-secondary text-primary-foreground px-12 py-6 text-xl font-bold animate-glow hover-lift royal-border"
          >
            <Crown className="mr-3 h-6 w-6" />
            {currentSlideData.ctaText}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center space-x-3 mb-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary animate-pulse-gold" : "bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
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
