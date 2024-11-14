'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPageComponent() {
  const [userInfo, setUserInfo] = useState({
    companyName: 'ASCII',
    userName: 'John Doe',
    phoneNumber: '+1234567890',
    tinNumber: '123456789'
  })

  const [paymentMethods, setPaymentMethods] = useState([
    { name: 'TeleBirr', apiKey: '' },
    { name: 'CBE', apiKey: '' }
  ])

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  }

  const handlePaymentMethodChange = (index: number, apiKey: string) => {
    const updatedPaymentMethods = [...paymentMethods]
    updatedPaymentMethods[index].apiKey = apiKey
    setPaymentMethods(updatedPaymentMethods)
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle profile pic change logic here
    console.log('Profile pic changed:', e.target.files?.[0])
  }

  const handlePasswordChange = (oldPassword: string, newPassword: string) => {
    // Handle password change logic here
    console.log('Password changed:', { oldPassword, newPassword })
  }

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log('Account deleted')
  }

  return (
    <div className="container mx-auto py-10 px-20">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="user-info">
        <TabsList className="mb-4">
          <TabsTrigger value="user-info">User Information</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-info">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update your company and personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={userInfo.companyName}
                  onChange={handleUserInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={userInfo.userName}
                  onChange={handleUserInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userInfo.phoneNumber}
                  onChange={handleUserInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                  id="tinNumber"
                  name="tinNumber"
                  value={userInfo.tinNumber}
                  onChange={handleUserInfoChange}
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment method API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={method.name} className="space-y-2">
                  <Label htmlFor={`${method.name}-api-key`}>{method.name} API Key</Label>
                  <Input
                    id={`${method.name}-api-key`}
                    value={method.apiKey}
                    onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
                    type="password"
                  />
                </div>
              ))}
              <Button>Save API Keys</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
                  <Input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <Input type="password" placeholder="Old Password" className="mb-2" />
                <Input type="password" placeholder="New Password" className="mb-2" />
                <Input type="password" placeholder="Confirm New Password" className="mb-2" />
                <Button onClick={() => handlePasswordChange('oldPassword', 'newPassword')}>
                  Change Password
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}