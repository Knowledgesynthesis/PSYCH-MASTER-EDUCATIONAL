import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { Shield } from 'lucide-react'

export default function PTSD() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set())

  const symptomClusters = {
    intrusion: [
      { id: 'intrusive_memories', name: 'Intrusive distressing memories' },
      { id: 'nightmares', name: 'Recurrent nightmares' },
      { id: 'flashbacks', name: 'Flashbacks (dissociative reactions)' },
      { id: 'psychological_distress', name: 'Psychological distress to trauma cues' },
      { id: 'physiological_reactions', name: 'Physiological reactions to trauma reminders' },
    ],
    avoidance: [
      { id: 'avoid_memories', name: 'Avoidance of distressing memories/thoughts' },
      { id: 'avoid_external', name: 'Avoidance of external reminders (people, places, activities)' },
    ],
    negativeAlterations: [
      { id: 'amnesia', name: 'Inability to recall key aspects of trauma' },
      { id: 'negative_beliefs', name: 'Persistent negative beliefs about self/world' },
      { id: 'blame', name: 'Distorted blame of self or others' },
      { id: 'negative_emotions', name: 'Persistent negative emotional state' },
      { id: 'diminished_interest', name: 'Diminished interest in activities' },
      { id: 'detachment', name: 'Feeling detached or estranged from others' },
      { id: 'inability_positive', name: 'Inability to experience positive emotions' },
    ],
    arousal: [
      { id: 'irritability', name: 'Irritability or angry outbursts' },
      { id: 'reckless', name: 'Reckless or self-destructive behavior' },
      { id: 'hypervigilance', name: 'Hypervigilance' },
      { id: 'startle', name: 'Exaggerated startle response' },
      { id: 'concentration', name: 'Concentration problems' },
      { id: 'sleep', name: 'Sleep disturbance' },
    ],
  }

  const traumaExamples = [
    'Combat exposure',
    'Sexual assault',
    'Physical assault',
    'Serious accident',
    'Natural disaster',
    'Witnessing death or serious injury',
    'Learning of violent death of close family/friend',
    'Repeated exposure to aversive details of trauma (first responders)',
  ]

  const ptsdVsAcuteStress = [
    {
      feature: 'Duration',
      ptsd: '≥1 month',
      acuteStress: '3 days to 1 month',
    },
    {
      feature: 'Onset',
      ptsd: 'Can be delayed (months to years)',
      acuteStress: 'Within 1 month of trauma',
    },
    {
      feature: 'Symptoms',
      ptsd: 'Full PTSD criteria',
      acuteStress: 'Similar but time-limited',
    },
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

  const getClusterCounts = () => {
    const counts = {
      intrusion: symptomClusters.intrusion.filter(s => selectedSymptoms.has(s.id)).length,
      avoidance: symptomClusters.avoidance.filter(s => selectedSymptoms.has(s.id)).length,
      negativeAlterations: symptomClusters.negativeAlterations.filter(s => selectedSymptoms.has(s.id)).length,
      arousal: symptomClusters.arousal.filter(s => selectedSymptoms.has(s.id)).length,
    }
    return counts
  }

  const meetsCriteria = () => {
    const counts = getClusterCounts()
    return counts.intrusion >= 1 && counts.avoidance >= 1 && counts.negativeAlterations >= 2 && counts.arousal >= 2
  }

  const getAnalysis = () => {
    const counts = getClusterCounts()
    const meets = meetsCriteria()

    if (Object.values(counts).every(c => c === 0)) {
      return 'Select symptoms to see PTSD criteria analysis'
    }

    const missing = []
    if (counts.intrusion < 1) missing.push('intrusion (need ≥1)')
    if (counts.avoidance < 1) missing.push('avoidance (need ≥1)')
    if (counts.negativeAlterations < 2) missing.push('negative alterations (need ≥2)')
    if (counts.arousal < 2) missing.push('arousal (need ≥2)')

    if (meets) {
      return '✓ MEETS PTSD symptom criteria (assuming ≥1 month duration and functional impairment)'
    } else {
      return `Does NOT meet full criteria. Missing: ${missing.join(', ')}`
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-red-500" />
          <h1 className="text-4xl font-bold">Post-Traumatic Stress Disorder</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Recognize trauma responses and map symptom clusters
        </p>
      </div>

      {/* Trauma Exposure Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Criterion A: Trauma Exposure</CardTitle>
          <CardDescription>
            Exposure to actual or threatened death, serious injury, or sexual violence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {traumaExamples.map((example, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-secondary/50 border"
              >
                <p className="text-sm">{example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Cluster Mapper */}
      <Card>
        <CardHeader>
          <CardTitle>PTSD Cluster Mapper</CardTitle>
          <CardDescription>
            Select symptoms to analyze PTSD criteria (need: ≥1 intrusion, ≥1 avoidance, ≥2 negative alterations, ≥2 arousal)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intrusion Cluster */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-red-600 dark:text-red-400">Cluster B: Intrusion Symptoms</span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Need ≥1)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {symptomClusters.intrusion.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {/* Avoidance Cluster */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-blue-600 dark:text-blue-400">Cluster C: Avoidance</span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Need ≥1)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {symptomClusters.avoidance.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Alterations Cluster */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-purple-600 dark:text-purple-400">
                Cluster D: Negative Alterations in Cognition & Mood
              </span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Need ≥2)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {symptomClusters.negativeAlterations.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {/* Arousal Cluster */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-orange-600 dark:text-orange-400">
                Cluster E: Alterations in Arousal & Reactivity
              </span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Need ≥2)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {symptomClusters.arousal.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedSymptoms.has(symptom.id)
                      ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500'
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className={`p-4 rounded-lg border ${meetsCriteria() ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-primary/10 border-primary/20'}`}>
            <h4 className="font-semibold mb-2">Criteria Analysis:</h4>
            <p className="text-sm mb-3">{getAnalysis()}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="font-medium">Intrusion: </span>
                <span className={getClusterCounts().intrusion >= 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {getClusterCounts().intrusion}/5 (need ≥1)
                </span>
              </div>
              <div>
                <span className="font-medium">Avoidance: </span>
                <span className={getClusterCounts().avoidance >= 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {getClusterCounts().avoidance}/2 (need ≥1)
                </span>
              </div>
              <div>
                <span className="font-medium">Neg. Alt.: </span>
                <span className={getClusterCounts().negativeAlterations >= 2 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {getClusterCounts().negativeAlterations}/7 (need ≥2)
                </span>
              </div>
              <div>
                <span className="font-medium">Arousal: </span>
                <span className={getClusterCounts().arousal >= 2 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {getClusterCounts().arousal}/6 (need ≥2)
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

      {/* PTSD vs Acute Stress */}
      <Card>
        <CardHeader>
          <CardTitle>PTSD vs Acute Stress Disorder</CardTitle>
          <CardDescription>Duration distinguishes these diagnoses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Feature</th>
                  <th className="text-left p-3 font-semibold">PTSD</th>
                  <th className="text-left p-3 font-semibold">Acute Stress Disorder</th>
                </tr>
              </thead>
              <tbody>
                {ptsdVsAcuteStress.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm">{row.ptsd}</td>
                    <td className="p-3 text-sm">{row.acuteStress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <strong>Delayed Onset:</strong> PTSD symptoms can emerge months or even years after the traumatic event
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Comorbidity:</strong> High rates of comorbid depression, anxiety, and substance use disorders
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Trauma-Focused Therapy:</strong> First-line treatment includes trauma-focused CBT and EMDR
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Dissociation:</strong> Flashbacks represent dissociative reactions where the person feels the trauma is recurring
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Duration Criterion:</strong> Symptoms must persist for &gt;1 month AND cause significant distress or functional impairment
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
