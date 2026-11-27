/**
 * Transparent weighted-feature differentiator for the hyperthermic/rigid/
 * agitated patient. Weights encode classic discriminating features; the UI
 * shows which findings drove each ranking so the learner sees the logic.
 */

export type SyndromeId = 'ss' | 'nms' | 'ac' | 'mh' | 'mc' | 'sym' | 'wd'

export interface Syndrome {
  id: SyndromeId
  name: string
  key: string
  management: string[]
}

export const SYNDROMES: Syndrome[] = [
  {
    id: 'ss',
    name: 'Serotonin syndrome',
    key: 'Hours after a serotonergic change. Clonus (inducible, ocular, spontaneous) and hyperreflexia, worse in the legs; diarrhea, diaphoresis, mydriasis. Hunter criteria.',
    management: [
      'Stop all serotonergic agents (SSRIs/SNRIs, MAOIs, linezolid, tramadol, fentanyl, methylene blue, triptans, dextromethorphan, ondansetron in combination).',
      'Benzodiazepines for agitation and muscle activity; cyproheptadine for moderate cases.',
      'Temperature >41 °C: sedation, non-depolarizing paralysis and intubation — antipyretics do not work (heat is muscular). Avoid physical restraints.',
      'Usually resolves within 24 h once the drug is stopped (longer with MAOIs or long half-life drugs).',
    ],
  },
  {
    id: 'nms',
    name: 'Neuroleptic malignant syndrome',
    key: 'Days after starting/increasing a dopamine antagonist (or stopping levodopa). Evolves over 1–3 days: altered mental status, lead-pipe rigidity, hyperthermia, autonomic instability; bradyreflexia; very high CK.',
    management: [
      'Stop the antipsychotic (or restart the withdrawn dopaminergic drug). ICU-level supportive care: cooling, IV fluids, monitor renal function/CK.',
      'Benzodiazepines; for moderate–severe cases dantrolene, bromocriptine or amantadine (low-quality evidence). ECT if refractory or catatonic features.',
      'Wait ≥2 weeks after resolution before cautious rechallenge with a lower-potency agent.',
    ],
  },
  {
    id: 'ac',
    name: 'Anticholinergic toxicity',
    key: '“Hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter, full as a flask.” Dry skin, urinary retention and absent bowel sounds distinguish it from serotonin syndrome. Normal reflexes.',
    management: [
      'Stop the agent (diphenhydramine, TCAs, benztropine, scopolamine, olanzapine/clozapine, antihistamines).',
      'Benzodiazepines for agitation; cooling; bladder catheter.',
      'Physostigmine (toxicology input) reverses delirium if ECG shows no QRS widening/heart block.',
    ],
  },
  {
    id: 'mh',
    name: 'Malignant hyperthermia',
    key: 'Minutes–hours after volatile anesthetic or succinylcholine; rising end-tidal CO2, masseter/generalized rigidity, hyperthermia, hyperkalemia.',
    management: ['Stop triggers, hyperventilate with 100% O2, dantrolene immediately, active cooling, treat hyperkalemia and acidosis.'],
  },
  {
    id: 'mc',
    name: 'Malignant (lethal) catatonia',
    key: 'Catatonic signs (mutism, staring, posturing, negativism, waxy flexibility) with fever and autonomic instability; may precede antipsychotic exposure. Clinically overlaps with NMS.',
    management: ['Hold antipsychotics. High-dose IV lorazepam; urgent ECT if no rapid response (can be life-saving). Supportive ICU care.'],
  },
  {
    id: 'sym',
    name: 'Sympathomimetic toxicity',
    key: 'Cocaine/amphetamines/cathinones: agitation, tachycardia, hypertension, mydriasis and diaphoresis (wet skin — unlike anticholinergic).',
    management: ['Benzodiazepines first-line; aggressive cooling; ECG and troponin for chest pain; check for rhabdomyolysis.'],
  },
  {
    id: 'wd',
    name: 'Alcohol or sedative withdrawal',
    key: 'Hours–days after stopping alcohol/benzodiazepines/barbiturates: tremor, sweating, tachycardia, hallucinations; seizures and delirium tremens in severe cases.',
    management: ['Benzodiazepines (or phenobarbital) titrated to symptoms; thiamine before or with glucose; see the Substance Use module.'],
  },
]

export interface Finding {
  id: string
  label: string
  group: 'Exposure' | 'Time course' | 'Neuromuscular' | 'Autonomic & skin' | 'Other'
  weights: Partial<Record<SyndromeId, number>>
}

