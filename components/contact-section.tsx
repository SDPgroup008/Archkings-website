"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

interface ContactInfo {
  email: string
  phone1: string
  phone2: string
  address: string
  businessHours: string
  emergencyContact?: string
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "reinolmartin0001@gmail.com",
    phone1: "+256 705 928 046",
    phone2: "+256 742 496 889",
    address: "Plot 123, Construction Avenue, Kampala, Uganda",
    businessHours: "Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadContactInfo = async () => {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const querySnapshot = await getDocs(collection(db, "archkings", "content", "contact"))
        if (!querySnapshot.empty) {
          const contactData = querySnapshot.docs[0].data() as ContactInfo
          setContactInfo(contactData)
        }
      } catch (error) {
        console.error("Error loading contact info:", error)
      }
      setLoading(false)
    }

    loadContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (isFirebaseConfigured()) {
        await addDoc(collection(db, "archkings", "content", "messages"), {
          ...formData,
          submittedAt: new Date(),
          status: "new",
        })
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "reinolmartin0001@gmail.com",
          subject: `New Contact Form Submission from ${formData.name}`,
          message: `
            Name: ${formData.name}
            Email: ${formData.email}
            Phone: ${formData.phone}
            
            Message:
            ${formData.message}
          `,
        }),
      })

      if (response.ok) {
        alert("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Message saved locally. Email functionality requires server setup.")
    }
    setSubmitting(false)
  }

  const contactInfoItems = [
    {
      icon: Phone,
      title: "Phone",
      details: [contactInfo.phone1, contactInfo.phone2],
    },
    {
      icon: Mail,
      title: "Email",
      details: [contactInfo.email, "info@archkings.ug"],
    },
    {
      icon: MapPin,
      title: "Address",
      details: contactInfo.address.split(", "),
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: contactInfo.businessHours.split(", "),
    },
  ]

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-primary">Loading contact information...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4" id="contact">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Build Your <span className="text-primary">Vision</span> Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next construction project in Uganda? Get in touch with our expert team for a
            consultation and detailed project proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card border-border animate-slide-up">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-foreground">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <Input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />

                <Textarea
                  placeholder="Tell us about your project..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                  required
                />

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold animate-glow"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {contactInfoItems.map((info, index) => (
              <Card key={index} className="bg-card border-border hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map Placeholder */}
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Kampala, Uganda</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
