'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'



import { BarChartIcon, LayoutGridIcon, PackageIcon, PlusIcon, InfoIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react'

const navItems = [
  { href: '/', icon: BarChartIcon, label: 'Analysis' },
  { href: '/orders', icon: LayoutGridIcon, label: 'Orders' },
  { href: '/product-list', icon: PackageIcon, label: 'Products' },
  { href: '/addproduct', icon: PlusIcon, label: 'Add Product' },
  { href: '/about', icon: InfoIcon, label: 'About' },
  { href: '/settings', icon: SettingsIcon, label: 'Settings' },
]

export function Sidebar() {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebar = {
    open: {
      width: isMobile ? '100%' : '3.5rem',
      transition: { type: 'spring', stiffness: 400, damping: 40 }
    },
    closed: {
      width: '0',
      transition: { type: 'spring', stiffness: 400, damping: 40 }
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 sm:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <AnimatePresence>
        <motion.aside
          initial={false}
          animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
          variants={sidebar}
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background',
            isMobile && !isOpen && 'hidden'
          )}
        >
          <ScrollArea className="flex-grow">
            <nav className="flex flex-col items-start gap-6 p-3 py-20">
              <TooltipProvider>

                {/* Add Theme Toggle with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "w-full",
                      !isMobile && "flex justify-center"
                    )}>
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  {!isMobile && (
                    <TooltipContent side="right">Toggle theme</TooltipContent>
                  )}
                </Tooltip>
                
                {navItems.map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        size={isMobile ? "default" : "icon"}
                        className={cn(
                          "w-full",
                          isMobile && "justify-start"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="h-5 w-5" />
                        {isMobile && <span className="ml-2">{item.label}</span>}
                        {!isMobile && <span className="sr-only">{item.label}</span>}
                      </Button>
                    </TooltipTrigger>
                    {!isMobile && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </ScrollArea>
        </motion.aside>
      </AnimatePresence>
    </>
  )
}

export default Sidebar