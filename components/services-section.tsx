"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DraftingCompassIcon as Drafting, Building, Calculator, Wrench, Crown, Sparkles } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      icon: "Drafting",
      title: "Royal Architectural Design",
      description:
        "Majestic architectural plans that transform your vision into palatial reality with unmatched precision and royal elegance.",
      features: ["3D Royal Modeling", "Luxury Floor Plans", "Regal Elevation Drawings", "Palace Interior Design"],
    },
    {
      id: "2",
      icon: "Building",
      title: "Imperial Structural Engineering",
      description:
        "Expert structural and MEP engineering that ensures your castle stands strong for generations with royal-grade safety.",
      features: ["Fortress-Grade Analysis", "Royal MEP Systems", "Crown Load Calculations", "Imperial Code Compliance"],
    },
    {
      id: "3",
      icon: "Calculator",
      title: "Royal Consultation & BOQ",
      description:
        "Premium consultation services with precise cost estimation fit for kings, ensuring your royal budget is optimized.",
      features: ["Crown Cost Estimation", "Royal Material Planning", "Imperial Timeline", "Risk Assessment"],
    },
    {
      id: "4",
      icon: "Wrench",
      title: "Full Royal Construction",
      description:
        "End-to-end construction services that build palaces, not just buildings, with uncompromising royal quality.",
      features: [
        "Royal Project Management",
        "Crown Quality Control",
        "Imperial Timeline Delivery",
        "Lifetime Royal Warranty",
      ],
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const querySnapshot = await getDocs(collection(db, "archkings", "content", "services"))
        if (!querySnapshot.empty) {
          const servicesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Service[]
          setServices(servicesData)
        }
      } catch (error) {
        console.error("Error loading services:", error)
      }
      setLoading(false)
    }

    loadServices()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Building":
        return Building
      case "Calculator":
        return Calculator
      case "Wrench":
        return Wrench
      default:
        return Drafting
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-4 geometric-bg">
        <div className="container mx-auto max-w-6xl text-center">
          <Crown className="h-12 w-12 text-primary mx-auto animate-pulse-gold mb-4" />
          <div className="gradient-text text-xl">Loading Royal Services...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 geometric-bg" id="services">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-primary mr-4 animate-pulse-gold" />
            <Sparkles className="h-8 w-8 text-accent animate-float" />
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold mb-8">
            Our Royal <span className="gradient-text">Services</span>
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Comprehensive construction solutions crafted with royal precision, innovation, and excellence that befits
            true architectural royalty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon)
            return (
              <Card
                key={service.id}
                className="glass-effect border-primary/30 hover-lift group cursor-pointer animate-slide-up overflow-hidden relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/20 to-transparent"></div>

                <CardHeader className="pb-6">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-glow">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    <Crown className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse-gold" />
                  </div>
                  <CardTitle className="text-3xl font-heading gradient-text group-hover:scale-105 transition-transform duration-300 mb-4">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/80 text-lg leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-foreground/90">
                        <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full mr-4 animate-pulse-gold"></div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all duration-300 hover-lift">
                    <Crown className="mr-2 h-4 w-4" />
                    Discover Royal Details
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
