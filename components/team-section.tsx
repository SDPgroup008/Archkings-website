"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail, Crown, Star } from "lucide-react"
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
      position: "Royal Founder & Master Architect",
      imageUrl: "/placeholder.svg?height=400&width=400",
      bio: "With over 15 years of royal architectural mastery, Martin leads our kingdom of builders with a vision for innovative and majestic building solutions that stand as monuments to excellence.",
      specialties: ["Royal Architectural Design", "Imperial Project Management", "Sustainable Palace Construction"],
      phone: "0705928046",
      email: "reinolmartin0001@gmail.com",
    },
    {
      id: "2",
      name: "Sarah Nakato",
      position: "Crown Structural Engineer",
      imageUrl: "/placeholder.svg?height=400&width=400",
      bio: "Sarah brings royal expertise in structural analysis and engineering design, ensuring every palace meets the highest standards of safety and architectural grandeur.",
      specialties: ["Imperial Structural Engineering", "Royal MEP Systems", "Crown Code Compliance"],
      phone: "0742496889",
      email: "sarah.nakato@archkings.ug",
    },
    {
      id: "3",
      name: "David Mukasa",
      position: "Royal Construction Commander",
      imageUrl: "/placeholder.svg?height=400&width=400",
      bio: "David oversees all royal construction operations with meticulous attention to detail, ensuring palaces are delivered on time and within the royal budget.",
      specialties: ["Royal Construction Management", "Crown Quality Control", "Imperial Site Supervision"],
      phone: "0701234567",
      email: "david.mukasa@archkings.ug",
    },
    {
      id: "4",
      name: "Grace Namuli",
      position: "Royal Interior Design Specialist",
      imageUrl: "/placeholder.svg?height=400&width=400",
      bio: "Grace transforms spaces into royal chambers with creative interior solutions that blend functionality with palatial appeal, creating environments fit for royalty.",
      specialties: ["Royal Interior Design", "Palace Space Planning", "Luxury Material Selection"],
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
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto max-w-6xl text-center">
          <Crown className="h-12 w-12 text-primary mx-auto animate-pulse-gold mb-4" />
          <div className="gradient-text text-xl">Assembling Royal Court...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-card/50 to-background" id="team">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-primary mr-4 animate-pulse-gold" />
            <Star className="h-8 w-8 text-accent animate-float" />
          </div>
          <h2 className="font-heading text-5xl md:text-7xl font-bold mb-8">
            Meet Our Royal <span className="gradient-text">Court</span>
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Our distinguished council of master craftsmen and royal architects bring decades of excellence and passion
            to every palatial project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={member.id}
              className="glass-effect border-primary/30 hover-lift group overflow-hidden animate-slide-up relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute top-4 right-4 z-10">
                <Crown className="h-6 w-6 text-primary animate-pulse-gold" />
              </div>

              <div className="relative overflow-hidden">
                <img
                  src={member.imageUrl || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/20 opacity-20" />
              </div>

              <CardContent className="p-6 relative">
                <h3 className="font-heading text-2xl font-bold gradient-text mb-2 group-hover:scale-105 transition-transform">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold mb-4 text-lg">{member.position}</p>

                <p className="text-foreground/80 text-sm mb-6 leading-relaxed">{member.bio}</p>

                {member.specialties && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.specialties.map((specialty, specialtyIndex) => (
                      <Badge
                        key={specialtyIndex}
                        className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 text-primary text-xs hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all duration-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-primary/30">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-primary animate-pulse-gold" />
                    <span className="text-sm text-foreground/80 font-medium">Royal Contact</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-accent cursor-pointer hover:text-primary hover:scale-110 transition-all duration-300" />
                    <Star className="h-4 w-4 text-secondary animate-float" />
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
