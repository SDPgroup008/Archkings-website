"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DraftingCompassIcon as Drafting, Building, Calculator, Wrench } from "lucide-react"
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
      title: "Architectural Drawings",
      description:
        "Comprehensive architectural plans and designs that bring your vision to life with precision and creativity.",
      features: ["3D Modeling", "Floor Plans", "Elevation Drawings", "Interior Design"],
    },
    {
      id: "2",
      icon: "Building",
      title: "Structural & M&E Drawings",
      description: "Expert structural and mechanical/electrical engineering drawings ensuring safety and efficiency.",
      features: ["Structural Analysis", "MEP Systems", "Load Calculations", "Code Compliance"],
    },
    {
      id: "3",
      icon: "Calculator",
      title: "Consultation & BOQ",
      description: "Professional consultation services with accurate Bill of Quantities for precise project planning.",
      features: ["Cost Estimation", "Material Planning", "Project Timeline", "Risk Assessment"],
    },
    {
      id: "4",
      icon: "Wrench",
      title: "Full Construction",
      description: "End-to-end construction services from foundation to finishing with uncompromising quality.",
      features: ["Project Management", "Quality Control", "Timeline Delivery", "Warranty Support"],
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-primary">Loading services...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4" id="services">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive construction solutions tailored to meet your unique requirements with precision, innovation,
            and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon)
            return (
              <Card
                key={service.id}
                className="bg-card border-border hover-lift group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-card-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    Learn More
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
