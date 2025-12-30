"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Package2,
  Home,
  Settings,
  LogOut,
  Moon,
  Sun,
  Check,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Theme Toggle Component ---
function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- The Navbar Component ---
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package2 },
    { name: "Orders", href: "/orders", icon: Check },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About us", href: "/about-us", icon: Info },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              ASCII Store
            </span>
            {/* Shortened logo for very small screens */}
            <span className="text-xl font-bold tracking-tight sm:hidden">
              ASCII
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User / Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Actions (Toggle + Menu Button) */}
          <div className="-mr-2 flex items-center gap-2 md:hidden">
            <ModeToggle /> {/* Visible on mobile header for easy access */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background animate-in slide-in-from-top-5">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- The Wrapper Logic ---
const NavbarWrapper = () => {
  const pathname = usePathname();

  // Excluded routes
  const excludedRoutes = [
    "/login",
    "/register",
    "/404",
    "/product",
    "/signup",
    "/transaction",
    "/transaction/orderSummary",
    "/invoice",
    "/qr",
  ];

  const excludedPatterns = [/^\/product\/[^/]+$/];

  const isExcludedRoute = excludedRoutes.includes(pathname);
  const isExcludedPattern = excludedPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (isExcludedRoute || isExcludedPattern) {
    return null;
  }

  return <Navbar />;
};

export default NavbarWrapper;
