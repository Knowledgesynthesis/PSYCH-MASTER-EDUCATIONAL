import type { Reference } from './types'

const r = (id: string, year: number, type: Reference['type'], citation: string, url?: string): Reference => ({ id, year, type, citation, url })

export const REFERENCES: Reference[] = [
  // Classification
  r('dsm5tr', 2022, 'criteria', 'American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR). 2022. Still the current edition; APA published a roadmap for a future "living" DSM in Am J Psychiatry, January 2026, with no release date.', 'https://www.psychiatry.org/psychiatrists/practice/dsm'),
  r('icd11', 2022, 'criteria', 'World Health Organization. ICD-11 for Mortality and Morbidity Statistics (in force since January 2022).', 'https://icd.who.int/'),

  // Learning & measurement
  r('guo-2015', 2015, 'trial', 'Guo T et al. Measurement-based care versus standard care for major depression: a randomized controlled trial with blind raters. Am J Psychiatry 2015;172:1004–1013.'),
  r('roediger-2006', 2006, 'trial', 'Roediger HL, Karpicke JD. Test-enhanced learning: taking memory tests improves long-term retention. Psychol Sci 2006;17:249–255.'),
  r('cepeda-2006', 2006, 'meta-analysis', 'Cepeda NJ et al. Distributed practice in verbal recall tasks: a review and quantitative synthesis. Psychol Bull 2006;132:354–380.'),

  // Depression
  r('canmat-mdd-2023', 2024, 'guideline', 'Lam RW et al. Canadian Network for Mood and Anxiety Treatments (CANMAT) 2023 Update on Clinical Guidelines for Management of Major Depressive Disorder in Adults. Can J Psychiatry 2024;69:641–687.'),
  r('nice-ng222', 2022, 'guideline', 'NICE guideline NG222. Depression in adults: treatment and management. 2022.', 'https://www.nice.org.uk/guidance/ng222'),
  r('uspstf-dep-2023', 2023, 'guideline', 'US Preventive Services Task Force. Screening for depression and suicide risk in adults. JAMA 2023;329:2057–2067 (depression: B; suicide risk: I).'),
  r('uspstf-anx-2023', 2023, 'guideline', 'US Preventive Services Task Force. Screening for anxiety disorders in adults (age ≤64: B). JAMA 2023;329:2163–2170.'),
  r('levis-2019', 2019, 'meta-analysis', 'Levis B et al. Accuracy of the PHQ-9 for screening to detect major depression: individual participant data meta-analysis. BMJ 2019;365:l1476.'),
  r('kroenke-2001', 2001, 'instrument', 'Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med 2001;16:606–613.'),
  r('cipriani-2018', 2018, 'meta-analysis', 'Cipriani A et al. Comparative efficacy and acceptability of 21 antidepressant drugs for acute treatment of adults with major depressive disorder: a systematic review and network meta-analysis. Lancet 2018;391:1357–1366.'),
  r('stard-2006', 2006, 'trial', 'Rush AJ et al. Acute and longer-term outcomes in depressed outpatients requiring one or several treatment steps: a STAR*D report. Am J Psychiatry 2006;163:1905–1917 (first-step citalopram remission ~28–33%).'),
  r('heijnen-2010', 2010, 'meta-analysis', 'Heijnen WT et al. Antidepressant pharmacotherapy failure and response to subsequent electroconvulsive therapy: a meta-analysis. J Clin Psychopharmacol 2010;30:616–619 (remission 48% after medication failure vs 65% without).'),
  r('henssler-2024', 2024, 'meta-analysis', 'Henssler J et al. Incidence of antidepressant discontinuation symptoms: a systematic review and meta-analysis. Lancet Psychiatry 2024;11:526–535.'),
  r('stoppd2-2019', 2019, 'trial', 'Flint AJ et al. Effect of continuing olanzapine vs placebo on relapse among patients with psychotic depression in remission (STOP-PD II). JAMA 2019;322:622–631.'),
  r('elektd-2023', 2023, 'trial', 'Anand A et al. Ketamine versus ECT for nonpsychotic treatment-resistant major depression (ELEKT-D). N Engl J Med 2023;388:2315–2325.'),
  r('fda-esketamine-2025', 2025, 'regulatory', 'FDA approval of esketamine nasal spray (Spravato) as monotherapy for treatment-resistant depression, 21 January 2025 (REMS still required).'),
  r('fda-lumateperone-2025', 2025, 'regulatory', 'FDA approval of lumateperone (Caplyta) as adjunctive therapy to antidepressants for MDD in adults, 6 November 2025.'),
  r('fda-zuranolone-2023', 2023, 'regulatory', 'FDA approval of zuranolone (Zurzuvae) for postpartum depression, August 2023. Brexanolone IV (Zulresso) was withdrawn from the market in 2024–2025.'),
  r('comp360-2026', 2026, 'regulatory', 'Compass Pathways completed its NDA for COMP360 psilocybin in treatment-resistant depression, November 2026 — not FDA-approved; psilocybin remains Schedule I.'),
  r('fda-ssri-boxed', 2007, 'regulatory', 'FDA boxed warning: antidepressants increase the risk of suicidal thinking and behavior in children, adolescents and young adults (<25 years); 2004, extended 2007.'),
  r('fda-citalopram-2011', 2012, 'regulatory', 'FDA Drug Safety Communication: citalopram dose-dependent QT prolongation — maximum 40 mg/day; 20 mg/day if >60 years, hepatic impairment or CYP2C19 poor metabolizer (2011, revised 2012).'),

  // Bipolar
  r('canmat-bd-2018', 2018, 'guideline', 'Yatham LN et al. Canadian Network for Mood and Anxiety Treatments (CANMAT) and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder. Bipolar Disord 2018;20:97–170. Evidence update: Focus 2023;21:344–353.'),
  r('isbd-mixed-2021', 2021, 'guideline', 'Yatham LN et al. CANMAT/ISBD 2021 update on clinical guidelines for management of bipolar disorder with mixed presentations. Bipolar Disord 2021;23:767–788.'),
  r('igsli-2019', 2019, 'guideline', 'Nolen WA et al. What is the optimal serum level for lithium in the maintenance treatment of bipolar disorder? A systematic review and recommendations from the ISBD/IGSLI Task Force. Bipolar Disord 2019;21:394–409.'),
  r('extrip-2015', 2015, 'guideline', 'Decker BS et al. Extracorporeal treatment for lithium poisoning: systematic review and recommendations from the EXTRIP workgroup. Clin J Am Soc Nephrol 2015;10:875–887.'),
  r('patorno-2017', 2017, 'cohort', 'Patorno E et al. Lithium use in pregnancy and the risk of cardiac malformations. N Engl J Med 2017;376:2245–2254.'),
  r('mhra-valproate-2024', 2024, 'regulatory', 'UK MHRA. Valproate: two specialists must agree before starting valproate in anyone under 55; pregnancy prevention programme for patients of childbearing potential (January 2024).'),
  r('fda-milsaperidone-2026', 2026, 'regulatory', 'FDA approval of milsaperidone (Bysanti), an active metabolite of iloperidone, for acute manic or mixed episodes of bipolar I disorder and for schizophrenia in adults, February 2026.'),
  r('katz-2022', 2022, 'trial', 'Katz IR et al. Lithium treatment in the prevention of repeat suicide-related outcomes in veterans with major depression or bipolar disorder: a randomized clinical trial. JAMA Psychiatry 2022;79:24–32.'),
  r('cipriani-2013', 2013, 'meta-analysis', 'Cipriani A et al. Lithium in the prevention of suicide in mood disorders: updated systematic review and meta-analysis. BMJ 2013;346:f3646.'),

  // Psychosis
  r('apa-scz-2020', 2020, 'guideline', 'Keepers GA et al. The American Psychiatric Association Practice Guideline for the Treatment of Patients With Schizophrenia, Third Edition. Am J Psychiatry 2020;177:868–872.'),
  r('huhn-2019', 2019, 'meta-analysis', 'Huhn M et al. Comparative efficacy and tolerability of 32 oral antipsychotics for the acute treatment of adults with multi-episode schizophrenia: a systematic review and network meta-analysis. Lancet 2019;394:939–951.'),
  r('tiihonen-2017', 2017, 'cohort', 'Tiihonen J et al. Real-world effectiveness of antipsychotic treatments in a nationwide cohort of 29,823 patients with schizophrenia. JAMA Psychiatry 2017;74:686–693.'),
  r('raise-2016', 2016, 'trial', 'Kane JM et al. Comprehensive versus usual community care for first-episode psychosis: 2-year outcomes from the NIMH RAISE Early Treatment Program. Am J Psychiatry 2016;173:362–372.'),
  r('pollak-2020', 2020, 'guideline', 'Pollak TA et al. Autoimmune psychosis: an international consensus on an approach to the diagnosis and management of psychosis of suspected autoimmune origin. Lancet Psychiatry 2020;7:93–108.'),
  r('fda-cobenfy-2024', 2024, 'regulatory', 'FDA approval of xanomeline–trospium (Cobenfy) for schizophrenia in adults, September 2024 — first antipsychotic without direct D2 blockade. The adjunctive ARISE phase 3 trial missed its primary endpoint (April 2025).'),
  r('fda-clozapine-2025', 2025, 'regulatory', 'FDA removed the clozapine REMS (enforcement ended February 2025; REMS eliminated June 13, 2025). ANC monitoring before and during treatment per prescribing information is still recommended.'),
  r('murrie-2020', 2020, 'meta-analysis', 'Murrie B et al. Transition of substance-induced, brief, and atypical psychoses to schizophrenia: a systematic review and meta-analysis. Schizophr Bull 2020;46:505–516.'),
  r('ada-apa-2004', 2004, 'guideline', 'American Diabetes Association, American Psychiatric Association, et al. Consensus development conference on antipsychotic drugs and obesity and diabetes. Diabetes Care 2004;27:596–601.'),
  r('intersept-2003', 2003, 'trial', 'Meltzer HY et al. Clozapine treatment for suicidality in schizophrenia: International Suicide Prevention Trial (InterSePT). Arch Gen Psychiatry 2003;60:82–91.'),

  // Anxiety & OCD
  r('spitzer-2006', 2006, 'instrument', 'Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med 2006;166:1092–1097.'),
  r('nice-cg113', 2020, 'guideline', 'NICE clinical guideline CG113. Generalised anxiety disorder and panic disorder in adults: management (2011, updated 2020).', 'https://www.nice.org.uk/guidance/cg113'),
  r('katzman-2014', 2014, 'guideline', 'Katzman MA et al. Canadian clinical practice guidelines for the management of anxiety, posttraumatic stress and obsessive-compulsive disorders. BMC Psychiatry 2014;14(Suppl 1):S1.'),
  r('batelaan-2017', 2017, 'meta-analysis', 'Batelaan NM et al. Risk of relapse after antidepressant discontinuation in anxiety disorders, obsessive-compulsive disorder, and post-traumatic stress disorder: systematic review and meta-analysis of relapse prevention trials. BMJ 2017;358:j3927.'),
  r('fda-benzo-2020', 2020, 'regulatory', 'FDA requires boxed warning for all benzodiazepines covering abuse, misuse, addiction, physical dependence and withdrawal (September 2020); boxed warning on co-prescription with opioids (2016).'),
  r('bzd-taper-2025', 2025, 'guideline', 'Joint Clinical Practice Guideline on Benzodiazepine Tapering: Considerations When Risks Outweigh Benefits (ASAM with nine societies). J Gen Intern Med 2025.'),

  // Trauma
  r('vadod-ptsd-2023', 2023, 'guideline', 'VA/DoD Clinical Practice Guideline for the Management of Posttraumatic Stress Disorder and Acute Stress Disorder, 2023.', 'https://www.healthquality.va.gov/guidelines/MH/ptsd/'),
  r('apa-ptsd-2025', 2025, 'guideline', 'American Psychological Association. Clinical Practice Guideline for the Treatment of Posttraumatic Stress Disorder in Adults, 2025 (recommends CPT, PE, cognitive therapy; suggests EMDR, NET and others; suggests fluoxetine, paroxetine, sertraline, venlafaxine).', 'https://www.apa.org/ptsd-guideline'),
  r('raskind-2018', 2018, 'trial', 'Raskind MA et al. Trial of prazosin for post-traumatic stress disorder in military veterans. N Engl J Med 2018;378:507–517.'),
  r('krystal-2011', 2011, 'trial', 'Krystal JH et al. Adjunctive risperidone treatment for antidepressant-resistant symptoms of chronic military service-related PTSD: a randomized trial. JAMA 2011;306:493–502.'),
  r('rose-2002', 2002, 'meta-analysis', 'Rose S, Bisson J, Churchill R, Wessely S. Psychological debriefing for preventing post traumatic stress disorder (PTSD). Cochrane Database Syst Rev 2002;(2):CD000560.'),
  r('fda-mdma', 2026, 'regulatory', 'FDA complete response letter for MDMA-assisted therapy for PTSD (August 2024); NDA resubmitted August 2026, decision pending. MDMA remains Schedule I.'),
  r('fda-brex-ptsd-2025', 2025, 'regulatory', 'FDA complete response letter declining brexpiprazole + sertraline for PTSD (September 2025) after a 10–1 advisory committee vote against efficacy.'),
  r('pcl5', 2016, 'instrument', 'Bovin MJ et al. Psychometric properties of the PTSD Checklist for DSM-5 (PCL-5) in veterans. Psychol Assess 2016;28:1379–1391.'),

  // ADHD
  r('aap-adhd-2019', 2019, 'guideline', 'Wolraich ML et al. Clinical practice guideline for the diagnosis, evaluation, and treatment of ADHD in children and adolescents. Pediatrics 2019;144:e20192528.'),
  r('nice-ng87', 2019, 'guideline', 'NICE guideline NG87. Attention deficit hyperactivity disorder: diagnosis and management (2018, updated 2019).', 'https://www.nice.org.uk/guidance/ng87'),
  r('cortese-2018', 2018, 'meta-analysis', 'Cortese S et al. Comparative efficacy and tolerability of medications for ADHD in children, adolescents, and adults: a systematic review and network meta-analysis. Lancet Psychiatry 2018;5:727–738.'),
  r('sibley-2022', 2022, 'cohort', 'Sibley MH et al. Variable patterns of remission from ADHD in the Multimodal Treatment Study of ADHD. Am J Psychiatry 2022;179:142–151.'),
  r('song-2021', 2021, 'meta-analysis', 'Song P et al. The prevalence of adult attention-deficit hyperactivity disorder: a global systematic review and meta-analysis. J Glob Health 2021;11:04009 (persistent adult ADHD ~2.6%).'),
  r('layton-2018', 2018, 'cohort', 'Layton TJ et al. Attention deficit–hyperactivity disorder and month of school enrollment. N Engl J Med 2018;379:2122–2130.'),
  r('li-2024', 2024, 'cohort', 'Li L et al. ADHD pharmacotherapy and mortality in individuals with ADHD. JAMA 2024;331:850–860.'),
  r('zhang-2024', 2024, 'cohort', 'Zhang L et al. Attention-deficit/hyperactivity disorder medications and long-term risk of cardiovascular diseases. JAMA Psychiatry 2024;81:178–187.'),
  r('moran-2024', 2024, 'cohort', 'Moran LV et al. Risk of incident psychosis and mania with prescription amphetamines. Am J Psychiatry 2024;181:901–909.'),
  r('fda-stimulants-2023', 2023, 'regulatory', 'FDA requires updated boxed warning for prescription stimulants on abuse, misuse, addiction and diversion (May 2023).'),
  r('fda-er-stimulants-2025', 2025, 'regulatory', 'FDA Drug Safety Communication: expanded labeling on weight-loss risk in patients younger than 6 years taking extended-release stimulants (30 June 2025).'),
  r('fda-centanafadine-2026', 2026, 'regulatory', 'FDA approval of centanafadine (Simtriyo), a norepinephrine–dopamine–serotonin reuptake inhibitor, for ADHD in adults and children ≥6 years (July 2026); launch pending DEA scheduling.'),

  // Substance use
  r('asam-aw-2020', 2020, 'guideline', 'American Society of Addiction Medicine. The ASAM Clinical Practice Guideline on Alcohol Withdrawal Management. J Addict Med 2020;14(3S Suppl 1):1–72.'),
  r('apa-aud-2018', 2018, 'guideline', 'Reus VI et al. The American Psychiatric Association Practice Guideline for the Pharmacological Treatment of Patients With Alcohol Use Disorder. Am J Psychiatry 2018;175:86–90.'),
  r('asam-oud-2020', 2020, 'guideline', 'American Society of Addiction Medicine. The ASAM National Practice Guideline for the Treatment of Opioid Use Disorder: 2020 Focused Update. J Addict Med 2020;14(2S Suppl 1):1–91.'),
  r('sullivan-1989', 1989, 'instrument', 'Sullivan JT et al. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict 1989;84:1353–1357.'),
  r('wesson-2003', 2003, 'instrument', 'Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs 2003;35:253–259.'),
  r('bradley-2007', 2007, 'instrument', 'Bradley KA et al. AUDIT-C as a brief screen for alcohol misuse in primary care. Alcohol Clin Exp Res 2007;31:1208–1217.'),
  r('pawss-2015', 2015, 'instrument', 'Maldonado JR et al. Prospective validation study of the Prediction of Alcohol Withdrawal Severity Scale (PAWSS) in medically ill inpatients. Alcohol Alcohol 2015;50:509–518.'),
  r('schuckit-2014', 2014, 'review', 'Schuckit MA. Recognition and management of withdrawal delirium (delirium tremens). N Engl J Med 2014;371:2109–2113.'),
  r('harper-1986', 1986, 'cohort', 'Harper CG, Giles M, Finlay-Jones R. Clinical signs in the Wernicke–Korsakoff complex: a retrospective analysis of 131 cases diagnosed at necropsy. J Neurol Neurosurg Psychiatry 1986;49:341–345.'),
  r('sordo-2017', 2017, 'meta-analysis', 'Sordo L et al. Mortality risk during and after opioid substitution treatment: systematic review and meta-analysis of cohort studies. BMJ 2017;357:j1550.'),
  r('larochelle-2018', 2018, 'cohort', 'Larochelle MR et al. Medication for opioid use disorder after nonfatal opioid overdose and association with mortality. Ann Intern Med 2018;169:137–145.'),
  r('binswanger-2007', 2007, 'cohort', 'Binswanger IA et al. Release from prison — a high risk of death for former inmates. N Engl J Med 2007;356:157–165 (first 2 weeks: all-cause death 12.7×, overdose death 129×).'),
  r('donofrio-2015', 2015, 'trial', 'D’Onofrio G et al. Emergency department–initiated buprenorphine/naloxone treatment for opioid dependence: a randomized clinical trial. JAMA 2015;313:1636–1644 (78% vs 37% engaged in treatment at 30 days).'),
  r('mat-act-2023', 2023, 'regulatory', 'Consolidated Appropriations Act, 2023 (MAT Act): the DATA-2000 "X-waiver" was eliminated; any DEA-registered practitioner with Schedule III authority may prescribe buprenorphine for OUD.'),
  r('samhsa-otp-2024', 2024, 'regulatory', 'SAMHSA final rule, 42 CFR Part 8 (February 2024): expanded methadone take-home doses, removed the 1-year addiction-history requirement, and permits telehealth buprenorphine initiation in opioid treatment programs.'),
  r('fda-naloxone-otc-2023', 2023, 'regulatory', 'FDA approves naloxone 4 mg nasal spray for over-the-counter use, March 2023.'),
  r('cdc-medetomidine', 2026, 'regulatory', 'CDC MMWR 2025 (Pittsburgh and Philadelphia case series) and CDC Health Alert Network update, April 2026: medetomidine in the fentanyl supply; severe withdrawal with sympathetic hyperactivity responsive to dexmedetomidine.'),
  r('eagles-2016', 2016, 'trial', 'Anthenelli RM et al. Neuropsychiatric safety and efficacy of varenicline, bupropion, and nicotine patch in smokers with and without psychiatric disorders (EAGLES). Lancet 2016;387:2507–2520.'),
  r('trivedi-2021', 2021, 'trial', 'Trivedi MH et al. Bupropion and naltrexone in methamphetamine use disorder (ADAPT-2). N Engl J Med 2021;384:140–153.'),
  r('glp1-aud', 2026, 'trial', 'Hendershot CS et al. Once-weekly semaglutide in adults with alcohol use disorder: a randomized clinical trial. JAMA Psychiatry 2025 (n=48); followed by a 2026 Lancet RCT in AUD with obesity (n=108). Promising but small and short.'),
  r('kelly-2020', 2020, 'meta-analysis', 'Kelly JF, Humphreys K, Ferri M. Alcoholics Anonymous and other 12-step programs for alcohol use disorder. Cochrane Database Syst Rev 2020;3:CD012880.'),
  r('uspstf-alcohol-2018', 2018, 'guideline', 'US Preventive Services Task Force. Screening and behavioral counseling interventions to reduce unhealthy alcohol use in adolescents and adults. JAMA 2018;320:1899–1909.'),

  // Personality
  r('apa-bpd-2024', 2024, 'guideline', 'American Psychiatric Association. Practice Guideline for the Treatment of Patients With Borderline Personality Disorder, Second Edition. 2024.'),
  r('zanarini-2010', 2010, 'cohort', 'Zanarini MC et al. Time to attainment of recovery from borderline personality disorder and stability of recovery: a 10-year prospective follow-up study. Am J Psychiatry 2010;167:663–667.'),
  r('storebo-2020', 2020, 'meta-analysis', 'Storebø OJ et al. Psychological therapies for people with borderline personality disorder. Cochrane Database Syst Rev 2020;5:CD012955.'),

  // Emergencies
  r('stanley-2018', 2018, 'cohort', 'Stanley B et al. Comparison of the Safety Planning Intervention with follow-up vs usual care of suicidal patients treated in the emergency department. JAMA Psychiatry 2018;75:894–900.'),
  r('nice-ng225', 2022, 'guideline', 'NICE guideline NG225. Self-harm: assessment, management and preventing recurrence (2022) — do not use risk assessment tools or scales to predict future suicide or to decide who gets treatment.', 'https://www.nice.org.uk/guidance/ng225'),
  r('dazzi-2014', 2014, 'meta-analysis', 'Dazzi T et al. Does asking about suicide and related behaviours induce suicidal ideation? What is the evidence? Psychol Med 2014;44:3361–3363.'),
  r('cssrs-2011', 2011, 'instrument', 'Posner K et al. The Columbia–Suicide Severity Rating Scale: initial validity and internal consistency findings. Am J Psychiatry 2011;168:1266–1277.'),
  r('asq-2012', 2012, 'instrument', 'Horowitz LM et al. Ask Suicide-Screening Questions (ASQ): a brief instrument for the pediatric emergency department. Arch Pediatr Adolesc Med 2012;166:1170–1176.'),
  r('beta-2012', 2012, 'guideline', 'Richmond JS et al. Verbal de-escalation of the agitated patient: consensus statement of the American Association for Emergency Psychiatry Project BETA De-escalation Workgroup. West J Emerg Med 2012;13:17–25.'),
  r('mind-usa-2018', 2018, 'trial', 'Girard TD et al. Haloperidol and ziprasidone for treatment of delirium in critical illness (MIND-USA). N Engl J Med 2018;379:2506–2516.'),
  r('inouye-1999', 1999, 'trial', 'Inouye SK et al. A multicomponent intervention to prevent delirium in hospitalized older patients. N Engl J Med 1999;340:669–676.'),
  r('hunter-2003', 2003, 'instrument', 'Dunkley EJ et al. The Hunter Serotonin Toxicity Criteria: simple and accurate diagnostic decision rules for serotonin toxicity. QJM 2003;96:635–642.'),
  r('boyer-2005', 2005, 'review', 'Boyer EW, Shannon M. The serotonin syndrome. N Engl J Med 2005;352:1112–1120.'),
  r('gurrera-2011', 2011, 'criteria', 'Gurrera RJ et al. An international consensus study of neuroleptic malignant syndrome diagnostic criteria using the Delphi method. J Clin Psychiatry 2011;72:1222–1228.'),
  r('bush-1996', 1996, 'instrument', 'Bush G, Fink M, Petrides G, Dowling F, Francis A. Catatonia. I. Rating scale and standardized examination. Acta Psychiatr Scand 1996;93:129–136.'),
  r('fourat-2021', 2021, 'meta-analysis', 'Tieges Z et al. Diagnostic accuracy of the 4AT for delirium detection in older adults: systematic review and meta-analysis. Age Ageing 2021;50:733–743.'),
  r('appelbaum-2007', 2007, 'review', 'Appelbaum PS. Assessment of patients’ competence to consent to treatment. N Engl J Med 2007;357:1834–1840.'),
]

export const REFERENCE_MAP: Record<string, Reference> = Object.fromEntries(REFERENCES.map((ref) => [ref.id, ref]))
