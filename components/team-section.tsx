"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  imageUrl: string
  email?: string
  phone?: string
  specialties?: string[]
}

export function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Martin Reinol",
      position: "Founder & Lead Architect",
      imageUrl: "/placeholder.svg?height=300&width=300",
      bio: "With over 15 years of experience in architectural design and construction management, Martin leads our team with a vision for innovative and sustainable building solutions.",
      specialties: ["Architectural Design", "Project Management", "Sustainable Construction"],
      phone: "0705928046",
      email: "reinolmartin0001@gmail.com",
    },
    {
      id: "2",
      name: "Sarah Nakato",
      position: "Senior Structural Engineer",
      imageUrl: "/placeholder.svg?height=300&width=300",
      bio: "Sarah brings expertise in structural analysis and engineering design, ensuring every project meets the highest safety and quality standards.",
      specialties: ["Structural Engineering", "MEP Systems", "Code Compliance"],
      phone: "0742496889",
      email: "sarah.nakato@archkings.ug",
    },
    {
      id: "3",
      name: "David Mukasa",
      position: "Construction Manager",
      imageUrl: "/placeholder.svg?height=300&width=300",
      bio: "David oversees all construction operations with meticulous attention to detail, ensuring projects are delivered on time and within budget.",
      specialties: ["Construction Management", "Quality Control", "Site Supervision"],
      phone: "0701234567",
      email: "david.mukasa@archkings.ug",
    },
    {
      id: "4",
      name: "Grace Namuli",
      position: "Interior Design Specialist",
      imageUrl: "/placeholder.svg?height=300&width=300",
      bio: "Grace transforms spaces with creative interior solutions that blend functionality with aesthetic appeal, creating environments that inspire.",
      specialties: ["Interior Design", "Space Planning", "Material Selection"],
      phone: "0789012345",
      email: "grace.namuli@archkings.ug",
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const querySnapshot = await getDocs(collection(db, "archkings", "content", "team"))
        if (!querySnapshot.empty) {
          const teamData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as TeamMember[]
          setTeamMembers(teamData)
        }
      } catch (error) {
        console.error("Error loading team members:", error)
      }
      setLoading(false)
    }

    loadTeamMembers()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-primary">Loading team...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-card" id="team">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Meet Our Expert <span className="text-primary">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated professionals bring years of experience and passion to every project, ensuring exceptional
            results that exceed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={member.id}
              className="bg-background border-border hover-lift group overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.imageUrl || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.position}</p>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{member.bio}</p>

                {member.specialties && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <Badge key={specialtyIndex} variant="outline" className="border-primary/30 text-primary text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Contact</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 text-primary cursor-pointer hover:text-primary/80" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
