import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { BookOpen, Search } from 'lucide-react'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const glossaryTerms: GlossaryTerm[] = [
    { term: 'Affect', definition: 'Observable expression of emotion (e.g., facial expression, tone of voice)', category: 'General' },
    { term: 'Agoraphobia', definition: 'Fear of places or situations where escape might be difficult', category: 'Anxiety' },
    { term: 'Akathisia', definition: 'Restlessness and inability to sit still; common medication side effect', category: 'General' },
    { term: 'Alogia', definition: 'Poverty of speech; brief, concrete replies', category: 'Psychosis' },
    { term: 'Anhedonia', definition: 'Inability to experience pleasure from previously enjoyable activities', category: 'Mood' },
    { term: 'Avolition', definition: 'Decreased motivation and ability to initiate goal-directed activities', category: 'Psychosis' },
    { term: 'Catatonia', definition: 'Marked psychomotor disturbance (immobility, rigidity, or excessive activity)', category: 'Psychosis' },
    { term: 'Circumstantiality', definition: 'Excessive, unnecessary detail but eventually reaches the point', category: 'Psychosis' },
    { term: 'Compulsion', definition: 'Repetitive behavior performed to reduce anxiety from an obsession', category: 'Anxiety' },
    { term: 'Delusion', definition: 'Fixed false belief not consistent with cultural background', category: 'Psychosis' },
    { term: 'Depersonalization', definition: 'Feeling detached from oneself, as if observing from outside', category: 'General' },
    { term: 'Derealization', definition: 'Feeling that surroundings are unreal or dreamlike', category: 'General' },
    { term: 'Dysphoria', definition: 'Unpleasant or uncomfortable mood state', category: 'Mood' },
    { term: 'Dysthymia', definition: 'Persistent depressive disorder; chronic low-grade depression ≥2 years', category: 'Mood' },
    { term: 'Echolalia', definition: 'Repetition of others\' words', category: 'Psychosis' },
    { term: 'Echopraxia', definition: 'Repetition of others\' movements', category: 'Psychosis' },
    { term: 'Ego-dystonic', definition: 'Thoughts/behaviors inconsistent with self-image (experienced as distressing)', category: 'General' },
    { term: 'Ego-syntonic', definition: 'Thoughts/behaviors consistent with self-image (not experienced as problematic)', category: 'General' },
    { term: 'Euthymia', definition: 'Normal, non-depressed, reasonably positive mood', category: 'Mood' },
    { term: 'Flight of Ideas', definition: 'Rapid shift from one idea to another; thoughts loosely connected', category: 'Mood' },
    { term: 'Grandiosity', definition: 'Exaggerated sense of importance, power, knowledge, or identity', category: 'Mood' },
    { term: 'Hallucination', definition: 'Sensory perception without external stimulus (auditory, visual, tactile)', category: 'Psychosis' },
    { term: 'Hypervigilance', definition: 'Enhanced state of alertness and scanning for threats', category: 'Trauma' },
    { term: 'Hypomania', definition: 'Milder elevated mood ≥4 days without marked impairment', category: 'Mood' },
    { term: 'Illusion', definition: 'Misperception of real external stimulus', category: 'Psychosis' },
    { term: 'Labile', definition: 'Rapidly shifting emotions', category: 'General' },
    { term: 'Loose Associations', definition: 'Disorganized thinking with unclear connections between ideas', category: 'Psychosis' },
    { term: 'Mania', definition: 'Elevated mood ≥7 days with marked impairment or psychosis', category: 'Mood' },
    { term: 'Mood', definition: 'Sustained internal emotional state (what patient reports)', category: 'General' },
    { term: 'Neologism', definition: 'Made-up word with meaning only to the speaker', category: 'Psychosis' },
    { term: 'Obsession', definition: 'Recurrent, intrusive, unwanted thought causing anxiety', category: 'Anxiety' },
    { term: 'Paranoia', definition: 'Persistent suspicion and mistrust of others', category: 'Psychosis' },
    { term: 'Perseveration', definition: 'Persistent repetition of word, phrase, or action', category: 'General' },
    { term: 'Piloerection', definition: 'Goosebumps; classic sign of opioid withdrawal', category: 'Substance Use' },
    { term: 'Pressured Speech', definition: 'Rapid, increased, difficult-to-interrupt speech', category: 'Mood' },
    { term: 'Psychomotor Agitation', definition: 'Excessive motor activity associated with tension', category: 'General' },
    { term: 'Psychomotor Retardation', definition: 'Slowed movements, speech, and thinking', category: 'Mood' },
    { term: 'Rumination', definition: 'Repetitive, passive focus on negative thoughts', category: 'Mood' },
    { term: 'Sensorium', definition: 'State of awareness (orientation, attention, consciousness)', category: 'General' },
    { term: 'Suicidal Ideation', definition: 'Thoughts about death or suicide (passive vs active)', category: 'General' },
    { term: 'Tangentiality', definition: 'Veering off topic; never reaches the point', category: 'Psychosis' },
    { term: 'Thought Blocking', definition: 'Abrupt interruption in thought process', category: 'Psychosis' },
    { term: 'Thought Broadcasting', definition: 'Belief that thoughts are audible to others', category: 'Psychosis' },
    { term: 'Thought Insertion', definition: 'Belief that thoughts are placed in one\'s mind by external force', category: 'Psychosis' },
    { term: 'Thought Withdrawal', definition: 'Belief that thoughts are removed from one\'s mind', category: 'Psychosis' },
    { term: 'Word Salad', definition: 'Incoherent mix of words and phrases', category: 'Psychosis' },
  ]

  const categories = ['All', 'General', 'Mood', 'Psychosis', 'Anxiety', 'Trauma', 'Substance Use']

  const filteredTerms = glossaryTerms
    .filter((item) => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => a.term.localeCompare(b.term))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Psychiatric Glossary</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Essential psychiatric terminology reference
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Showing {filteredTerms.length} of {glossaryTerms.length} terms
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Glossary Terms */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.term}</CardTitle>
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                    {item.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.definition}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-muted-foreground">No terms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
