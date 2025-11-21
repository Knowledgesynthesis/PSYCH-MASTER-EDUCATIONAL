import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { Target } from 'lucide-react'

export default function ADHD() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set())

  const inattentionSymptoms = [
    { id: 'careless_mistakes', name: 'Careless mistakes in work/activities' },
    { id: 'sustaining_attention', name: 'Difficulty sustaining attention in tasks' },
    { id: 'not_listening', name: 'Does not seem to listen when spoken to' },
    { id: 'not_following_through', name: 'Fails to follow through on instructions' },
    { id: 'organizing', name: 'Difficulty organizing tasks and activities' },
    { id: 'avoids_tasks', name: 'Avoids tasks requiring sustained mental effort' },
    { id: 'loses_things', name: 'Often loses necessary items' },
    { id: 'easily_distracted', name: 'Easily distracted by extraneous stimuli' },
    { id: 'forgetful', name: 'Forgetful in daily activities' },
  ]

  const hyperactivityImpulsivitySymptoms = [
    { id: 'fidgets', name: 'Fidgets with hands/feet or squirms' },
    { id: 'leaves_seat', name: 'Leaves seat when remaining seated expected' },
    { id: 'runs_climbs', name: 'Runs/climbs inappropriately (or restlessness in adults)' },
    { id: 'unable_quiet', name: 'Unable to play/engage quietly' },
    { id: 'on_the_go', name: 'Acts as if "driven by a motor"' },
    { id: 'talks_excessively', name: 'Talks excessively' },
    { id: 'blurts_answers', name: 'Blurts out answers before questions completed' },
    { id: 'difficulty_waiting', name: 'Difficulty waiting turn' },
    { id: 'interrupts', name: 'Interrupts or intrudes on others' },
  ]

  const adhdTypes = [
    {
      type: 'Predominantly Inattentive',
      criteria: '≥6 inattention symptoms (≥5 for age 17+)',
      characteristics: 'Organization problems, forgetfulness, easily distracted',
    },
    {
      type: 'Predominantly Hyperactive-Impulsive',
      criteria: '≥6 hyperactivity-impulsivity symptoms (≥5 for age 17+)',
      characteristics: 'Fidgeting, restlessness, impulsive decisions',
    },
    {
      type: 'Combined Presentation',
      criteria: 'Meets both inattention AND hyperactivity-impulsivity criteria',
      characteristics: 'Most common type, full spectrum of symptoms',
    },
  ]

  const childVsAdult = [
    {
      feature: 'Hyperactivity',
      child: 'Running, climbing, can\'t sit still',
      adult: 'Inner restlessness, feeling "driven"',
    },
    {
      feature: 'Impulsivity',
      child: 'Blurting out, interrupting',
      adult: 'Impulsive decisions (spending, job changes)',
    },
    {
      feature: 'Inattention',
      child: 'Not following through on homework',
      adult: 'Difficulty with work projects, paperwork',
    },
  ]

  const differentialConsiderations = [
    { condition: 'Anxiety Disorders', differentiation: 'Anxiety causes difficulty concentrating; ADHD is lifelong pattern' },
    { condition: 'Depression', differentiation: 'Depression onset is episodic; ADHD is chronic since childhood' },
    { condition: 'Sleep Disorders', differentiation: 'Screen for sleep apnea, insomnia causing inattention' },
    { condition: 'Substance Use', differentiation: 'Stimulant use can mimic or mask ADHD symptoms' },
    { condition: 'Bipolar Disorder', differentiation: 'Mania can look like ADHD but is episodic, not chronic' },
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

  const getDomainCounts = () => {
    return {
      inattention: inattentionSymptoms.filter(s => selectedSymptoms.has(s.id)).length,
      hyperactivityImpulsivity: hyperactivityImpulsivitySymptoms.filter(s => selectedSymptoms.has(s.id)).length,
    }
  }

  const getPresentation = () => {
    const counts = getDomainCounts()
    const total = counts.inattention + counts.hyperactivityImpulsivity

    if (total === 0) {
      return 'Select symptoms to see presentation type'
    }

    const inattentionMet = counts.inattention >= 6
    const hyperMet = counts.hyperactivityImpulsivity >= 6

    if (inattentionMet && hyperMet) {
      return 'Combined Presentation (meets both domains)'
    } else if (inattentionMet) {
      return 'Predominantly Inattentive Presentation'
    } else if (hyperMet) {
      return 'Predominantly Hyperactive-Impulsive Presentation'
    } else {
      return `Insufficient symptoms (need ≥6 in at least one domain)`
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Target className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold">Attention-Deficit/Hyperactivity Disorder</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Distinguish between inattention and hyperactivity/impulsivity domains
        </p>
      </div>

      {/* Key Diagnostic Features */}
      <Card>
        <CardHeader>
          <CardTitle>Essential Diagnostic Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Childhood Onset:</strong> Several symptoms present before age 12
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Pervasiveness:</strong> Symptoms present in ≥2 settings (home, school, work)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Functional Impairment:</strong> Clear evidence of interference with functioning
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Not Better Explained:</strong> Not better explained by another mental disorder
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Interactive Domain Analyzer */}
      <Card>
        <CardHeader>
          <CardTitle>ADHD Domain Analyzer</CardTitle>
          <CardDescription>
            Select symptoms to analyze presentation type (need ≥6 symptoms in one domain; ≥5 for age 17+)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inattention Domain */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-blue-600 dark:text-blue-400">Inattention Domain</span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({getDomainCounts().inattention}/9 selected)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {inattentionSymptoms.map((symptom) => (
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

          {/* Hyperactivity-Impulsivity Domain */}
          <div>
            <h4 className="font-semibold text-lg mb-3">
              <span className="text-orange-600 dark:text-orange-400">
                Hyperactivity-Impulsivity Domain
              </span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({getDomainCounts().hyperactivityImpulsivity}/9 selected)
              </span>
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {hyperactivityImpulsivitySymptoms.map((symptom) => (
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

          {/* Presentation Analysis */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Presentation Type:</h4>
            <p className="text-sm mb-3">{getPresentation()}</p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-medium">Inattention: </span>
                <span className={getDomainCounts().inattention >= 6 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                  {getDomainCounts().inattention}/9
                </span>
              </div>
              <div>
                <span className="font-medium">Hyperactivity-Impulsivity: </span>
                <span className={getDomainCounts().hyperactivityImpulsivity >= 6 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                  {getDomainCounts().hyperactivityImpulsivity}/9
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

      {/* ADHD Presentations */}
      <Card>
        <CardHeader>
          <CardTitle>ADHD Presentation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adhdTypes.map((type, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-secondary/50"
              >
                <h4 className="font-semibold">{type.type}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Criteria:</strong> {type.criteria}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Characteristics:</strong> {type.characteristics}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Child vs Adult Presentation */}
      <Card>
        <CardHeader>
          <CardTitle>Childhood vs Adult ADHD Presentation</CardTitle>
          <CardDescription>Symptoms evolve with age</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Symptom Domain</th>
                  <th className="text-left p-3 font-semibold">Childhood</th>
                  <th className="text-left p-3 font-semibold">Adulthood</th>
                </tr>
              </thead>
              <tbody>
                {childVsAdult.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-sm">{row.child}</td>
                    <td className="p-3 text-sm">{row.adult}</td>
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
          <CardTitle>Differential Diagnosis</CardTitle>
          <CardDescription>Rule out other conditions mimicking ADHD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {differentialConsiderations.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-sm">{item.condition}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.differentiation}
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
                <strong>Childhood Onset Required:</strong> Symptoms must have been present before age 12, even if not diagnosed until adulthood
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Adult ADHD:</strong> Hyperactivity often manifests as internal restlessness rather than overt motor activity
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Comorbidity:</strong> High rates of anxiety, depression, learning disorders, and substance use
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Stimulant Response:</strong> Not diagnostic - many conditions improve with stimulants
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Predominantly Inattentive:</strong> Often underdiagnosed, especially in girls/women
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
