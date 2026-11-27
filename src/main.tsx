import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyTheme, useTheme } from './store/theme'
import './index.css'

applyTheme(useTheme.getState().pref)
try {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useTheme.getState().pref === 'system') applyTheme('system')
  })
} catch {
  /* older browsers */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
