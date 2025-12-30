'use client'

import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Cpu,
  Globe,
  Zap,
  Users
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPageComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">

      {/* --- Hero Section --- */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 blur-3xl"></div>

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            We Are <span className="text-primary">ASCII</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Crafting the architecture of tomorrow with code, creativity, and precision.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-20">

        {/* --- Mission Statement --- */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ASCII is a cutting-edge technology company specializing in innovative solutions for modern systems.
              We pride ourselves on transforming complex challenges into elegant, efficient solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our team of experts is dedicated to pushing the boundaries of what's possible in software development,
              data analysis, and system integration. At ASCII, we're not just coding; we're shaping the digital landscape
              to empower businesses and individuals alike.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                View Our Portfolio
              </Button>
              <Button size="lg" variant="outline">
                Join Our Team
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-border/50 flex items-center justify-center p-8 overflow-hidden">
            {/* Decorative abstract elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative grid grid-cols-2 gap-4 z-10">
              <Card className="bg-background/80 backdrop-blur border-none shadow-sm p-4 flex flex-col items-center text-center">
                <Cpu className="h-8 w-8 text-primary mb-2" />
                <span className="font-semibold">System Design</span>
              </Card>
              <Card className="bg-background/80 backdrop-blur border-none shadow-sm p-4 flex flex-col items-center text-center mt-8">
                <Globe className="h-8 w-8 text-secondary-foreground mb-2" />
                <span className="font-semibold">Global Scale</span>
              </Card>
              <Card className="bg-background/80 backdrop-blur border-none shadow-sm p-4 flex flex-col items-center text-center">
                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="font-semibold">Fast Delivery</span>
              </Card>
              <Card className="bg-background/80 backdrop-blur border-none shadow-sm p-4 flex flex-col items-center text-center mt-8">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <span className="font-semibold">User Centric</span>
              </Card>
            </div>
          </div>
        </div>

        <Separator />

        {/* --- Core Values --- */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Innovation", desc: "We constantly explore new technologies to stay ahead of the curve." },
              { title: "Integrity", desc: "Transparency and honesty are the foundations of our client relationships." },
              { title: "Excellence", desc: "We don't settle for good. We aim for perfection in every line of code." }
            ].map((item, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- Contact & Socials --- */}
        <section className="bg-muted/30 -mx-4 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 rounded-3xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">Contact Information</CardTitle>
                  <CardDescription>We'd love to hear from you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Mail className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@ascii.com" className="text-muted-foreground hover:text-primary transition-colors">info@ascii.com</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Phone className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">+251 911 234 567</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <MapPin className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Headquarters</p>
                      <p className="text-muted-foreground">Bole Medhanialem, Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Socials */}
              <Card className="shadow-md flex flex-col">
                <CardHeader>
                  <CardTitle className="text-primary">Follow Us</CardTitle>
                  <CardDescription>Stay updated with our latest news.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all" asChild>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-black hover:text-white hover:border-black transition-all" asChild>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 h-5 w-5" /> X (Twitter)
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all" asChild>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook className="mr-2 h-5 w-5" /> Facebook
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white hover:border-transparent transition-all" asChild>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-2 h-5 w-5" /> Instagram
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
