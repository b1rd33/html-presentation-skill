const CONFIG = { brand: 'STRATEGIC INSIGHTS', theme: 'editorial' };

const SLIDES = [
  {
    type: 'title',
    title: 'The Future of AI Regulation in the EU',
    subtitle: 'Policy Analysis & Strategic Assessment',
    tagline: 'Briefing No. 2026-017 | March 2026',
    notes: 'Set the analytical frame. This briefing covers the regulatory trajectory from the AI Act through proposed amendments and their implications for technology companies operating in or selling into the European Union.'
  },
  {
    type: 'section',
    title: 'Regulatory Landscape',
    subtitle: 'From the AI Act to the emerging enforcement regime',
    pills: ['EU Policy', 'Artificial Intelligence', 'Technology Regulation', 'Digital Single Market'],
    notes: 'This section contextualizes where EU AI regulation sits as of early 2026. The AI Act entered into force in August 2024 with phased implementation. We are now in the critical period where enforcement architecture is being built.'
  },
  {
    type: 'text',
    title: 'Executive Summary',
    body: 'The European Union has entered the enforcement phase of the AI Act, the world\'s first comprehensive regulatory framework for artificial intelligence. As of March 2026, three critical dynamics are shaping the landscape:\n\nFirst, the newly established European AI Office has begun issuing guidance documents that significantly expand the practical scope of compliance obligations beyond what the legislative text anticipated.\n\nSecond, member states are diverging in their transposition approaches, creating a fragmented enforcement landscape that undermines the regulation\'s stated goal of harmonization.\n\nThird, proposed amendments to address foundation models and general-purpose AI systems are accelerating through the legislative process, driven by political pressure following several high-profile AI incidents in late 2025.\n\nThis briefing assesses the current regulatory posture, identifies key risk vectors for technology firms, and provides a forward-looking assessment of the policy trajectory through 2028.',
    notes: 'Read the executive summary verbatim or paraphrase closely. The three dynamics are the analytical backbone of the entire briefing.'
  },
  {
    type: 'quote',
    title: 'Political Context',
    quote: 'Europe must not become a museum of innovation. But neither can we allow algorithmic systems to operate in a regulatory vacuum while they reshape our labor markets, our democratic processes, and our social fabric.',
    attribution: 'Thierry Breton',
    role: 'European Commissioner for Internal Market (2019-2024)',
    notes: 'This quote captures the fundamental tension in EU tech policy: the desire to foster innovation against the precautionary principle. Breton was instrumental in shaping the AI Act before his departure. His successor has adopted a notably more enforcement-oriented posture.'
  },
  {
    type: 'numbers',
    title: 'Regulatory Scale & Scope',
    items: [
      { value: '~6,800', label: 'High-Risk AI Systems', desc: 'Estimated systems requiring registration', color: 'primary' },
      { value: '27', label: 'Member States', desc: 'Each establishing national authorities', color: 'info' },
      { value: '35M', label: 'Maximum Fine', desc: 'Or 7% of global turnover', color: 'danger' },
      { value: '24 mo', label: 'Full Compliance Deadline', desc: 'August 2026 for most provisions', color: 'warning' }
    ],
    notes: 'The 6,800 figure comes from the Commission\'s own impact assessment, but industry groups estimate the true number may be 2-3x higher due to ambiguity in high-risk classification. The fine structure mirrors GDPR\'s approach — percentage of global revenue, not fixed amounts.'
  },
  {
    type: 'table',
    title: 'Implementation Timeline',
    headers: ['Date', 'Milestone', 'Scope', 'Status'],
    highlightCol: 3,
    rows: [
      ['Aug 2024', 'AI Act enters into force', 'Full regulation', 'Complete'],
      ['Feb 2025', 'Prohibited practices ban', 'Social scoring, mass surveillance', 'In effect'],
      ['Aug 2025', 'GPAI model obligations', 'Foundation models, systemic risk', 'In effect'],
      ['Mar 2026', 'EU AI Office operational', 'Enforcement coordination', 'Active'],
      ['Aug 2026', 'High-risk system compliance', 'Full registration & conformity', 'Approaching'],
      ['Aug 2027', 'Full enforcement', 'All provisions, all penalties', 'Pending']
    ],
    notes: 'Walk through the timeline chronologically. Emphasize that we are currently between the GPAI obligations taking effect and the high-risk compliance deadline. This is the window where most companies are making go/no-go decisions on European market participation.'
  },
  {
    type: 'metrics',
    title: 'Member State Divergence',
    subtitle: 'Transposition progress and enforcement posture as of Q1 2026',
    metrics: [
      { value: '11', label: 'National Authorities', desc: 'Established and operational', color: 'success' },
      { value: '8', label: 'In Progress', desc: 'Authority designated, not staffed', color: 'warning' },
      { value: '8', label: 'Lagging', desc: 'No authority designated', color: 'danger' },
      { value: '3', label: 'Guidance Documents', desc: 'Conflicting national interpretations', color: 'info' }
    ],
    notes: 'The divergence is the most significant implementation risk. France, Germany, and the Netherlands have operational authorities with different enforcement philosophies. France is taking a light-touch, innovation-friendly approach; Germany is adopting strict interpretation aligned with its data protection tradition.'
  },
  {
    type: 'risk-table',
    title: 'Key Risk Vectors for Technology Firms',
    risks: [
      {
        risk: 'High-risk classification ambiguity',
        severity: 'high',
        likelihood: 'high',
        mitigation: 'Conduct proactive internal classification audit; engage with EU AI Office for pre-market guidance'
      },
      {
        risk: 'Foundation model systemic risk designation',
        severity: 'high',
        likelihood: 'medium',
        mitigation: 'Prepare compute threshold documentation; establish model card and transparency frameworks'
      },
      {
        risk: 'Member state enforcement fragmentation',
        severity: 'medium',
        likelihood: 'high',
        mitigation: 'Establish compliance baseline to strictest national interpretation (Germany)'
      },
      {
        risk: 'Extraterritorial reach to non-EU providers',
        severity: 'high',
        likelihood: 'medium',
        mitigation: 'Appoint EU authorized representative; assess data localization requirements'
      },
      {
        risk: 'Proposed amendments expanding scope to GPAI outputs',
        severity: 'medium',
        likelihood: 'medium',
        mitigation: 'Monitor legislative calendar; engage trade associations for impact assessment'
      }
    ],
    notes: 'Spend time on the first and fourth risks. Classification ambiguity is already generating compliance paralysis among mid-market firms. Extraterritorial reach affects every US and Asian technology company with European customers.'
  },
  {
    type: 'assessment',
    title: 'Strategic Assessment',
    subtitle: 'Net impact on the global AI industry',
    verdict: { label: 'SIGNIFICANT DISRUPTION — MANAGEABLE WITH PREPARATION', color: 'warning' },
    pros: [
      'Regulatory clarity reduces long-term uncertainty for compliant firms',
      'First-mover advantage for companies that build compliance infrastructure early',
      'Harmonized framework preferable to 27 national regulations',
      'Consumer trust premium in regulated markets may accelerate B2B adoption',
      'Brussels Effect likely to establish global baseline, reducing future compliance costs'
    ],
    cons: [
      'Compliance costs estimated at 5-12% of AI R&D budgets for affected firms',
      'Innovation velocity reduction in high-risk application domains',
      'Regulatory arbitrage risk as firms relocate development to less regulated jurisdictions',
      'Classification ambiguity creates litigation and enforcement uncertainty',
      'Proposed amendments signal ongoing regulatory instability through at least 2028'
    ],
    notes: 'The verdict is deliberately balanced. The EU AI Act is not existentially threatening but it is operationally significant. The Brussels Effect point is critical — companies that comply with the EU framework will likely find themselves ahead of regulatory curves in other jurisdictions.'
  },
  {
    type: 'text',
    title: 'Recommendations',
    preTitle: 'Action Items',
    body: 'Based on this analysis, we recommend the following strategic posture for technology firms with EU market exposure:\n\n- Immediate: Conduct an internal AI system inventory and preliminary high-risk classification assessment before the August 2026 deadline\n- Q2 2026: Establish or designate an AI compliance function, distinct from data protection, with direct reporting to the C-suite\n- Q3 2026: Implement technical documentation and model card frameworks that satisfy the most stringent member state interpretation\n- Ongoing: Engage with the EU AI Office consultation process and relevant industry coalitions to shape implementing guidance\n- Strategic: Evaluate whether compliance infrastructure can become a competitive differentiator in enterprise sales cycles',
    notes: 'These recommendations are prioritized by timeline. The internal inventory is the most urgent action — many firms do not have a complete picture of which of their AI systems would qualify as high-risk under the regulation.'
  },
  {
    type: 'closing',
    title: 'Strategic Insights',
    subtitle: 'Briefing No. 2026-017 | Classified: Internal Distribution Only',
    tagline: 'Geopolitical Intelligence for Decision Makers',
    notes: 'Close the briefing. Remind the audience that a follow-up assessment is scheduled for Q3 2026, after the high-risk compliance deadline passes and initial enforcement actions provide data on regulatory posture.'
  }
];
