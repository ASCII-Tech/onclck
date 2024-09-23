'use client'
'use strict'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function SignupPageComponent() {
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address'
    if (formData.businessName.length < 2) newErrors.businessName = 'Business name is too short'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number (10 digits required)'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            businessName: formData.businessName,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log('Signup successful:', data);
          // Here you might want to redirect the user or show a success message
        } else {
          setErrors({ submit: data.message || 'An error occurred during signup' });
        }
      } catch (error) {
        console.error('Signup error:', error);
        setErrors({ submit: 'An error occurred during signup' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <p className="px-6 py-1 text-left text-sm text-muted-foreground">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80" prefetch={false}>
              Sign in
            </Link>
          </p>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                name="businessName" 
                placeholder="Your Business Name" 
                value={formData.businessName}
                onChange={handleChange}
                required
              />
              {errors.businessName && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.businessName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.confirmPassword}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                name="phoneNumber" 
                type="tel" 
                placeholder="1234567890" 
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.phoneNumber}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </CardFooter>
          {errors.submit && (
            <p className="text-sm text-red-500 flex items-center justify-center mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />{errors.submit}
            </p>
          )}
        </form>
      </Card>
    </div>
  )
}

export default SignupPageComponent;