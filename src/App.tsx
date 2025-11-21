import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import MDD from './pages/MDD'
import Bipolar from './pages/Bipolar'
import Psychosis from './pages/Psychosis'
import Anxiety from './pages/Anxiety'
import PTSD from './pages/PTSD'
import ADHD from './pages/ADHD'
import SUD from './pages/SUD'
import Personality from './pages/Personality'
import Assessment from './pages/Assessment'
import Glossary from './pages/Glossary'
import Settings from './pages/Settings'
import { useEffect } from 'react'

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mdd" element={<MDD />} />
          <Route path="/bipolar" element={<Bipolar />} />
          <Route path="/psychosis" element={<Psychosis />} />
          <Route path="/anxiety" element={<Anxiety />} />
          <Route path="/ptsd" element={<PTSD />} />
          <Route path="/adhd" element={<ADHD />} />
          <Route path="/sud" element={<SUD />} />
          <Route path="/personality" element={<Personality />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
