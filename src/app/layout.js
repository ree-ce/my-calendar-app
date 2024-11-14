'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const inter = Inter({ subsets: ['latin'] })

const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState(THEME_OPTIONS.SYSTEM)
  const [actualTheme, setActualTheme] = useState(THEME_OPTIONS.LIGHT)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateSystemTheme = (e) => {
      if (theme === THEME_OPTIONS.SYSTEM) {
        setActualTheme(e.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT)
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || THEME_OPTIONS.SYSTEM
    setTheme(savedTheme)

    if (savedTheme === THEME_OPTIONS.SYSTEM) {
      const isDark = mediaQuery.matches
      setActualTheme(isDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT)
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      setActualTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === THEME_OPTIONS.DARK)
    }

    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  useEffect(() => {
    if (theme === THEME_OPTIONS.SYSTEM) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setActualTheme(isDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT)
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      setActualTheme(theme)
      document.documentElement.classList.toggle('dark', theme === THEME_OPTIONS.DARK)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="fixed top-4 right-4 z-[100]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                {theme === THEME_OPTIONS.LIGHT && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {theme === THEME_OPTIONS.DARK && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {theme === THEME_OPTIONS.SYSTEM && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2">
              <DropdownMenuItem onClick={() => setTheme(THEME_OPTIONS.LIGHT)}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(THEME_OPTIONS.DARK)}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(THEME_OPTIONS.SYSTEM)}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-16">
          {children}
        </div>
      </body>
    </html>
  )
}