"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, MapPin } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Project {
  id: string
  title: string
  category: string
  location: string
  duration: string
  imageUrl?: string
  videoUrl?: string
  image?: string // Keep for fallback compatibility
  description: string
  status: string
}

export function ProjectsSection() {
  const [filter, setFilter] = useState("All")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!db) {
          console.log("[v0] Firebase not configured, using fallback projects")
          setProjects(fallbackProjects)
          setLoading(false)
          return
        }

        const projectsRef = collection(db, "archkings", "content", "projects")
        const snapshot = await getDocs(projectsRef)

        if (snapshot.empty) {
          console.log("[v0] No projects found in Firebase, using fallback")
          setProjects(fallbackProjects)
        } else {
          const projectsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[]
          console.log("[v0] Loaded projects from Firebase:", projectsData)
          setProjects(projectsData)
        }
      } catch (error) {
        console.error("[v0] Error fetching projects:", error)
        setProjects(fallbackProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const fallbackProjects: Project[] = [
    {
      id: "1",
      title: "Luxury Residential Complex",
      category: "Residential",
      location: "Kololo, Kampala",
      duration: "18 months",
      imageUrl: "/placeholder.svg?height=400&width=600",
      description:
        "A premium 50-unit residential complex featuring modern architecture and smart home technology in the heart of Kampala.",
      status: "Completed",
    },
    {
      id: "2",
      title: "Corporate Headquarters",
      category: "Commercial",
      location: "Nakasero, Kampala",
      duration: "24 months",
      imageUrl: "/placeholder.svg?height=400&width=600",
      description:
        "State-of-the-art corporate headquarters with sustainable design and advanced infrastructure in Uganda's business district.",
      status: "In Progress",
    },
    {
      id: "3",
      title: "Industrial Manufacturing Plant",
      category: "Industrial",
      location: "Jinja, Uganda",
      duration: "30 months",
      imageUrl: "/placeholder.svg?height=400&width=600",
      description:
        "Large-scale manufacturing facility with advanced automation and environmental controls in Uganda's industrial hub.",
      status: "Completed",
    },
    {
      id: "4",
      title: "Shopping Mall Complex",
      category: "Commercial",
      location: "Entebbe, Uganda",
      duration: "20 months",
      imageUrl: "/placeholder.svg?height=400&width=600",
      description:
        "Multi-level shopping and entertainment complex with innovative design and amenities near Uganda's international airport.",
      status: "Planning",
    },
  ]

  const categories = ["All", "Residential", "Commercial", "Industrial"]
  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter)

  if (loading) {
    return (
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our portfolio of exceptional construction projects across Uganda that showcase our commitment to
            quality, innovation, and architectural excellence.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className={
                  filter === category
                    ? "bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className="bg-background border-border hover-lift group overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                {project.videoUrl ? (
                  <video
                    src={project.videoUrl}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    controls
                    poster={project.imageUrl || "/placeholder.svg"}
                  />
                ) : (
                  <img
                    src={project.imageUrl || project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      project.status === "Completed"
                        ? "default"
                        : project.status === "In Progress"
                          ? "secondary"
                          : "outline"
                    }
                    className="bg-primary text-primary-foreground"
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-primary text-primary">
                    {project.category}
                  </Badge>
                </div>

                <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                <div className="flex items-center gap-4 text-sm text-card-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    {project.duration}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold hover-lift"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
