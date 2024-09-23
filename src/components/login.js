"use client"
import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import from 'next/navigation'

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful
        console.log('Login successful', data);
        // Here you might want to store the user's ID in localStorage or a state management solution
        // localStorage.setItem('userId', data.userId);
        
        // Redirect to the dashboard or homepage after successful login
        router.push('/');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80" prefetch={false}>
              Sign up
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email address
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                Password
              </Label>
              <div className="text-sm">
                <Link href="#" className="font-medium text-primary hover:text-primary/80" prefetch={false}>
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;

