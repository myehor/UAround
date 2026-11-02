import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { ThemeContext, type Theme } from './theme-context'

interface ThemeProviderProps {
  children: ReactNode
}

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem('uaround-theme')

  return savedTheme === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('uaround-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}