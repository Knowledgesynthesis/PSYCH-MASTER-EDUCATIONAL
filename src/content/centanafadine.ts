// U.S. indication and scheduling come from different authorities.
export const CENTANAFADINE = {
  name: 'Centanafadine (Simtriyo)',
  indication: 'ADHD in adults and in children and adolescents age 6 or older who weigh at least 20 kg',
  drugClass: 'CNS stimulant and norepinephrine–dopamine–serotonin reuptake inhibitor',
  schedule: 'U.S. Schedule III since October 30, 2026',
  fdaLabelUrl: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/218145s000lbl.pdf',
  deaRuleUrl: 'https://www.govinfo.gov/content/pkg/FR-2026-10-30/html/2026-22208.htm',
} as const

export const CENTANAFADINE_SUMMARY =
  `${CENTANAFADINE.name}: FDA-approved for ${CENTANAFADINE.indication}. ${CENTANAFADINE.schedule}.`
