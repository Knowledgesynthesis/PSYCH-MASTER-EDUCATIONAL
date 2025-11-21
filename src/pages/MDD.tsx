import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface SymptomCase {
  id: string
  symptoms: string[]
  duration: string
  functionalImpairment: string
  severity: string
  explanation: string
}

export default function MDD() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const cases: SymptomCase[] = [
    {
      id: 'case1',
      symptoms: ['Persistent sadness', 'Anhedonia', 'Fatigue', 'Poor concentration', 'Sleep disturbance'],
      duration: '3 weeks',
      functionalImpairment: 'Unable to work, withdrawing from social activities',
      severity: 'Moderate Major Depressive Episode',
      explanation: 'Patient meets criteria with core symptoms (anhedonia, depressed mood) plus additional symptoms, with significant functional impairment over 2+ weeks.',
    },
    {
      id: 'case2',
      symptoms: ['Depressed mood', 'Insomnia', 'Fatigue', 'Guilt', 'Suicidal ideation'],
      duration: '6 weeks',
      functionalImpairment: 'Severe - unable to care for self, requires hospitalization',
      severity: 'Severe Major Depressive Episode with Suicidal Ideation',
      explanation: 'RED FLAG: Suicidal ideation requires immediate safety assessment. Meets criteria for severe episode with high functional impairment.',
    },
    {
      id: 'case3',
      symptoms: ['Low mood', 'Decreased appetite', 'Psychomotor retardation', 'Worthlessness', 'Delusions of guilt'],
      duration: '8 weeks',
      functionalImpairment: 'Complete inability to function',
      severity: 'Severe Major Depressive Episode with Psychotic Features',
      explanation: 'RED FLAG: Psychotic features (delusions) indicate severe depression requiring intensive treatment, often antipsychotic medication.',
    },
    {
      id: 'case4',
      symptoms: ['Mild sadness', 'Occasional fatigue'],
      duration: '1 week',
      functionalImpairment: 'Minimal - still working and socializing',
      severity: 'Does Not Meet MDD Criteria',
      explanation: 'Insufficient symptoms, insufficient duration, and minimal functional impairment. May represent adjustment reaction or normal mood variation.',
    },
  ]

  const redFlags = [
    'Suicidal ideation or behavior',
    'Psychotic features (delusions, hallucinations)',
    'Catatonia',
    'Severe functional impairment',
    'Inability to care for self',
    'Bipolar features (history of mania/hypomania)',
  ]

  const coreSymptoms = [
    {
      name: 'Anhedonia',
      description: 'Loss of interest or pleasure in activities',
    },
    {
      name: 'Depressed Mood',
      description: 'Persistent feelings of sadness, emptiness, or hopelessness',
    },
    {
      name: 'Sleep Disturbance',
      description: 'Insomnia or hypersomnia nearly every day',
    },
    {
      name: 'Appetite/Weight Changes',
      description: 'Significant weight loss or gain, or change in appetite',
    },
    {
      name: 'Psychomotor Changes',
      description: 'Agitation or retardation observable by others',
    },
    {
      name: 'Fatigue',
      description: 'Loss of energy nearly every day',
    },
    {
      name: 'Worthlessness/Guilt',
      description: 'Excessive or inappropriate guilt',
    },
    {
      name: 'Concentration Problems',
      description: 'Diminished ability to think or concentrate',
    },
    {
      name: 'Suicidal Thoughts',
      description: 'Recurrent thoughts of death or suicide',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Major Depressive Disorder (MDD)</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn to recognize MDD patterns, assess severity, and identify red flags
        </p>
      </div>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Diagnostic Concepts</CardTitle>
          <CardDescription>Essential criteria for MDD recognition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Core Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>At least ONE of: depressed mood OR anhedonia</li>
              <li>Total of 5+ symptoms present during same 2-week period</li>
              <li>Symptoms cause clinically significant distress or functional impairment</li>
              <li>Not attributable to substance use or medical condition</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Symptom Clusters */}
      <Card>
        <CardHeader>
          <CardTitle>Symptom Clusters</CardTitle>
          <CardDescription>Nine key symptom domains for MDD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {coreSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-secondary/50"
              >
                <h4 className="font-semibold text-sm">{symptom.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {symptom.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Red Flags */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <CardTitle>RED FLAGS - Immediate Attention Required</CardTitle>
              <CardDescription>Critical features requiring urgent assessment</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {redFlags.map((flag, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {flag}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Severity Sorter */}
      <Card>
        <CardHeader>
          <CardTitle>Depression Severity Sorter</CardTitle>
          <CardDescription>
            Practice identifying severity levels based on symptom presentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">Case {index + 1}</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm font-medium">Symptoms: </span>
                        <span className="text-sm text-muted-foreground">
                          {caseItem.symptoms.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Duration: </span>
                        <span className="text-sm text-muted-foreground">
                          {caseItem.duration}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Functional Impact:{' '}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {caseItem.functionalImpairment}
                        </span>
                      </div>
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
                          {caseItem.severity}
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
                <strong>Bipolar Screening:</strong> Always ask about prior manic or hypomanic episodes before diagnosing unipolar depression
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Psychotic Depression:</strong> Requires antipsychotic medication in addition to antidepressant
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Safety First:</strong> Any suicidal ideation requires immediate safety assessment and risk stratification
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Medical Mimics:</strong> Rule out hypothyroidism, anemia, sleep apnea, and other medical causes
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
