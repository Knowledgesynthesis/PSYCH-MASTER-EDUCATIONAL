import { create } from 'zustand'
import { safeStorage } from '../lib/storage'

export type ThemePref = 'light' | 'dark' | 'system'

const KEY = 'pm-theme'

function read(): ThemePref {
  const v = safeStorage.getItem(KEY)
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

export function resolveDark(pref: ThemePref): boolean {
  if (pref === 'system') {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  }
  return pref === 'dark'
}

export function applyTheme(pref: ThemePref): void {
  document.documentElement.classList.toggle('dark', resolveDark(pref))
}

interface ThemeState {
  pref: ThemePref
  setPref: (p: ThemePref) => void
  cycle: () => void
}

export const useTheme = create<ThemeState>((set, get) => ({
  pref: read(),
  setPref: (pref) => {
    safeStorage.setItem(KEY, pref)
    applyTheme(pref)
    set({ pref })
  },
  cycle: () => {
    const order: ThemePref[] = ['system', 'light', 'dark']
    const next = order[(order.indexOf(get().pref) + 1) % order.length]
    get().setPref(next)
  },
}))
