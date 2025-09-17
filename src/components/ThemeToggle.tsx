import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/zustand/store'

export const ThemeToggle = () => {
  const themeMode = useStore((state) => state.themeMode)
  const toggleTheme = useStore((state) => state.toggleTheme)

  const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button variant="outline" className="rounded-full px-3" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

export default ThemeToggle


