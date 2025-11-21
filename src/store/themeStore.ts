import { create } from 'zustand'

interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme-storage')
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  }
  return 'light'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-storage', newTheme)
      }
      return { theme: newTheme }
    }),
}))
