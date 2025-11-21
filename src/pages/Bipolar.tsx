import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { CheckCircle2, Zap } from 'lucide-react'

interface BipolarCase {
  id: string
  moodSymptoms: string[]
  duration: string
  functionalImpairment: string
  hospitalization: boolean
  classification: string
  explanation: string
}

export default function Bipolar() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const cases: BipolarCase[] = [
    {
      id: 'case1',
      moodSymptoms: ['Elevated mood', 'Decreased need for sleep (2-3 hours)', 'Racing thoughts', 'Increased goal-directed activity', 'Impulsive spending'],
      duration: '8 days',
      functionalImpairment: 'Severe - lost job, maxed out credit cards',
      hospitalization: false,
      classification: 'Manic Episode - Bipolar I Disorder',
      explanation: 'Duration ≥7 days with marked functional impairment and multiple manic symptoms meets criteria for manic episode, thus Bipolar I.',
    },
    {
      id: 'case2',
      moodSymptoms: ['Irritable mood', 'Grandiosity', 'Pressured speech', 'Decreased sleep', 'Psychotic features (believes has special powers)'],
      duration: '5 days',
      functionalImpairment: 'Complete inability to function',
      hospitalization: true,
      classification: 'Manic Episode with Psychotic Features - Bipolar I',
      explanation: 'Psychotic features OR hospitalization automatically qualifies as mania regardless of duration, thus Bipolar I.',
    },
    {
      id: 'case3',
      moodSymptoms: ['Elevated mood', 'Increased energy', 'More talkative', 'Decreased sleep (5 hours, feels rested)'],
      duration: '5 days',
      functionalImpairment: 'Mild - noticeable change but still functioning at work',
      hospitalization: false,
      classification: 'Hypomanic Episode - Suggests Bipolar II',
      explanation: 'Duration ≥4 days with noticeable change but WITHOUT marked impairment or psychosis indicates hypomania, suggesting Bipolar II (if prior depressive episodes).',
    },
    {
      id: 'case4',
      moodSymptoms: ['Depressed mood', 'Anhedonia', 'Fatigue', 'Hopelessness', 'Prior hypomanic episode 2 years ago'],
      duration: 'Current episode: 4 weeks',
      functionalImpairment: 'Moderate - struggling with work',
      hospitalization: false,
      classification: 'Depressive Episode in Bipolar II Disorder',
      explanation: 'Current major depressive episode + history of hypomania (without mania) = Bipolar II Disorder.',
    },
  ]

  const maniaVsHypomania = [
    {
      feature: 'Duration',
      mania: '≥7 days (or any duration if hospitalized)',
      hypomania: '≥4 days',
    },
    {
      feature: 'Functional Impairment',
      mania: 'Marked impairment in social/occupational functioning',
      hypomania: 'Observable change, but NO marked impairment',
    },
    {
      feature: 'Psychotic Features',
      mania: 'May be present',
      hypomania: 'Never present (if present → mania)',
    },
    {
      feature: 'Hospitalization',
      mania: 'May require hospitalization',
      hypomania: 'Never requires hospitalization (if hospitalized → mania)',
    },
    {
      feature: 'Disorder Type',
      mania: 'Bipolar I',
      hypomania: 'Bipolar II (with depressive episodes)',
    },
  ]

  const manicSymptoms = [
    'Elevated, expansive, or irritable mood',
    'Inflated self-esteem or grandiosity',
    'Decreased need for sleep',
    'More talkative or pressured speech',
    'Racing thoughts or flight of ideas',
    'Distractibility',
    'Increased goal-directed activity or psychomotor agitation',
    'Excessive involvement in risky activities',
  ]

  const mixedFeatures = [
    'Depressed mood during manic episode',
    'Diminished interest during elevated episode',
    'Psychomotor retardation during mania',
    'Hopelessness during elevated state',
    'Requires careful assessment and different treatment approach',
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Zap className="h-10 w-10 text-yellow-500" />
          <h1 className="text-4xl font-bold">Bipolar Disorder</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the distinction between Bipolar I & II and recognize mania vs hypomania
        </p>
      </div>

      {/* Key Distinctions */}
      <Card>
        <CardHeader>
          <CardTitle>Mania vs Hypomania - Key Distinctions</CardTitle>
          <CardDescription>Critical differences for diagnosis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold text-yellow-600 dark:text-yellow-400">
                    Mania (Bipolar I)
                  </th>
                  <th className="text-left p-3 font-semibold text-blue-600 dark:text-blue-400">
                    Hypomania (Bipolar II)
                  </th>
                </tr>
              </thead>
              <tbody>
                {maniaVsHypomania.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm bg-yellow-50 dark:bg-yellow-900/20">
                      {row.mania}
                    </td>
                    <td className="p-3 text-sm bg-blue-50 dark:bg-blue-900/20">
                      {row.hypomania}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manic Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Manic/Hypomanic Symptoms</CardTitle>
          <CardDescription>
            Need 3+ symptoms (4+ if mood is only irritable)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {manicSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-secondary/50"
              >
                <p className="text-sm">{symptom}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Case Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Mania vs Hypomania Builder</CardTitle>
          <CardDescription>
            Practice distinguishing between manic and hypomanic episodes
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
                    <span className="text-sm font-medium">Mood Symptoms: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.moodSymptoms.join(', ')}
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
                      Functional Impairment:{' '}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.functionalImpairment}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Hospitalization: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.hospitalization ? 'Yes' : 'No'}
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

      {/* Mixed Features */}
      <Card>
        <CardHeader>
          <CardTitle>Mixed Features</CardTitle>
          <CardDescription>
            When depressive symptoms occur during manic/hypomanic episodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mixedFeatures.map((feature, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
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
                <strong>One Manic Episode = Bipolar I:</strong> Even with multiple depressive episodes, a single manic episode establishes Bipolar I diagnosis
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Antidepressant Caution:</strong> Antidepressants alone can trigger mania in bipolar patients - mood stabilizer typically needed first
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Bipolar vs Borderline:</strong> Bipolar mood episodes last days-weeks; borderline mood shifts occur within hours
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Substance-Induced Mania:</strong> Always rule out stimulant use, steroids, or other substances that can mimic mania
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
