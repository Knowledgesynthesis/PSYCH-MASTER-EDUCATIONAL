import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import { MODULES } from './content'

const ModulePage = lazy(() => import('./pages/ModulePage'))
const Practice = lazy(() => import('./pages/Practice'))
const Review = lazy(() => import('./pages/Review'))
const Tools = lazy(() => import('./pages/Tools'))
const ToolPage = lazy(() => import('./pages/ToolPage'))
const Glossary = lazy(() => import('./pages/Glossary'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {MODULES.map((m) => (
              <Route key={m.id} path={`/${m.slug}`} element={<ModulePage module={m} />} />
            ))}
            <Route path="/practice" element={<Practice />} />
            <Route path="/assessment" element={<Navigate to="/practice" replace />} />
            <Route path="/review" element={<Review />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Navigate to="/about#settings" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
