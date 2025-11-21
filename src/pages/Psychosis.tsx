import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { Eye, AlertTriangle } from 'lucide-react'

export default function Psychosis() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set())

  const positiveSymptoms = [
    { id: 'hallucinations', name: 'Hallucinations', description: 'Auditory (most common), visual, tactile, olfactory' },
    { id: 'delusions', name: 'Delusions', description: 'Fixed false beliefs (persecutory, grandiose, referential)' },
    { id: 'disorganized_speech', name: 'Disorganized Speech', description: 'Tangentiality, loose associations, word salad' },
    { id: 'disorganized_behavior', name: 'Disorganized Behavior', description: 'Inappropriate behavior, unpredictable agitation' },
    { id: 'catatonia', name: 'Catatonic Behavior', description: 'Immobility, excessive motor activity, mutism' },
  ]

  const negativeSymptoms = [
    { id: 'affective_flattening', name: 'Affective Flattening', description: 'Reduced emotional expression' },
    { id: 'alogia', name: 'Alogia', description: 'Poverty of speech, brief responses' },
    { id: 'avolition', name: 'Avolition', description: 'Decreased motivation, inability to initiate activities' },
    { id: 'anhedonia', name: 'Anhedonia', description: 'Inability to experience pleasure' },
    { id: 'asociality', name: 'Asociality', description: 'Lack of interest in social interactions' },
  ]

  const differentialCauses = [
    {
      category: 'Primary Psychotic Disorders',
      items: ['Schizophrenia', 'Schizoaffective Disorder', 'Brief Psychotic Disorder', 'Delusional Disorder'],
    },
    {
      category: 'Mood Disorders with Psychosis',
      items: ['Major Depression with Psychotic Features', 'Bipolar Disorder with Psychotic Features'],
    },
    {
      category: 'Substance-Induced',
      items: ['Stimulants (cocaine, methamphetamine)', 'Cannabis', 'Hallucinogens', 'Alcohol withdrawal'],
    },
    {
      category: 'Medical Conditions',
      items: ['Delirium', 'Dementia', 'Brain tumor', 'Thyroid disorders', 'Autoimmune encephalitis', 'Temporal lobe epilepsy'],
    },
  ]

  const schizophreniaVsSchizoaffective = [
    {
      feature: 'Mood Episodes',
      schizophrenia: 'May occur, but brief relative to psychotic symptoms',
      schizoaffective: 'Major depressive or manic episodes for substantial portion of illness',
    },
    {
      feature: 'Psychosis Without Mood Symptoms',
      schizophrenia: 'Always present',
      schizoaffective: '≥2 weeks of delusions/hallucinations WITHOUT mood episode',
    },
    {
      feature: 'Duration',
      schizophrenia: '≥6 months of symptoms',
      schizoaffective: '≥6 months, with mood episodes during active psychotic period',
    },
  ]

  const redFlags = [
    'First-episode psychosis requires thorough medical workup',
    'Suicidal or homicidal ideation',
    'Command hallucinations directing harm',
    'Severe agitation or violent behavior',
    'Inability to care for self',
    'Concurrent substance use',
  ]

  const toggleSymptom = (id: string) => {
    const newSelected = new Set(selectedSymptoms)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSymptoms(newSelected)
  }

  const getSymptomPattern = () => {
    const positiveCount = positiveSymptoms.filter(s => selectedSymptoms.has(s.id)).length
    const negativeCount = negativeSymptoms.filter(s => selectedSymptoms.has(s.id)).length

    if (positiveCount === 0 && negativeCount === 0) {
      return 'Select symptoms to see pattern analysis'
    }

    let pattern = ''
    if (positiveCount > negativeCount) {
      pattern = 'Predominantly POSITIVE symptoms - suggests acute psychotic episode, more responsive to treatment'
    } else if (negativeCount > positiveCount) {
      pattern = 'Predominantly NEGATIVE symptoms - suggests chronic phase, may be more treatment-resistant'
    } else {
      pattern = 'MIXED positive and negative symptoms - comprehensive treatment approach needed'
    }

    return pattern
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Eye className="h-10 w-10 text-purple-500" />
          <h1 className="text-4xl font-bold">Schizophrenia & Acute Psychosis</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Recognize psychotic symptoms, distinguish disorders, and assess severity
        </p>
      </div>

      {/* Interactive Symptom Pattern Engine */}
      <Card>
        <CardHeader>
          <CardTitle>Psychosis Pattern Engine</CardTitle>
          <CardDescription>
            Select symptoms to analyze positive vs negative symptom patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Positive Symptoms */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-purple-600 dark:text-purple-400">
              Positive Symptoms (Added behaviors/experiences)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {positiveSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <h5 className="font-semibold text-sm">{symptom.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {symptom.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Negative Symptoms */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">
              Negative Symptoms (Reduced/lost functions)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {negativeSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <h5 className="font-semibold text-sm">{symptom.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {symptom.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Analysis */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Pattern Analysis:</h4>
            <p className="text-sm">{getSymptomPattern()}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <span className="font-medium">Positive: </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {positiveSymptoms.filter(s => selectedSymptoms.has(s.id)).length}/5
                </span>
              </div>
              <div>
                <span className="font-medium">Negative: </span>
                <span className="text-blue-600 dark:text-blue-400">
                  {negativeSymptoms.filter(s => selectedSymptoms.has(s.id)).length}/5
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setSelectedSymptoms(new Set())}
            className="w-full"
          >
            Clear Selection
          </Button>
        </CardContent>
      </Card>

      {/* Schizophrenia vs Schizoaffective */}
      <Card>
        <CardHeader>
          <CardTitle>Schizophrenia vs Schizoaffective Disorder</CardTitle>
          <CardDescription>Key distinguishing features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold">Schizophrenia</th>
                  <th className="text-left p-3 font-semibold">Schizoaffective</th>
                </tr>
              </thead>
              <tbody>
                {schizophreniaVsSchizoaffective.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm">{row.schizophrenia}</td>
                    <td className="p-3 text-sm">{row.schizoaffective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Differential Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle>Differential Diagnosis of Psychosis</CardTitle>
          <CardDescription>Always consider alternative causes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {differentialCauses.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2">{category.category}</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-2 rounded bg-secondary/50 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
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
              <CardTitle>RED FLAGS - Immediate Attention</CardTitle>
              <CardDescription>Critical safety and diagnostic concerns</CardDescription>
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
                <strong>First-Episode Psychosis:</strong> Always rule out medical/substance causes before diagnosing primary psychotic disorder
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Negative Symptoms:</strong> Often more disabling than positive symptoms and harder to treat
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Command Hallucinations:</strong> Voices commanding self-harm or harm to others require immediate safety assessment
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Duration Matters:</strong> Brief psychotic disorder (&lt;1 month), Schizophreniform (1-6 months), Schizophrenia (≥6 months)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
