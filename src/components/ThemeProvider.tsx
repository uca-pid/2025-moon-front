import { useEffect, useMemo } from 'react'
import { useStore } from '@/zustand/store'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useStore((state) => state.themeMode)

  const resolvedDark = useMemo(() => {
    if (themeMode === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return themeMode === 'dark'
  }, [themeMode])

  useEffect(() => {
    const root = document.documentElement
    if (resolvedDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [resolvedDark])

  useEffect(() => {
    if (themeMode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const root = document.documentElement
      if (mq.matches) root.classList.add('dark')
      else root.classList.remove('dark')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [themeMode])

  return <>{children}</>
}

export default ThemeProvider


