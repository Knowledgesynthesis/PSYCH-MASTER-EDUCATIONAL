import type { GlossaryTerm } from './types'

const t = (term: string, category: string, definition: string, contrast?: string): GlossaryTerm => ({ term, category, definition, contrast })

export const GLOSSARY: GlossaryTerm[] = [
  // Mental status: mood & affect
  t('Affect', 'Mental status', 'Observed expression of emotion — described by range, intensity, reactivity, congruence and stability.', 'Mood is the patient’s reported state; affect is what you observe.'),
  t('Mood', 'Mental status', 'The patient’s sustained, subjective emotional state, ideally recorded in their own words.'),
  t('Blunted affect', 'Mental status', 'Markedly reduced intensity of emotional expression.', 'Flat = virtually none; restricted = reduced range.'),
  t('Labile affect', 'Mental status', 'Rapid, often unprovoked shifts in emotional expression.'),
  t('Incongruent affect', 'Mental status', 'Expression that does not match the stated mood or content (e.g. laughing while describing a death).'),
  t('Euthymia', 'Mood', 'Normal, stable mood — neither depressed nor elevated.'),
  t('Dysphoria', 'Mood', 'An unpleasant mood state (sadness, irritability, unease).'),
  t('Anhedonia', 'Mood', 'Loss of interest or pleasure in previously enjoyed activities — a core MDE symptom and a negative symptom of schizophrenia.'),
  t('Mixed features', 'Mood', 'Specifier for ≥3 opposite-pole symptoms during a manic, hypomanic or depressive episode.'),
  t('Rapid cycling', 'Mood', '≥4 mood episodes (mania, hypomania or depression) within 12 months.'),
  t('Hypomania', 'Mood', '≥4 days of abnormal mood + increased energy with ≥3 DIGFAST symptoms; observable change without marked impairment, hospitalization or psychosis.'),
  t('Mania', 'Mood', '≥7 days (any duration if hospitalized) of abnormal mood + increased energy with ≥3 DIGFAST symptoms (4 if irritable only), causing marked impairment, hospitalization or psychosis.'),
  t('Persistent depressive disorder', 'Mood', 'Depressed mood most days for ≥2 years (1 year in youth) with ≥2 symptoms; formerly “dysthymia”.'),
  t('Psychomotor retardation', 'Mood', 'Observable slowing of movement, speech and thought.'),
  t('Psychomotor agitation', 'Mood', 'Excessive, purposeless motor activity associated with inner tension.'),
  t('Rumination', 'Mood', 'Repetitive, passive focus on distress and its causes and consequences.'),

  // Thought process
  t('Circumstantiality', 'Thought process', 'Over-inclusive, detailed speech that eventually reaches the point.', 'Tangentiality never reaches it.'),
  t('Tangentiality', 'Thought process', 'Replies drift away from the question and never return to the goal.'),
  t('Flight of ideas', 'Thought process', 'Rapid, accelerated shifts between ideas with recognizable links (puns, rhymes), typically with pressured speech — characteristic of mania.'),
  t('Clang associations', 'Thought process', 'Words chosen by sound (rhyme, alliteration) rather than meaning.'),
  t('Loose associations (derailment)', 'Thought process', 'Shifts between ideas with no apparent logical connection.'),
  t('Word salad', 'Thought process', 'Incoherent jumble of words and phrases — the most severe disorganization.'),
  t('Neologism', 'Thought process', 'A newly invented word whose meaning is known only to the speaker.'),
  t('Thought blocking', 'Thought process', 'Abrupt interruption of speech mid-thought, often with no memory of the thread.'),
  t('Perseveration', 'Thought process', 'Persistent repetition of a word, idea or action beyond its relevance — suggests frontal/organic pathology.'),
  t('Pressured speech', 'Thought process', 'Rapid, increased, difficult-to-interrupt speech.'),
  t('Alogia', 'Thought process', 'Poverty of speech — brief, empty replies; a negative symptom.'),

  // Thought content
  t('Delusion', 'Thought content', 'A fixed false belief not shared by the person’s culture, held despite clear contradictory evidence.', 'Overvalued idea: held with less than delusional conviction.'),
  t('Overvalued idea', 'Thought content', 'An unreasonable, sustained belief held with less than delusional intensity.'),
  t('Persecutory delusion', 'Thought content', 'Belief of being harmed, followed, poisoned or conspired against — the most common type.'),
  t('Ideas of reference', 'Thought content', 'Belief that neutral events (TV, conversations) refer specifically to oneself; delusions of reference when fixed.'),
  t('Grandiose delusion', 'Thought content', 'Belief in exceptional abilities, wealth, fame or a special mission.'),
  t('Nihilistic delusion', 'Thought content', 'Belief that oneself, body parts or the world do not exist or are dead (Cotard syndrome); typical of severe psychotic depression.'),
  t('Erotomanic delusion', 'Thought content', 'Belief that another person, often of higher status, is in love with the individual.'),
  t('Thought insertion / withdrawal / broadcasting', 'Thought content', 'Beliefs that thoughts are placed into, removed from, or audible outside one’s mind — passivity phenomena.'),
  t('Magical thinking', 'Thought content', 'Belief that thoughts, words or rituals can influence events without a causal link; seen in schizotypal PD, OCD and children.'),
  t('Obsession', 'Thought content', 'Recurrent, intrusive, unwanted thought, image or urge causing distress, which the person tries to suppress or neutralize.', 'Ego-dystonic — unlike a delusion or worry.'),
  t('Compulsion', 'Thought content', 'Repetitive behavior or mental act performed to reduce distress or prevent a feared outcome, in response to an obsession or rigid rules.'),
  t('Suicidal ideation (passive vs active)', 'Thought content', 'Passive: wishing to be dead. Active: thoughts of killing oneself. Always characterize intent, plan, preparation and means.'),

  // Perception
  t('Hallucination', 'Perception', 'Perception without an external stimulus — auditory most common in primary psychosis; visual, tactile or olfactory suggest medical/substance causes.', 'Illusion: misperception of a real stimulus.'),
  t('Illusion', 'Perception', 'Misinterpretation of a real external stimulus.'),
  t('Command hallucination', 'Perception', 'Voices instructing the person to act; assess content (harm to self/others), ability to resist and history of compliance.'),
  t('Depersonalization', 'Perception', 'Feeling detached from one’s own thoughts, body or actions, with intact reality testing.'),
  t('Derealization', 'Perception', 'Feeling that surroundings are unreal, dreamlike or distant.'),
  t('Flashback', 'Perception', 'Dissociative reaction in which the person feels or acts as if a traumatic event were recurring.'),

  // Cognition, insight, capacity
  t('Sensorium', 'Cognition', 'Level of consciousness and orientation; clouded in delirium.'),
  t('Confabulation', 'Cognition', 'Unintentional fabrication of memories to fill gaps — classic in Korsakoff syndrome.'),
  t('Anosognosia', 'Cognition', 'Neurologically based lack of awareness of one’s illness; common in schizophrenia and after right-hemisphere stroke.'),
  t('Insight', 'Cognition', 'Awareness of having an illness, its effects and the need for treatment.'),
  t('Judgment', 'Cognition', 'The quality of real-world decisions, best assessed from recent behavior.'),
  t('Decision-making capacity', 'Cognition', 'Ability to communicate a choice, understand, appreciate and reason about a specific decision. Decision- and time-specific.'),
  t('Delirium', 'Cognition', 'Acute, fluctuating disturbance of attention and awareness due to a medical condition, substance or withdrawal.'),

  // Psychosis & motor
  t('Avolition', 'Psychosis', 'Reduced initiation and persistence of goal-directed activity; a negative symptom.'),
  t('Asociality', 'Psychosis', 'Reduced interest in social interaction; a negative symptom.'),
  t('Prodrome', 'Psychosis', 'Attenuated symptoms and functional decline preceding a first psychotic episode; counts toward the 6-month schizophrenia criterion.'),
  t('Catatonia', 'Psychosis', 'Psychomotor syndrome (stupor, mutism, posturing, negativism, waxy flexibility, echo phenomena, excitement) occurring in mood, psychotic, medical and drug-related conditions.'),
  t('Waxy flexibility', 'Psychosis', 'Slight, even resistance to repositioning, after which the limb stays in place.'),
  t('Negativism', 'Psychosis', 'Apparently motiveless resistance to instructions or attempts to move the person.'),
  t('Echolalia / echopraxia', 'Psychosis', 'Mimicking another person’s speech / movements.'),
  t('Akathisia', 'Medication effects', 'Subjective inner restlessness with an urge to move, usually from dopamine antagonists; raises non-adherence and suicide risk.'),
  t('Acute dystonia', 'Medication effects', 'Sustained painful muscle contraction (torticollis, oculogyric crisis) within hours–days of a D2 antagonist; treat with benztropine or diphenhydramine.'),
  t('Tardive dyskinesia', 'Medication effects', 'Late-onset involuntary choreoathetoid movements, often orofacial, after long D2 antagonist exposure; treat with VMAT2 inhibitors.'),
  t('Neuroleptic malignant syndrome', 'Medication effects', 'Life-threatening reaction to dopamine antagonists: altered mental status, lead-pipe rigidity, hyperthermia, autonomic instability, high CK.'),
  t('Serotonin syndrome', 'Medication effects', 'Serotonergic excess within hours of a drug change: clonus, hyperreflexia, agitation, diaphoresis, diarrhea, hyperthermia.'),

  // Anxiety & trauma
  t('Agoraphobia', 'Anxiety & trauma', 'Fear and avoidance of ≥2 of 5 situations (transport, open spaces, enclosed spaces, crowds/lines, outside alone) because escape or help may be unavailable.'),
  t('Panic attack', 'Anxiety & trauma', 'Abrupt surge of intense fear peaking within minutes with ≥4 of 13 physical or cognitive symptoms.'),
  t('Anticipatory anxiety', 'Anxiety & trauma', 'Worry about future panic attacks or feared situations — maintains avoidance.'),
  t('Hypervigilance', 'Anxiety & trauma', 'Heightened scanning for threat; a PTSD arousal symptom.'),
  t('Ego-dystonic', 'Anxiety & trauma', 'Experienced as alien, unwanted and inconsistent with one’s values (e.g. OCD obsessions).'),
  t('Ego-syntonic', 'Anxiety & trauma', 'Experienced as consistent with one’s self-image (e.g. OCPD perfectionism).'),
  t('Exposure and response prevention (ERP)', 'Anxiety & trauma', 'CBT for OCD: graded exposure to feared cues while refraining from compulsions.'),

  // Substance use
  t('Tolerance', 'Substance use', 'Needing more substance for the same effect, or reduced effect from the same amount.'),
  t('Withdrawal', 'Substance use', 'A substance-specific syndrome after stopping or reducing use, or use to relieve/avoid it.'),
  t('Physiological dependence', 'Substance use', 'Tolerance and withdrawal — expected with many prescribed medications and not, by itself, a substance use disorder.'),
  t('Precipitated withdrawal', 'Substance use', 'Abrupt, severe withdrawal when an antagonist (naloxone, naltrexone) or high-affinity partial agonist (buprenorphine) displaces a full agonist.'),
  t('Kindling', 'Substance use', 'Progressive worsening of alcohol withdrawal severity with repeated withdrawal episodes.'),
  t('Delirium tremens', 'Substance use', 'Alcohol-withdrawal delirium with autonomic hyperactivity, typically 48–96 h after the last drink.'),
  t('Wernicke encephalopathy', 'Substance use', 'Acute thiamine deficiency: confusion, ataxia, ophthalmoplegia/nystagmus (full triad in a minority) — treat with high-dose IV thiamine.'),
  t('Korsakoff syndrome', 'Substance use', 'Chronic amnestic syndrome after Wernicke encephalopathy: anterograde amnesia with confabulation.'),
  t('Piloerection', 'Substance use', '“Goosebumps” — a sign of opioid withdrawal.'),
  t('Mydriasis / miosis', 'Substance use', 'Pupil dilation (opioid withdrawal, sympathomimetics, anticholinergics) / constriction (opioid intoxication).'),
  t('Harm reduction', 'Substance use', 'Practical strategies that reduce the harms of ongoing use (naloxone, sterile supplies, test strips) without requiring abstinence.'),
  t('Contingency management', 'Substance use', 'Tangible rewards for objectively verified abstinence — the best-supported treatment for stimulant use disorder.'),

  // Personality & therapy
  t('Splitting', 'Personality & therapy', 'Viewing people as all-good or all-bad; can divide treatment teams — counter with consistent, coordinated care.'),
  t('Dialectical behavior therapy (DBT)', 'Personality & therapy', 'Skills-based therapy (mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness) — first-line for BPD with self-harm.'),
  t('Mentalization', 'Personality & therapy', 'The capacity to understand behavior in terms of mental states — the target of mentalization-based treatment for BPD.'),
  t('Behavioral activation', 'Personality & therapy', 'Structured scheduling of valued and rewarding activities — an effective first-line psychotherapy for depression.'),
  t('Measurement-based care', 'Personality & therapy', 'Routine use of validated scales to track symptoms and adjust treatment toward targets.'),
  t('Safety plan', 'Personality & therapy', 'A written, collaborative, stepwise plan for suicidal crises, including lethal-means restriction and crisis contacts.'),
]
