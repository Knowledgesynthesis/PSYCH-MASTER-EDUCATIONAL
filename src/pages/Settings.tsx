import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { useThemeStore } from '../store/themeStore'
import { Settings as SettingsIcon, Sun, Moon, Info, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <SettingsIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Customize your learning experience
        </p>
      </div>

      {/* Theme Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Currently using {theme === 'dark' ? 'dark' : 'light'} mode
                </p>
              </div>
            </div>
            <Button onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About the App */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-primary mt-1" />
            <div>
              <CardTitle>About Psych Master</CardTitle>
              <CardDescription>Educational psychiatric learning platform</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Purpose</h4>
            <p className="text-sm text-muted-foreground">
              Psych Master is a comprehensive educational platform designed to help medical students,
              residents, and healthcare professionals master psychiatric diagnostic reasoning and
              pattern recognition.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>8 core psychiatric disorder modules with interactive learning tools</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Clinical vignettes and case-based assessments</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Symptom pattern recognition exercises</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Comprehensive psychiatric terminology glossary</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Dark mode support for comfortable learning</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Covered Topics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• Major Depressive Disorder</div>
              <div>• Bipolar Disorder</div>
              <div>• Schizophrenia & Psychosis</div>
              <div>• Anxiety Disorders</div>
              <div>• PTSD</div>
              <div>• ADHD</div>
              <div>• Substance Use Disorders</div>
              <div>• Personality Disorders</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Educational Approach</h4>
            <p className="text-sm text-muted-foreground">
              This platform emphasizes diagnostic clarity, symptom cluster recognition, and
              differential reasoning. All content is DSM-5-TR informed and designed for educational
              purposes using synthetic clinical scenarios.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimers */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <CardTitle>Important Disclaimers</CardTitle>
              <CardDescription>Please read carefully</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Educational Use Only
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This application is designed exclusively for educational and training purposes. It is
              NOT intended for clinical diagnosis, treatment planning, or patient care decisions.
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Not a Substitute for Clinical Judgment
            </h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              All clinical scenarios are synthetic and for educational purposes only. Never use this
              application as a substitute for professional medical judgment, clinical assessment, or
              consultation with qualified healthcare providers.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              No Medication Guidance
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This platform does not provide specific medication dosing, treatment protocols, or
              therapeutic directives. Always consult current clinical guidelines and supervising
              physicians for patient care.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Synthetic Data Only
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              All patient cases, scenarios, and clinical data presented in this application are
              entirely synthetic and created for educational purposes. No real patient data is used.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Cultural Sensitivity
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Psychiatric diagnosis must always consider cultural context and individual circumstances.
              This platform provides general educational information and may not reflect all cultural
              variations in symptom presentation.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Crisis Resources
            </h4>
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
              If you or someone you know is experiencing a mental health crisis:
            </p>
            <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
              <li>• Call 988 (Suicide & Crisis Lifeline) in the US</li>
              <li>• Go to your nearest emergency department</li>
              <li>• Call emergency services (911 in US)</li>
              <li>• Contact a mental health professional immediately</li>
            </ul>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
              Continuing Medical Education
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              This platform is not accredited for continuing medical education (CME) credits. It is
              designed as a supplementary educational resource to support learning alongside formal
              training and clinical experience.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardHeader>
          <CardTitle>Version Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>2024</span>
            </div>
            <div className="flex justify-between">
              <span>Content Based On</span>
              <span>DSM-5-TR Concepts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