export const FINDINGS: Finding[] = [
  { id: 'serotonergic', label: 'Serotonergic drug started, increased or combined', group: 'Exposure', weights: { ss: 3 } },
  { id: 'antidopamine', label: 'Antipsychotic/antiemetic started or increased (or levodopa stopped)', group: 'Exposure', weights: { nms: 3, mc: 1 } },
  { id: 'anticholinergic', label: 'Anticholinergic drug or overdose', group: 'Exposure', weights: { ac: 3 } },
  { id: 'anesthetic', label: 'Volatile anesthetic or succinylcholine', group: 'Exposure', weights: { mh: 4 } },
  { id: 'stimulant', label: 'Cocaine, amphetamine or cathinone use', group: 'Exposure', weights: { sym: 3 } },
  { id: 'stoppedSedative', label: 'Stopped alcohol, benzodiazepine or barbiturate', group: 'Exposure', weights: { wd: 3, mc: 1 } },
  { id: 'hours', label: 'Onset within hours (<24 h)', group: 'Time course', weights: { ss: 2, mh: 2, ac: 1, sym: 1, nms: -1 } },
  { id: 'days', label: 'Onset/evolution over days', group: 'Time course', weights: { nms: 2, mc: 1, wd: 1, ss: -1, mh: -2 } },
  { id: 'clonus', label: 'Clonus — inducible, ocular or spontaneous', group: 'Neuromuscular', weights: { ss: 3, nms: -2 } },
  { id: 'hyperreflexia', label: 'Hyperreflexia (legs > arms)', group: 'Neuromuscular', weights: { ss: 2, wd: 1, nms: -1 } },
  { id: 'leadpipe', label: 'Lead-pipe rigidity', group: 'Neuromuscular', weights: { nms: 3, mh: 2, mc: 2 } },
  { id: 'bradyreflexia', label: 'Reduced reflexes (bradyreflexia)', group: 'Neuromuscular', weights: { nms: 2, ss: -2 } },
  { id: 'tremor', label: 'Tremor', group: 'Neuromuscular', weights: { ss: 1, wd: 2, sym: 1 } },
  { id: 'catatonic', label: 'Mutism, staring, posturing, negativism, waxy flexibility', group: 'Neuromuscular', weights: { mc: 4, nms: 1 } },
  { id: 'diaphoresis', label: 'Diaphoresis (wet skin)', group: 'Autonomic & skin', weights: { ss: 1, nms: 1, sym: 1, wd: 1, ac: -3 } },
  { id: 'dryskin', label: 'Dry, hot, flushed skin', group: 'Autonomic & skin', weights: { ac: 3, ss: -2, sym: -1, wd: -1 } },
  { id: 'mydriasis', label: 'Mydriasis', group: 'Autonomic & skin', weights: { ss: 1, ac: 2, sym: 2, wd: 1 } },
  { id: 'retention', label: 'Urinary retention / absent bowel sounds', group: 'Autonomic & skin', weights: { ac: 3, ss: -1 } },
  { id: 'diarrhea', label: 'Hyperactive bowel sounds / diarrhea', group: 'Autonomic & skin', weights: { ss: 2, ac: -2 } },
  { id: 'fever', label: 'Temperature >38.5 °C', group: 'Autonomic & skin', weights: { ss: 1, nms: 1, mh: 1, mc: 1, ac: 1, sym: 1 } },
  { id: 'etco2', label: 'Rising end-tidal CO2 under anesthesia', group: 'Other', weights: { mh: 4 } },
  { id: 'ck', label: 'Markedly raised CK', group: 'Other', weights: { nms: 2, mh: 2, mc: 1, sym: 1 } },
  { id: 'hallucinations', label: 'Visual or tactile hallucinations', group: 'Other', weights: { wd: 1, ac: 1 } },
]

export interface RankedSyndrome {
  syndrome: Syndrome
  score: number
  supporting: string[]
  against: string[]
}

export function rankSyndromes(selected: string[]): RankedSyndrome[] {
  const set = new Set(selected)
  const chosen = FINDINGS.filter((f) => set.has(f.id))
  return SYNDROMES.map((syndrome) => {
    let score = 0
    const supporting: string[] = []
    const against: string[] = []
    for (const f of chosen) {
      const w = f.weights[syndrome.id] ?? 0
      score += w
      if (w > 0) supporting.push(f.label)
      if (w < 0) against.push(f.label)
    }
    return { syndrome, score, supporting, against }
  }).sort((a, b) => b.score - a.score || b.supporting.length - a.supporting.length)
}

/** Hunter Serotonin Toxicity Criteria (sensitivity 84%, specificity 97% vs toxicologist diagnosis). */
export interface HunterInput {
  serotonergic: boolean
  spontaneousClonus: boolean
  inducibleClonus: boolean
  ocularClonus: boolean
  agitation: boolean
  diaphoresis: boolean
  tremor: boolean
  hyperreflexia: boolean
  hypertonia: boolean
  tempOver38: boolean
}

export function hunterCriteria(h: HunterInput): { met: boolean; rule: string | null } {
  if (!h.serotonergic) return { met: false, rule: null }
  if (h.spontaneousClonus) return { met: true, rule: 'Spontaneous clonus' }
  if (h.inducibleClonus && (h.agitation || h.diaphoresis)) return { met: true, rule: 'Inducible clonus + agitation or diaphoresis' }
  if (h.ocularClonus && (h.agitation || h.diaphoresis)) return { met: true, rule: 'Ocular clonus + agitation or diaphoresis' }
  if (h.tremor && h.hyperreflexia) return { met: true, rule: 'Tremor + hyperreflexia' }
  if (h.hypertonia && h.tempOver38 && (h.ocularClonus || h.inducibleClonus)) return { met: true, rule: 'Hypertonia + temperature >38 °C + ocular or inducible clonus' }
  return { met: false, rule: null }
}
