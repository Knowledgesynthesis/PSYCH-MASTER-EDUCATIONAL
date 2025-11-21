import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription } from '../components/Card'
import {
  Brain,
  Zap,
  Eye,
  Heart,
  Shield,
  Target,
  Pill,
  Users,
  ClipboardList,
  BookOpen,
  Settings
} from 'lucide-react'

export default function Home() {
  const modules = [
    {
      title: 'Major Depressive Disorder',
      description: 'Learn about MDD symptom clusters, duration requirements, and red flags',
      path: '/mdd',
      icon: Heart,
      color: 'text-blue-500',
    },
    {
      title: 'Bipolar Disorder',
      description: 'Distinguish between Bipolar I & II, mania vs hypomania',
      path: '/bipolar',
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      title: 'Schizophrenia & Psychosis',
      description: 'Positive vs negative symptoms and acute psychosis management',
      path: '/psychosis',
      icon: Eye,
      color: 'text-purple-500',
    },
    {
      title: 'Anxiety Disorders',
      description: 'GAD and Panic Disorder differentiation and assessment',
      path: '/anxiety',
      icon: Brain,
      color: 'text-green-500',
    },
    {
      title: 'PTSD',
      description: 'Trauma response patterns and cluster mapping',
      path: '/ptsd',
      icon: Shield,
      color: 'text-red-500',
    },
    {
      title: 'ADHD',
      description: 'Inattention vs hyperactivity domains and screening',
      path: '/adhd',
      icon: Target,
      color: 'text-orange-500',
    },
    {
      title: 'Substance Use Disorders',
      description: 'Alcohol and opioid withdrawal patterns and recognition',
      path: '/sud',
      icon: Pill,
      color: 'text-pink-500',
    },
    {
      title: 'Personality Disorders',
      description: 'Cluster A/B/C overview and trait recognition',
      path: '/personality',
      icon: Users,
      color: 'text-indigo-500',
    },
  ]

  const resources = [
    {
      title: 'Assessment',
      description: 'Test your knowledge with clinical vignettes',
      path: '/assessment',
      icon: ClipboardList,
    },
    {
      title: 'Glossary',
      description: 'Psychiatric terminology reference',
      path: '/glossary',
      icon: BookOpen,
    },
    {
      title: 'Settings',
      description: 'Customize your learning experience',
      path: '/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to Psych Master
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive psychiatric diagnostic and reasoning platform designed for medical students,
          residents, and healthcare professionals
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Educational Use Only:</strong> This platform is designed for learning and pattern recognition.
            Not intended for clinical diagnosis or treatment decisions.
          </p>
        </div>
      </div>

      {/* Main Modules */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Core Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.path} to={module.path}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <module.icon className={`h-8 w-8 ${module.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Resources</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((resource) => (
            <Link key={resource.path} to={resource.path}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <resource.icon className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
