import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import Button from '../components/Button'
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const questions: Question[] = [
    {
      id: 1,
      question: 'A 28-year-old woman presents with 6 weeks of depressed mood, anhedonia, insomnia, and passive suicidal ideation. She reports a 2-week period 3 years ago when she felt "on top of the world," needed only 3-4 hours of sleep, and spent her entire savings. What is the most likely diagnosis?',
      options: [
        'Major Depressive Disorder',
        'Bipolar I Disorder',
        'Bipolar II Disorder',
        'Adjustment Disorder with Depressed Mood',
      ],
      correctAnswer: 1,
      explanation: 'History of a manic episode (elevated mood, decreased sleep, impulsive spending lasting ≥7 days OR causing marked impairment) establishes Bipolar I diagnosis, even in the context of current depression. One manic episode = Bipolar I.',
      category: 'Bipolar Disorder',
    },
    {
      id: 2,
      question: 'A 45-year-old man with chronic alcohol use presents to the ED 48 hours after his last drink with confusion, visual hallucinations, tremor, tachycardia (HR 135), and hypertension (BP 175/100). What is the most likely diagnosis?',
      options: [
        'Early alcohol withdrawal',
        'Alcohol withdrawal seizure',
        'Delirium tremens',
        'Alcohol intoxication',
      ],
      correctAnswer: 2,
      explanation: 'Delirium tremens (DTs) typically occurs 48-96 hours after last drink and presents with confusion/delirium, hallucinations, severe autonomic instability. This is a medical emergency with significant mortality risk if untreated.',
      category: 'Substance Use Disorders',
    },
    {
      id: 3,
      question: 'A 22-year-old college student describes sudden episodes of intense fear that peak within minutes, accompanied by palpitations, sweating, trembling, shortness of breath, and fear of dying. Episodes occur unpredictably 2-3 times per week. Between episodes, she worries constantly about having another attack. What is the most likely diagnosis?',
      options: [
        'Generalized Anxiety Disorder',
        'Panic Disorder',
        'Social Anxiety Disorder',
        'Cardiac arrhythmia',
      ],
      correctAnswer: 1,
      explanation: 'Recurrent unexpected panic attacks (abrupt surge of fear peaking within minutes with ≥4 symptoms) plus persistent concern about future attacks indicates Panic Disorder. The anticipatory anxiety between attacks is a key feature.',
      category: 'Anxiety Disorders',
    },
    {
      id: 4,
      question: 'A 35-year-old combat veteran describes intrusive memories of a traumatic event, nightmares, avoidance of trauma reminders, hypervigilance, and exaggerated startle response for the past 8 months. What is the most likely diagnosis?',
      options: [
        'Acute Stress Disorder',
        'Post-Traumatic Stress Disorder',
        'Adjustment Disorder',
        'Generalized Anxiety Disorder',
      ],
      correctAnswer: 1,
      explanation: 'Symptoms lasting >1 month following trauma exposure, including intrusion (memories, nightmares), avoidance, negative alterations, and increased arousal, meet criteria for PTSD. Duration >1 month rules out Acute Stress Disorder.',
      category: 'PTSD',
    },
    {
      id: 5,
      question: 'A 30-year-old man presents with auditory hallucinations, paranoid delusions, and social/occupational decline for 8 months. He denies mood symptoms. What is the most likely diagnosis?',
      options: [
        'Schizophrenia',
        'Schizoaffective Disorder',
        'Brief Psychotic Disorder',
        'Bipolar Disorder with Psychotic Features',
      ],
      correctAnswer: 0,
      explanation: 'Duration ≥6 months with hallucinations, delusions, and functional decline WITHOUT significant mood episodes indicates Schizophrenia. Absence of mood symptoms rules out schizoaffective and bipolar diagnoses.',
      category: 'Schizophrenia & Psychosis',
    },
    {
      id: 6,
      question: 'An 8-year-old boy has difficulty paying attention in class, makes careless mistakes, loses school supplies, and is easily distracted. His teacher reports these problems have been present since kindergarten. He does not have hyperactivity or impulsivity. What is the most likely diagnosis?',
      options: [
        'ADHD - Combined Presentation',
        'ADHD - Predominantly Inattentive Presentation',
        'ADHD - Predominantly Hyperactive-Impulsive Presentation',
        'Anxiety Disorder',
      ],
      correctAnswer: 1,
      explanation: 'Meets inattention criteria (≥6 symptoms for children) with childhood onset and no hyperactivity-impulsivity symptoms. This indicates ADHD Predominantly Inattentive Presentation, often underdiagnosed.',
      category: 'ADHD',
    },
    {
      id: 7,
      question: 'A 25-year-old woman presents with unstable relationships, fear of abandonment, self-harm when distressed, chronic feelings of emptiness, and intense anger. Mood shifts occur within hours in response to interpersonal stressors. What is the most likely diagnosis?',
      options: [
        'Bipolar Disorder',
        'Major Depressive Disorder',
        'Borderline Personality Disorder',
        'Histrionic Personality Disorder',
      ],
      correctAnswer: 2,
      explanation: 'Pattern of instability in relationships, self-image, and affects, with marked impulsivity and self-harm behavior indicates Borderline Personality Disorder. Mood shifts within HOURS (not days-weeks) distinguish from bipolar disorder.',
      category: 'Personality Disorders',
    },
    {
      id: 8,
      question: 'A patient presents 18 hours after last heroin use with lacrimation, rhinorrhea, yawning, piloerection, dilated pupils, diarrhea, and muscle aches. Vital signs: HR 95, BP 135/85. What is the most appropriate characterization?',
      options: [
        'Life-threatening withdrawal requiring immediate hospitalization',
        'Opioid withdrawal - uncomfortable but not life-threatening',
        'Alcohol withdrawal',
        'Opioid intoxication',
      ],
      correctAnswer: 1,
      explanation: 'Classic opioid withdrawal symptoms (flu-like symptoms, piloerection, mydriasis, GI hyperactivity). Unlike alcohol/benzodiazepine withdrawal, opioid withdrawal is NOT life-threatening, though very uncomfortable.',
      category: 'Substance Use Disorders',
    },
    {
      id: 9,
      question: 'A 32-year-old man presents with depressed mood, anhedonia, insomnia, and poor concentration for 4 weeks. On further questioning, he reports a 5-day period last year of elevated mood, increased energy, and decreased need for sleep, but was still able to work and did not require hospitalization. What is the most likely diagnosis?',
      options: [
        'Major Depressive Disorder',
        'Bipolar I Disorder',
        'Bipolar II Disorder',
        'Cyclothymic Disorder',
      ],
      correctAnswer: 2,
      explanation: 'Current major depressive episode plus history of hypomanic episode (≥4 days of elevated mood with NO marked impairment or hospitalization) indicates Bipolar II Disorder. No history of mania rules out Bipolar I.',
      category: 'Bipolar Disorder',
    },
    {
      id: 10,
      question: 'A 40-year-old woman presents with depressed mood, anhedonia, psychomotor retardation, and delusions that she has committed unforgivable sins despite no evidence of wrongdoing. What is the most appropriate classification?',
      options: [
        'Major Depressive Disorder - Mild',
        'Major Depressive Disorder - Moderate',
        'Major Depressive Disorder with Psychotic Features',
        'Schizoaffective Disorder',
      ],
      correctAnswer: 2,
      explanation: 'Delusions (fixed false beliefs) occurring during a major depressive episode indicate MDD with Psychotic Features. This is a severe form requiring different treatment approach (typically antipsychotic + antidepressant).',
      category: 'Major Depressive Disorder',
    },
  ]

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)
  }

  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const currentQ = questions[currentQuestion]
  const isCorrect = selectedAnswer === currentQ.correctAnswer

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <ClipboardList className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Clinical Assessment</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Test your knowledge with clinical vignettes and case-based questions
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This assessment is for educational purposes only. No scores or progress are tracked.
          </p>
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
              <CardDescription className="mt-2">
                Category: {currentQ.category}
              </CardDescription>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-base leading-relaxed">{currentQ.question}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  !showExplanation
                    ? 'hover:bg-secondary cursor-pointer'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                      : 'bg-red-100 dark:bg-red-900/30 border-red-500'
                    : index === currentQ.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                    : 'opacity-50'
                } ${selectedAnswer === index && !showExplanation ? 'bg-primary/10 border-primary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[24px]">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showExplanation && index === currentQ.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                  {showExplanation && selectedAnswer === index && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-lg border ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  {!isCorrect && (
                    <p className="text-sm mt-1">
                      The correct answer is: <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
                    </p>
                  )}
                </div>
              </div>
              <div className="pl-9">
                <p className="text-sm"><strong>Explanation:</strong></p>
                <p className="text-sm mt-2">{currentQ.explanation}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              Previous Question
            </Button>
            <Button
              onClick={handleNext}
            >
              Next Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                Select your answer to see immediate feedback and explanation
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                Read the explanation carefully to understand the reasoning
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                Use "Next Question" to continue practicing
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">
                No scores are saved - focus on learning, not performance
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
