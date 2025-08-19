import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "News", href: "/news" },
    ],
    services: [
      { label: "Architectural Drawings", href: "/services#architectural" },
      { label: "Structural Engineering", href: "/services#structural" },
      { label: "Consultation", href: "/services#consultation" },
      { label: "Full Construction", href: "/services#construction" },
    ],
    projects: [
      { label: "Residential", href: "/projects?category=residential" },
      { label: "Commercial", href: "/projects?category=commercial" },
      { label: "Industrial", href: "/projects?category=industrial" },
      { label: "Portfolio", href: "/projects" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <span className="font-heading font-bold text-2xl text-foreground">ArchKings</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Building the future with precision and innovation. Your trusted partner for exceptional construction and
              architectural solutions in Uganda.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 705 928 046</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>reinolmartin0001@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects Links */}
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-6">Projects</h3>
            <ul className="space-y-3">
              {footerLinks.projects.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm">
                © {currentYear} ArchKings Construction. All rights reserved.
              </p>
              <p className="text-primary text-sm font-medium mt-1">Precision in Every Structure</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
