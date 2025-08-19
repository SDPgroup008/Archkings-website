"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Crown } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [adminClickCount, setAdminClickCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (adminClickCount > 0) {
      const timeout = setTimeout(() => {
        setAdminClickCount(0)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [adminClickCount])

  const handleAdminAccess = () => {
    const newCount = adminClickCount + 1
    setAdminClickCount(newCount)

    if (newCount >= 3) {
      router.push("/admin")
      setAdminClickCount(0)
    }
  }

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "glass-effect border-b border-primary/30" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-glow">
                <Crown className="text-primary-foreground h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse-gold"></div>
            </div>
            <span className="font-heading font-bold text-2xl gradient-text group-hover:scale-105 transition-transform">
              ArchKings
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="relative text-foreground hover:text-primary transition-all duration-300 font-medium text-lg group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            <button
              onClick={handleAdminAccess}
              className="flex items-center space-x-1 opacity-20 hover:opacity-40 transition-opacity duration-300"
              title={`Click ${3 - adminClickCount} more times`}
            >
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
            </button>

            <Button
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground px-8 py-3 text-lg font-semibold animate-glow hover-lift royal-border"
            >
              Get Royal Quote
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/20 hover-glow"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="text-primary" /> : <Menu className="text-primary" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-primary/30 animate-fade-in">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}

              <button
                onClick={() => {
                  handleAdminAccess()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-center w-full px-4 py-3 opacity-20 hover:opacity-40 transition-opacity duration-300"
              >
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
              </button>

              <div className="px-4 py-3">
                <Button
                  onClick={(e) => handleSmoothScroll(e, "#contact")}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground animate-glow"
                >
                  Get Royal Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
