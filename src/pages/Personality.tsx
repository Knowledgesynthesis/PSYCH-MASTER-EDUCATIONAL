import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Users } from 'lucide-react'

export default function Personality() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  const clusters = {
    A: {
      name: 'Cluster A - "Odd/Eccentric"',
      color: 'purple',
      description: 'Characterized by odd, eccentric behavior and social detachment',
      disorders: [
        {
          name: 'Paranoid',
          keyFeatures: 'Distrust and suspiciousness; interprets motives as malevolent',
          traits: ['Suspects exploitation', 'Doubts loyalty', 'Reluctant to confide', 'Bears grudges', 'Perceives attacks'],
        },
        {
          name: 'Schizoid',
          keyFeatures: 'Detachment from social relationships; restricted emotional expression',
          traits: ['Chooses solitary activities', 'Little interest in sexual experiences', 'Few pleasurable activities', 'Lacks close friends', 'Indifferent to praise/criticism', 'Emotional coldness'],
        },
        {
          name: 'Schizotypal',
          keyFeatures: 'Social/interpersonal deficits; cognitive/perceptual distortions; eccentric behavior',
          traits: ['Ideas of reference', 'Odd beliefs/magical thinking', 'Unusual perceptual experiences', 'Odd thinking/speech', 'Suspiciousness', 'Constricted affect', 'Odd behavior/appearance'],
        },
      ],
    },
    B: {
      name: 'Cluster B - "Dramatic/Erratic"',
      color: 'red',
      description: 'Characterized by dramatic, emotional, or erratic behavior',
      disorders: [
        {
          name: 'Antisocial',
          keyFeatures: 'Disregard for and violation of rights of others (age ≥18, evidence of conduct disorder before age 15)',
          traits: ['Failure to conform to social norms/laws', 'Deceitfulness', 'Impulsivity', 'Irritability/aggressiveness', 'Reckless disregard for safety', 'Irresponsibility', 'Lack of remorse'],
        },
        {
          name: 'Borderline',
          keyFeatures: 'Instability in relationships, self-image, affects; marked impulsivity',
          traits: ['Frantic efforts to avoid abandonment', 'Unstable intense relationships', 'Identity disturbance', 'Impulsivity (spending, sex, substance, reckless driving)', 'Recurrent suicidal behavior/self-harm', 'Affective instability', 'Chronic emptiness', 'Inappropriate anger', 'Transient stress-related paranoia/dissociation'],
        },
        {
          name: 'Histrionic',
          keyFeatures: 'Excessive emotionality and attention-seeking',
          traits: ['Uncomfortable when not center of attention', 'Seductive/provocative behavior', 'Shifting, shallow emotions', 'Uses physical appearance for attention', 'Impressionistic speech', 'Dramatic/theatrical', 'Suggestible', 'Considers relationships more intimate than they are'],
        },
        {
          name: 'Narcissistic',
          keyFeatures: 'Grandiosity, need for admiration, lack of empathy',
          traits: ['Grandiose sense of self-importance', 'Preoccupied with fantasies of success/power', 'Believes special/unique', 'Requires excessive admiration', 'Sense of entitlement', 'Exploitative', 'Lacks empathy', 'Envious', 'Arrogant'],
        },
      ],
    },
    C: {
      name: 'Cluster C - "Anxious/Fearful"',
      color: 'blue',
      description: 'Characterized by anxious, fearful behavior',
      disorders: [
        {
          name: 'Avoidant',
          keyFeatures: 'Social inhibition, feelings of inadequacy, hypersensitivity to negative evaluation',
          traits: ['Avoids occupational activities involving interpersonal contact', 'Unwilling to get involved unless certain of being liked', 'Restraint in intimate relationships', 'Preoccupied with criticism/rejection', 'Inhibited in new situations', 'Views self as inferior', 'Reluctant to take risks'],
        },
        {
          name: 'Dependent',
          keyFeatures: 'Excessive need to be taken care of; submissive, clinging behavior',
          traits: ['Difficulty making decisions', 'Needs others to assume responsibility', 'Difficulty disagreeing', 'Difficulty initiating projects', 'Goes to excessive lengths for support', 'Uncomfortable when alone', 'Urgently seeks relationships when one ends', 'Preoccupied with fears of being left alone'],
        },
        {
          name: 'Obsessive-Compulsive (OCPD)',
          keyFeatures: 'Preoccupation with orderliness, perfectionism, control (different from OCD)',
          traits: ['Preoccupied with details/rules/order', 'Perfectionism interferes with completion', 'Excessively devoted to work', 'Inflexible about morality/ethics', 'Unable to discard worthless objects', 'Reluctant to delegate', 'Miserly spending style', 'Rigid and stubborn'],
        },
      ],
    },
  }

  const keyDifferentials = [
    {
      comparison: 'Borderline vs Bipolar',
      distinction: 'Borderline: Mood shifts within hours in response to stressors | Bipolar: Mood episodes last days-weeks',
    },
    {
      comparison: 'OCPD vs OCD',
      distinction: 'OCPD: Ego-syntonic perfectionism, rigidity | OCD: Ego-dystonic obsessions and compulsions',
    },
    {
      comparison: 'Schizotypal vs Schizophrenia',
      distinction: 'Schizotypal: Odd beliefs, no frank psychosis | Schizophrenia: True hallucinations/delusions',
    },
    {
      comparison: 'Avoidant vs Social Anxiety',
      distinction: 'Avoidant: Pervasive pattern affecting identity | Social Anxiety: Specific situational fear',
    },
  ]

  const generalFeatures = [
    'Enduring pattern of inner experience and behavior',
    'Deviates markedly from cultural expectations',
    'Pervasive and inflexible across situations',
    'Onset in adolescence or early adulthood',
    'Stable over time',
    'Leads to distress or impairment',
    'Not better explained by another mental disorder, substance, or medical condition',
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Users className="h-10 w-10 text-indigo-500" />
          <h1 className="text-4xl font-bold">Personality Disorders</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understand personality disorder clusters and recognize maladaptive patterns
        </p>
      </div>

      {/* General Diagnostic Features */}
      <Card>
        <CardHeader>
          <CardTitle>General Diagnostic Features</CardTitle>
          <CardDescription>
            Requirements for any personality disorder diagnosis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {generalFeatures.map((feature, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cluster Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(clusters).map(([key, cluster]) => (
          <button
            key={key}
            onClick={() => setSelectedCluster(selectedCluster === key ? null : key)}
            className={`p-6 rounded-lg border text-left transition-all ${
              selectedCluster === key
                ? `bg-${cluster.color}-100 dark:bg-${cluster.color}-900/30 border-${cluster.color}-500`
                : 'bg-card hover:shadow-lg'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{cluster.name}</h3>
            <p className="text-sm text-muted-foreground">{cluster.description}</p>
            <p className="text-xs mt-3 text-primary">
              {selectedCluster === key ? 'Click to collapse' : 'Click to expand'}
            </p>
          </button>
        ))}
      </div>

      {/* Cluster Details */}
      {selectedCluster && (
        <Card>
          <CardHeader>
            <CardTitle>{clusters[selectedCluster as keyof typeof clusters].name}</CardTitle>
            <CardDescription>
              {clusters[selectedCluster as keyof typeof clusters].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clusters[selectedCluster as keyof typeof clusters].disorders.map((disorder, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-secondary/50"
                >
                  <h4 className="font-semibold text-lg mb-2">
                    {disorder.name} Personality Disorder
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Key Features:</strong> {disorder.keyFeatures}
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-2">Core Traits:</p>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {disorder.traits.map((trait, traitIndex) => (
                        <li
                          key={traitIndex}
                          className="text-sm flex gap-2"
                        >
                          <span className="text-primary">•</span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Differentials */}
      <Card>
        <CardHeader>
          <CardTitle>Key Differential Diagnoses</CardTitle>
          <CardDescription>
            Distinguishing personality disorders from other conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keyDifferentials.map((diff, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-sm mb-1">{diff.comparison}</h4>
                <p className="text-sm text-muted-foreground">{diff.distinction}</p>
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
                <strong>Pattern Over Time:</strong> Personality disorders represent enduring patterns, not episodic symptoms
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Borderline Crisis Management:</strong> High risk of self-harm during perceived abandonment; safety planning essential
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Cluster B Comorbidity:</strong> High rates of mood disorders, substance use, and suicide risk
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Treatment Approach:</strong> Psychotherapy (especially DBT for borderline) is primary; medications target comorbid symptoms
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Antisocial Diagnosis:</strong> Requires age ≥18 with evidence of conduct disorder before age 15
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Cultural Context:</strong> Always consider cultural norms before diagnosing - patterns must deviate from cultural expectations
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                <strong>Stigma Awareness:</strong> Personality disorder diagnoses can be stigmatizing; use with care and focus on specific, treatable symptoms
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
