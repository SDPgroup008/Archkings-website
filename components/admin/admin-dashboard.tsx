"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Upload, AlertCircle, Home, Users, Settings, Phone, Briefcase } from "lucide-react"
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage, isFirebaseConfigured } from "@/lib/firebase"

interface Project {
  id: string
  title: string
  category: string
  location: string
  duration: string
  description: string
  imageUrl: string
  videoUrl?: string
  status: string
  createdAt: Date
}

interface NewsItem {
  id: string
  title: string
  content: string
  imageUrl: string
  videoUrl?: string
  publishDate: Date
  isPublished: boolean
}

interface HeroContent {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  imageUrl: string
  email?: string
  phone?: string
}

interface ContactInfo {
  email: string
  phone1: string
  phone2: string
  address: string
  businessHours: string
  emergencyContact?: string
}

export function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseConfigured, setFirebaseConfigured] = useState(false)

  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
    ctaText: "",
    ctaLink: "",
  })

  const [services, setServices] = useState<Service[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "reinolmartin0001@gmail.com",
    phone1: "0705928046",
    phone2: "0742496889",
    address: "Kampala, Uganda",
    businessHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    emergencyContact: "",
  })

  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "",
    location: "",
    duration: "",
    description: "",
    status: "Planning",
  })

  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    isPublished: false,
  })

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    icon: "",
    features: [""],
  })

  const [teamForm, setTeamForm] = useState({
    name: "",
    position: "",
    bio: "",
    email: "",
    phone: "",
  })

  const [selectedFiles, setSelectedFiles] = useState<{
    projectImage?: File
    projectVideo?: File
    newsImage?: File
    newsVideo?: File
    heroBackground?: File
    teamImage?: File
  }>({})

  useEffect(() => {
    const configured = isFirebaseConfigured()
    setFirebaseConfigured(configured)

    if (configured) {
      loadAllContent()
    }
  }, [])

  const loadAllContent = async () => {
    await Promise.all([
      loadProjects(),
      loadNews(),
      loadHeroContent(),
      loadServices(),
      loadTeamMembers(),
      loadContactInfo(),
    ])
  }

  const loadHeroContent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "hero"))
      if (!querySnapshot.empty) {
        const heroData = querySnapshot.docs[0].data() as HeroContent
        setHeroContent(heroData)
      }
    } catch (error) {
      console.error("Error loading hero content:", error)
    }
  }

  const loadServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "services"))
      const servicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]
      setServices(servicesData)
    } catch (error) {
      console.error("Error loading services:", error)
    }
  }

  const loadTeamMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "team"))
      const teamData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamMember[]
      setTeamMembers(teamData)
    } catch (error) {
      console.error("Error loading team members:", error)
    }
  }

  const loadContactInfo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "contact"))
      if (!querySnapshot.empty) {
        const contactData = querySnapshot.docs[0].data() as ContactInfo
        setContactInfo(contactData)
      }
    } catch (error) {
      console.error("Error loading contact info:", error)
    }
  }

  const loadProjects = async () => {
    if (!firebaseConfigured) return

    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "projects"))
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[]
      setProjects(projectsData)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const loadNews = async () => {
    if (!firebaseConfigured) return

    try {
      const querySnapshot = await getDocs(collection(db, "archkings", "content", "news"))
      const newsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NewsItem[]
      setNews(newsData)
    } catch (error) {
      console.error("Error loading news:", error)
    }
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  }

  const handleUpdateHero = async () => {
    setIsLoading(true)
    try {
      let backgroundImage = heroContent.backgroundImage

      if (selectedFiles.heroBackground) {
        backgroundImage = await uploadFile(selectedFiles.heroBackground, "archkings/hero/images")
      }

      const updatedHero = { ...heroContent, backgroundImage }
      await setDoc(doc(db, "archkings", "content", "hero", "main"), updatedHero)
      setHeroContent(updatedHero)
      setSelectedFiles({ ...selectedFiles, heroBackground: undefined })
    } catch (error) {
      console.error("Error updating hero:", error)
    }
    setIsLoading(false)
  }

  const handleAddService = async () => {
    if (!serviceForm.title || !serviceForm.description) return

    setIsLoading(true)
    try {
      await addDoc(collection(db, "archkings", "content", "services"), {
        ...serviceForm,
        features: serviceForm.features.filter((f) => f.trim() !== ""),
      })
      setServiceForm({ title: "", description: "", icon: "", features: [""] })
      loadServices()
    } catch (error) {
      console.error("Error adding service:", error)
    }
    setIsLoading(false)
  }

  const handleAddTeamMember = async () => {
    if (!teamForm.name || !teamForm.position) return

    setIsLoading(true)
    try {
      let imageUrl = ""

      if (selectedFiles.teamImage) {
        imageUrl = await uploadFile(selectedFiles.teamImage, "archkings/team/images")
      }

      await addDoc(collection(db, "archkings", "content", "team"), {
        ...teamForm,
        imageUrl,
      })
      setTeamForm({ name: "", position: "", bio: "", email: "", phone: "" })
      setSelectedFiles({ ...selectedFiles, teamImage: undefined })
      loadTeamMembers()
    } catch (error) {
      console.error("Error adding team member:", error)
    }
    setIsLoading(false)
  }

  const handleUpdateContact = async () => {
    setIsLoading(true)
    try {
      await setDoc(doc(db, "archkings", "content", "contact", "main"), contactInfo)
    } catch (error) {
      console.error("Error updating contact info:", error)
    }
    setIsLoading(false)
  }

  const handleAddProject = async () => {
    if (!firebaseConfigured) return

    setIsLoading(true)
    try {
      let imageUrl = ""
      let videoUrl = ""

      if (selectedFiles.projectImage) {
        imageUrl = await uploadFile(selectedFiles.projectImage, "archkings/projects/images")
      }

      if (selectedFiles.projectVideo) {
        videoUrl = await uploadFile(selectedFiles.projectVideo, "archkings/projects/videos")
      }

      await addDoc(collection(db, "archkings", "content", "projects"), {
        ...projectForm,
        imageUrl,
        videoUrl,
        createdAt: new Date(),
      })

      setProjectForm({
        title: "",
        category: "",
        location: "",
        duration: "",
        description: "",
        status: "Planning",
      })
      setSelectedFiles({})
      loadProjects()
    } catch (error) {
      console.error("Error adding project:", error)
    }
    setIsLoading(false)
  }

  const handleAddNews = async () => {
    if (!firebaseConfigured) return

    setIsLoading(true)
    try {
      let imageUrl = ""
      let videoUrl = ""

      if (selectedFiles.newsImage) {
        imageUrl = await uploadFile(selectedFiles.newsImage, "archkings/news/images")
      }

      if (selectedFiles.newsVideo) {
        videoUrl = await uploadFile(selectedFiles.newsVideo, "archkings/news/videos")
      }

      await addDoc(collection(db, "archkings", "content", "news"), {
        ...newsForm,
        imageUrl,
        videoUrl,
        publishDate: new Date(),
      })

      setNewsForm({
        title: "",
        content: "",
        isPublished: false,
      })
      setSelectedFiles({})
      loadNews()
    } catch (error) {
      console.error("Error adding news:", error)
    }
    setIsLoading(false)
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "archkings", "content", "projects", id))
        loadProjects()
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      try {
        await deleteDoc(doc(db, "archkings", "content", "news", id))
        loadNews()
      } catch (error) {
        console.error("Error deleting news:", error)
      }
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, "archkings", "content", "services", id))
        loadServices()
      } catch (error) {
        console.error("Error deleting service:", error)
      }
    }
  }

  const handleDeleteTeamMember = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteDoc(doc(db, "archkings", "content", "team", id))
        loadTeamMembers()
      } catch (error) {
        console.error("Error deleting team member:", error)
      }
    }
  }

  if (!firebaseConfigured) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertCircle className="h-5 w-5" />
                Firebase Configuration Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-orange-700 dark:text-orange-300">
              <p>To use the admin dashboard, you need to configure Firebase with your project credentials.</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Required Environment Variables:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                  <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                  <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                  <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                  <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                  <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Setup Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>
                    Create a Firebase project at{" "}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      console.firebase.google.com
                    </a>
                  </li>
                  <li>Enable Firestore Database and Storage in your Firebase project</li>
                  <li>Get your Firebase config from Project Settings → General → Your apps</li>
                  <li>Add the environment variables to your project</li>
                  <li>Restart your development server</li>
                </ol>
              </div>

              <p className="text-sm">
                Once configured, you'll be able to manage projects, upload images/videos, and publish news articles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">ArchKings Admin Dashboard</h1>
          <Button
            onClick={() => window.open("/", "_blank")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            View Website
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Hero Section Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero-title">Main Title</Label>
                    <Input
                      id="hero-title"
                      placeholder="Enter hero title"
                      value={heroContent.title}
                      onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      placeholder="Enter hero subtitle"
                      value={heroContent.subtitle}
                      onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero-description">Description</Label>
                  <Textarea
                    id="hero-description"
                    placeholder="Enter hero description"
                    value={heroContent.description}
                    onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero-cta-text">CTA Button Text</Label>
                    <Input
                      id="hero-cta-text"
                      placeholder="e.g., Get Started"
                      value={heroContent.ctaText}
                      onChange={(e) => setHeroContent({ ...heroContent, ctaText: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta-link">CTA Button Link</Label>
                    <Input
                      id="hero-cta-link"
                      placeholder="e.g., #contact"
                      value={heroContent.ctaLink}
                      onChange={(e) => setHeroContent({ ...heroContent, ctaLink: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero-background">Background Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="hero-background"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFiles({
                          ...selectedFiles,
                          heroBackground: e.target.files?.[0],
                        })
                      }
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Button
                  onClick={handleUpdateHero}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Updating Hero..." : "Update Hero Section"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-title">Service Title</Label>
                    <Input
                      id="service-title"
                      placeholder="Enter service title"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-icon">Icon Name</Label>
                    <Input
                      id="service-icon"
                      placeholder="e.g., Building, Hammer, etc."
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service-description">Service Description</Label>
                  <Textarea
                    id="service-description"
                    placeholder="Detailed service description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Service Features</Label>
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...serviceForm.features]
                          newFeatures[index] = e.target.value
                          setServiceForm({ ...serviceForm, features: newFeatures })
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = serviceForm.features.filter((_, i) => i !== index)
                          setServiceForm({ ...serviceForm, features: newFeatures })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setServiceForm({ ...serviceForm, features: [...serviceForm.features, ""] })}
                  >
                    Add Feature
                  </Button>
                </div>

                <Button
                  onClick={handleAddService}
                  disabled={isLoading || !serviceForm.title || !serviceForm.description}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Adding Service..." : "Add Service"}
                </Button>
              </CardContent>
            </Card>

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover-lift">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-1 text-sm mb-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Team Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team-name">Full Name</Label>
                    <Input
                      id="team-name"
                      placeholder="Enter full name"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-position">Position</Label>
                    <Input
                      id="team-position"
                      placeholder="e.g., Project Manager"
                      value={teamForm.position}
                      onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="team-bio">Bio/Description</Label>
                  <Textarea
                    id="team-bio"
                    placeholder="Short bio about the team member"
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team-email">Email (Optional)</Label>
                    <Input
                      id="team-email"
                      type="email"
                      placeholder="team.member@archkings.com"
                      value={teamForm.email}
                      onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-phone">Phone (Optional)</Label>
                    <Input
                      id="team-phone"
                      placeholder="e.g., 0705928046"
                      value={teamForm.phone}
                      onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="team-image">Profile Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="team-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFiles({
                          ...selectedFiles,
                          teamImage: e.target.files?.[0],
                        })
                      }
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Button
                  onClick={handleAddTeamMember}
                  disabled={isLoading || !teamForm.name || !teamForm.position}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Adding Team Member..." : "Add Team Member"}
                </Button>
              </CardContent>
            </Card>

            {/* Team Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover-lift">
                  <CardContent className="p-4 text-center">
                    {member.imageUrl && (
                      <img
                        src={member.imageUrl || "/placeholder.svg"}
                        alt={member.name}
                        className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.position}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    {(member.email || member.phone) && (
                      <div className="text-xs text-muted-foreground mb-4">
                        {member.email && <p>{member.email}</p>}
                        {member.phone && <p>{member.phone}</p>}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteTeamMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      placeholder="Enter project title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-category">Category</Label>
                    <Select
                      value={projectForm.category}
                      onValueChange={(value) => setProjectForm({ ...projectForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="project-location">Location</Label>
                    <Input
                      id="project-location"
                      placeholder="e.g., Kampala, Uganda"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-duration">Duration</Label>
                    <Input
                      id="project-duration"
                      placeholder="e.g., 18 months"
                      value={projectForm.duration}
                      onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="project-description">Project Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Detailed project description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="project-status">Status</Label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-image">Project Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="project-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            projectImage: e.target.files?.[0],
                          })
                        }
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="project-video">Project Video (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="project-video"
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            projectVideo: e.target.files?.[0],
                          })
                        }
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddProject}
                  disabled={isLoading || !projectForm.title || !projectForm.category}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Adding Project..." : "Add Project"}
                </Button>
              </CardContent>
            </Card>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover-lift">
                  <CardContent className="p-4">
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p>Category: {project.category}</p>
                      <p>Location: {project.location}</p>
                      <p>Duration: {project.duration}</p>
                    </div>
                    <Badge variant="outline" className="mb-4">
                      {project.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* News Management */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add News Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="news-title">News Title</Label>
                  <Input
                    id="news-title"
                    placeholder="Enter news title"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="news-content">News Content</Label>
                  <Textarea
                    id="news-content"
                    placeholder="Write your news article content here..."
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="news-image">Featured Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="news-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            newsImage: e.target.files?.[0],
                          })
                        }
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="news-video">Featured Video (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="news-video"
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            newsVideo: e.target.files?.[0],
                          })
                        }
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={newsForm.isPublished}
                    onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>

                <Button
                  onClick={handleAddNews}
                  disabled={isLoading || !newsForm.title || !newsForm.content}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Adding News..." : "Add News Article"}
                </Button>
              </CardContent>
            </Card>

            {/* News List */}
            <div className="space-y-4">
              {news.map((article) => (
                <Card key={article.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{article.content}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant={article.isPublished ? "default" : "secondary"}>
                            {article.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {article.publishDate?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteNews(article.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-email">Primary Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="company@archkings.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone1">Primary Phone</Label>
                    <Input
                      id="contact-phone1"
                      placeholder="0705928046"
                      value={contactInfo.phone1}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone1: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-phone2">Secondary Phone</Label>
                    <Input
                      id="contact-phone2"
                      placeholder="0742496889"
                      value={contactInfo.phone2}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-emergency">Emergency Contact (Optional)</Label>
                    <Input
                      id="contact-emergency"
                      placeholder="Emergency contact number"
                      value={contactInfo.emergencyContact || ""}
                      onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-address">Business Address</Label>
                  <Textarea
                    id="contact-address"
                    placeholder="Full business address"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-hours">Business Hours</Label>
                  <Textarea
                    id="contact-hours"
                    placeholder="e.g., Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
                    value={contactInfo.businessHours}
                    onChange={(e) => setContactInfo({ ...contactInfo, businessHours: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleUpdateContact}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? "Updating Contact Info..." : "Update Contact Information"}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <strong>Email:</strong> {contactInfo.email}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Phone 1:</strong> {contactInfo.phone1}
                </div>
                <div className="flex items-center gap-2">
                  <strong>Phone 2:</strong> {contactInfo.phone2}
                </div>
                {contactInfo.emergencyContact && (
                  <div className="flex items-center gap-2">
                    <strong>Emergency:</strong> {contactInfo.emergencyContact}
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <strong>Address:</strong>
                  <span className="whitespace-pre-line">{contactInfo.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <strong>Hours:</strong>
                  <span className="whitespace-pre-line">{contactInfo.businessHours}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
