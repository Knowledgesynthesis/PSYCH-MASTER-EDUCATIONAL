import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { Pill, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface WithdrawalCase {
  id: string
  substance: string
  symptoms: string[]
  vitals: string
  timeline: string
  classification: string
  explanation: string
}

export default function SUD() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const cases: WithdrawalCase[] = [
    {
      id: 'case1',
      substance: 'Unknown',
      symptoms: ['Tremor', 'Agitation', 'Diaphoresis', 'Anxiety', 'Nausea'],
      vitals: 'HR 110, BP 155/95, Temp 37.8°C',
      timeline: '12 hours since last use',
      classification: 'Alcohol Withdrawal - Early/Mild',
      explanation: 'Tremor, autonomic hyperactivity (tachycardia, hypertension), and anxiety 6-24 hours after last drink indicate early alcohol withdrawal.',
    },
    {
      id: 'case2',
      substance: 'Unknown',
      symptoms: ['Confusion', 'Disorientation', 'Visual hallucinations', 'Severe tremor', 'Agitation'],
      vitals: 'HR 130, BP 170/100, Temp 38.5°C',
      timeline: '72 hours since last use',
      classification: 'Alcohol Withdrawal - Delirium Tremens (DTs)',
      explanation: 'RED FLAG: Delirium, hallucinations, severe autonomic instability 48-96 hours after cessation indicates DTs - medical emergency with mortality risk.',
    },
    {
      id: 'case3',
      substance: 'Unknown',
      symptoms: ['Lacrimation', 'Rhinorrhea', 'Yawning', 'Piloerection', 'Dilated pupils', 'Diarrhea', 'Muscle aches'],
      vitals: 'HR 95, BP 135/85, Temp 37.2°C',
      timeline: '18 hours since last use',
      classification: 'Opioid Withdrawal',
      explanation: 'Flu-like symptoms (rhinorrhea, lacrimation, yawning), piloerection, GI hyperactivity, and mydriasis indicate opioid withdrawal. NOT life-threatening.',
    },
    {
      id: 'case4',
      substance: 'Unknown',
      symptoms: ['Seizure', 'Post-ictal confusion'],
      vitals: 'HR 115, BP 160/95, Temp 37.5°C',
      timeline: '24-48 hours since last use',
      classification: 'Alcohol Withdrawal Seizure',
      explanation: 'RED FLAG: Withdrawal seizures typically occur 24-48 hours after last drink, often single generalized tonic-clonic seizure.',
    },
  ]

  const alcoholWithdrawalTimeline = [
    {
      timeframe: '6-24 hours',
      symptoms: 'Tremor, anxiety, agitation, GI upset, autonomic hyperactivity',
      severity: 'Mild-Moderate',
    },
    {
      timeframe: '24-48 hours',
      symptoms: 'Withdrawal seizures (typically single, generalized)',
      severity: 'Severe',
    },
    {
      timeframe: '48-96 hours',
      symptoms: 'Delirium tremens (confusion, hallucinations, severe autonomic instability)',
      severity: 'Life-threatening',
    },
  ]

  const opioidWithdrawalSymptoms = [
    { category: 'Early Signs', symptoms: 'Lacrimation, rhinorrhea, yawning, sweating' },
    { category: 'GI Symptoms', symptoms: 'Nausea, vomiting, diarrhea, abdominal cramps' },
    { category: 'CNS Symptoms', symptoms: 'Anxiety, irritability, insomnia, restlessness' },
    { category: 'Physical Signs', symptoms: 'Piloerection ("goosebumps"), mydriasis, muscle aches' },
    { category: 'Autonomic', symptoms: 'Tachycardia, hypertension (usually mild)' },
  ]

  const alcoholVsOpioid = [
    {
      feature: 'Life-Threatening',
      alcohol: 'YES - Can be fatal (DTs, seizures)',
      opioid: 'NO - Very uncomfortable but not fatal',
    },
    {
      feature: 'Timeline',
      alcohol: 'Peaks 48-72 hours, can last 5-7 days',
      opioid: 'Peaks 36-72 hours (short-acting), lasts 7-10 days',
    },
    {
      feature: 'Hallmark Signs',
      alcohol: 'Tremor, autonomic instability, seizures',
      opioid: 'Lacrimation, rhinorrhea, piloerection, diarrhea',
    },
    {
      feature: 'Pupils',
      alcohol: 'Normal or dilated',
      opioid: 'Dilated (mydriasis)',
    },
  ]

  const sudConcepts = [
    {
      term: 'Tolerance',
      definition: 'Need for increased amounts to achieve effect OR diminished effect with same amount',
    },
    {
      term: 'Withdrawal',
      definition: 'Characteristic syndrome when substance is discontinued OR substance taken to relieve/avoid withdrawal',
    },
    {
      term: 'Craving',
      definition: 'Strong desire or urge to use the substance',
    },
    {
      term: 'Loss of Control',
      definition: 'Substance taken in larger amounts or over longer period than intended',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Pill className="h-10 w-10 text-pink-500" />
          <h1 className="text-4xl font-bold">Substance Use Disorders</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Recognize withdrawal patterns and distinguish alcohol from opioid withdrawal
        </p>
      </div>

      {/* Alcohol vs Opioid Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Alcohol vs Opioid Withdrawal - Key Differences</CardTitle>
          <CardDescription>Critical distinctions for recognition and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold text-red-600 dark:text-red-400">
                    Alcohol Withdrawal
                  </th>
                  <th className="text-left p-3 font-semibold text-blue-600 dark:text-blue-400">
                    Opioid Withdrawal
                  </th>
                </tr>
              </thead>
              <tbody>
                {alcoholVsOpioid.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm bg-red-50 dark:bg-red-900/20">
                      {row.alcohol}
                    </td>
                    <td className="p-3 text-sm bg-blue-50 dark:bg-blue-900/20">
                      {row.opioid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alcohol Withdrawal Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <CardTitle>Alcohol Withdrawal Timeline</CardTitle>
              <CardDescription>Progressive severity over 2-4 days</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alcoholWithdrawalTimeline.map((phase, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  phase.severity === 'Life-threatening'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : phase.severity === 'Severe'
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{phase.timeframe}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      phase.severity === 'Life-threatening'
                        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                        : phase.severity === 'Severe'
                        ? 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100'
                        : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
                    }`}
                  >
                    {phase.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{phase.symptoms}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opioid Withdrawal Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Opioid Withdrawal Symptoms</CardTitle>
          <CardDescription>
            Uncomfortable but NOT life-threatening (unlike alcohol/benzodiazepine withdrawal)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {opioidWithdrawalSymptoms.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20"
              >
                <h4 className="font-semibold text-sm">{item.category}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.symptoms}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Withdrawal Pattern Sorter */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Pattern Sorter</CardTitle>
          <CardDescription>
            Practice distinguishing withdrawal syndromes
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
                    <span className="text-sm font-medium">Symptoms: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.symptoms.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Vitals: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.vitals}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Timeline: </span>
                    <span className="text-sm text-muted-foreground">
                      {caseItem.timeline}
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

      {/* Core SUD Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Core Substance Use Disorder Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sudConcepts.map((concept, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-secondary/50"
              >
                <h4 className="font-semibold text-sm">{concept.term}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {concept.definition}
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
                <strong>Alcohol Withdrawal is Life-Threatening:</strong> Unlike opioid withdrawal, alcohol and benzodiazepine withdrawal can be fatal
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>DTs Timing:</strong> Delirium tremens typically occur 48-96 hours after last drink, not immediately
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Opioid "Flu":</strong> Opioid withdrawal mimics severe flu - very uncomfortable but not dangerous
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Withdrawal vs Intoxication:</strong> Opioid withdrawal causes dilated pupils (mydriasis); intoxication causes pinpoint pupils (miosis)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Kindling Effect:</strong> Repeated alcohol withdrawal episodes become progressively more severe
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Substance-Induced Disorders:</strong> Many psychiatric symptoms can be caused by substance use/withdrawal - always screen substance history
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
