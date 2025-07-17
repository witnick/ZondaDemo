"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // avoid hydration mismatch
  }

  return (
    <div className="flex items-center gap-2 px-4">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="bg-gray-200 data-[state=checked]:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"
      />
      <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
    </div>
  )
} 