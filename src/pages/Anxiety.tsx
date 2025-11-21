import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { Brain, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface AnxietyCase {
  id: string
  presentation: string
  onset: string
  duration: string
  symptoms: string[]
  classification: string
  explanation: string
}

export default function Anxiety() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const cases: AnxietyCase[] = [
    {
      id: 'case1',
      presentation: 'Excessive worry about multiple life circumstances',
      onset: 'Gradual over months',
      duration: '8 months',
      symptoms: ['Restlessness', 'Fatigue', 'Difficulty concentrating', 'Muscle tension', 'Sleep disturbance'],
      classification: 'Generalized Anxiety Disorder (GAD)',
      explanation: 'Excessive worry for ≥6 months about multiple events, difficult to control, with ≥3 associated symptoms indicates GAD.',
    },
    {
      id: 'case2',
      presentation: 'Sudden onset of intense fear',
      onset: 'Abrupt, peaks within 10 minutes',
      duration: 'Episodes last 20-30 minutes, recurring for 2 months',
      symptoms: ['Palpitations', 'Sweating', 'Trembling', 'Shortness of breath', 'Chest pain', 'Nausea', 'Dizziness', 'Fear of dying'],
      classification: 'Panic Disorder',
      explanation: 'Recurrent unexpected panic attacks (abrupt surge of fear peaking within minutes) with ≥4 symptoms, plus persistent concern about attacks.',
    },
    {
      id: 'case3',
      presentation: 'Sudden chest pain and shortness of breath',
      onset: 'Abrupt, during physical exertion',
      duration: 'First episode, resolved in ER',
      symptoms: ['Chest pain radiating to left arm', 'Diaphoresis', 'Dyspnea', 'Nausea'],
      classification: 'Rule out cardiac cause FIRST (medical mimic)',
      explanation: 'First episode with classic cardiac symptoms during exertion requires cardiac workup before psychiatric diagnosis.',
    },
    {
      id: 'case4',
      presentation: 'Worry about specific situation (upcoming presentation)',
      onset: '2 weeks before event',
      duration: '2 weeks',
      symptoms: ['Nervousness', 'Sleep difficulty', 'Worry about performance'],
      classification: 'Adjustment Disorder or Normal Anxiety',
      explanation: 'Worry tied to specific stressor, duration &lt;6 months, does not meet GAD criteria. May be normal response or adjustment disorder.',
    },
  ]

  const gadSymptoms = [
    'Restlessness or feeling on edge',
    'Being easily fatigued',
    'Difficulty concentrating',
    'Irritability',
    'Muscle tension',
    'Sleep disturbance',
  ]

  const panicSymptoms = [
    'Palpitations or accelerated heart rate',
    'Sweating',
    'Trembling or shaking',
    'Shortness of breath or smothering',
    'Feeling of choking',
    'Chest pain or discomfort',
    'Nausea or abdominal distress',
    'Dizziness or lightheadedness',
    'Chills or heat sensations',
    'Paresthesias (numbness/tingling)',
    'Derealization or depersonalization',
    'Fear of losing control or going crazy',
    'Fear of dying',
  ]

  const medicalMimics = [
    { condition: 'Hyperthyroidism', clues: 'Weight loss, tremor, heat intolerance' },
    { condition: 'Cardiac arrhythmia', clues: 'Palpitations, abnormal ECG' },
    { condition: 'Pheochromocytoma', clues: 'Episodic hypertension, headache, sweating' },
    { condition: 'Hypoglycemia', clues: 'Related to meals, resolves with food' },
    { condition: 'Caffeine intoxication', clues: 'High caffeine intake, jitteriness' },
    { condition: 'Medication side effect', clues: 'Onset with new medication' },
  ]

  const gadVsPanic = [
    {
      feature: 'Onset',
      gad: 'Gradual, chronic worry',
      panic: 'Abrupt, sudden surge of fear',
    },
    {
      feature: 'Duration',
      gad: 'Persistent (≥6 months)',
      panic: 'Episodes peak within minutes, last 20-30 min',
    },
    {
      feature: 'Focus',
      gad: 'Multiple life circumstances',
      panic: 'Fear of the panic attacks themselves',
    },
    {
      feature: 'Physical Symptoms',
      gad: 'Chronic tension, fatigue',
      panic: 'Acute autonomic surge (palpitations, dyspnea)',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-10 w-10 text-green-500" />
          <h1 className="text-4xl font-bold">Anxiety Disorders</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Distinguish between GAD, Panic Disorder, and medical mimics
        </p>
      </div>

      {/* GAD vs Panic Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>GAD vs Panic Disorder - Key Differences</CardTitle>
          <CardDescription>Critical distinctions for diagnosis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold text-green-600 dark:text-green-400">
                    GAD
                  </th>
                  <th className="text-left p-3 font-semibold text-red-600 dark:text-red-400">
                    Panic Disorder
                  </th>
                </tr>
              </thead>
              <tbody>
                {gadVsPanic.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm bg-green-50 dark:bg-green-900/20">
                      {row.gad}
                    </td>
                    <td className="p-3 text-sm bg-red-50 dark:bg-red-900/20">
                      {row.panic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GAD Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Generalized Anxiety Disorder (GAD) Symptoms</CardTitle>
          <CardDescription>
            Need ≥3 symptoms (≥1 in children) with excessive worry for ≥6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {gadSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20"
              >
                <p className="text-sm">{symptom}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Panic Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Panic Attack Symptoms</CardTitle>
          <CardDescription>
            Need ≥4 symptoms with abrupt onset, peaking within minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {panicSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-red-50 dark:bg-red-900/20"
              >
                <p className="text-sm">{symptom}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Case Differentiator */}
      <Card>
        <CardHeader>
          <CardTitle>Anxiety Differentiator</CardTitle>
          <CardDescription>
            Practice distinguishing GAD, panic disorder, and medical mimics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div>
                <h4 className="font-semibold">Case {index + 1}</h4>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-sm font-medium">Presentation: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.presentation}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Onset: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.onset}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Duration: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Symptoms: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.symptoms.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedCase === index) {
                    setShowAnswer(!showAnswer)
                  } else {
                    setSelectedCase(index)
                    setShowAnswer(true)
                  }
                }}
              >
                {selectedCase === index && showAnswer
                  ? 'Hide Classification'
                  : 'Show Classification'}
              </Button>

              {selectedCase === index && showAnswer && (
                <div className="mt-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">
                        {caseItem.classification}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {caseItem.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Mimics */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <CardTitle>Medical Mimics of Anxiety</CardTitle>
              <CardDescription>Always rule out medical causes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicalMimics.map((mimic, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-sm">{mimic.condition}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Clues:</strong> {mimic.clues}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Pearls */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Pearls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>First Panic Attack:</strong> Always rule out cardiac and endocrine causes, especially in patients &gt;40 or with cardiac risk factors
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Anticipatory Anxiety:</strong> Key feature of panic disorder is worry about having future panic attacks
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Comorbidity:</strong> GAD and panic disorder frequently co-occur with depression; screen for mood disorders
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Agoraphobia:</strong> Often develops with panic disorder - avoidance of places where escape might be difficult
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
