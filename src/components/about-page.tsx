'use client'

import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPageComponent() {
  return (
    <div className="min-h-screen px-20 bg-gradient-to-br from-background to-secondary/20">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            About ASCII
          </h1>
          
          <Card className="mb-12 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-2xl font-semibold">Crafting the Future of Technology</p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-lg mb-4">
                ASCII is a cutting-edge technology company specializing in innovative solutions for modern systems. 
                We pride ourselves on transforming complex challenges into elegant, efficient solutions.
              </p>
              <p className="text-lg">
                Our team of experts is dedicated to pushing the boundaries of what's possible in software development, 
                data analysis, and system integration. At ASCII, we're not just coding; we're shaping the digital landscape.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
                <div className="space-y-4">
                  <p className="flex items-center">
                    <Mail className="mr-3 text-primary" size={24} />
                    <a href="mailto:info@ascii.com" className="hover:underline">info@ascii.com</a>
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-3 text-primary" size={24} />
                    <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-3 text-primary" size={24} />
                    <span>123 Tech Avenue, Silicon Valley, CA 94000</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Connect With Us</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://linkedin.com/company/ascii" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Linkedin size={20} className="mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://twitter.com/ascii" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Twitter size={20} className="mr-2" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://facebook.com/ascii" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Facebook size={20} className="mr-2" />
                      Facebook
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://instagram.com/ascii" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Instagram size={20} className="mr-2" />
                      Instagram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}